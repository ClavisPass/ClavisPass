import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Platform } from "react-native";
import SettingsItem from "../../settings/components/SettingsItem";
import { DROPBOX_CLIENT_ID } from "@env";
import { cancel, onUrl, start } from "@fabianlars/tauri-plugin-oauth";
import * as Random from "expo-random";
import { logger } from "../../../infrastructure/logging/logger";
import { useToken } from "../../../app/providers/CloudProvider";
import { useVault } from "../../../app/providers/VaultProvider";
import { getAppRedirectUri } from "../../../shared/utils/appScheme";
import {
  closeOAuthPopupWindow,
  openOAuthPopupWindow,
} from "../utils/oauthPopup";

WebBrowser.maybeCompleteAuthSession();

const SCOPES = [
  "account_info.read",
  "files.content.read",
  "files.content.write",
];

const isMobile = Platform.OS === "ios" || Platform.OS === "android";
const isWeb = Platform.OS === "web";

function getMobileRedirectUri() {
  return AuthSession.makeRedirectUri({ native: getAppRedirectUri() });
}

async function randState(len = 32) {
  const bytes = await Random.getRandomBytesAsync(len);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function DropboxLoginButton() {
  const { setSession } = useToken();
  const vault = useVault();

  const unsubscribeRef = useRef<null | (() => void)>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busyRef = useRef(false);
  const portRef = useRef<number | null>(null);
  const stateRef = useRef<string | null>(null);

  const exchangeToken = useCallback(
    async (code: string, redirectUri: string, codeVerifier?: string) => {
      try {
        const res = await fetch("https://api.dropboxapi.com/oauth2/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code,
            grant_type: "authorization_code",
            client_id: DROPBOX_CLIENT_ID,
            redirect_uri: redirectUri,
            ...(codeVerifier ? { code_verifier: codeVerifier } : {}),
          }).toString(),
        });
        const data = await res.json();
        if (!res.ok) {
          logger.error("Token exchange failed:", data);
          return;
        }
        if (data.access_token && data.refresh_token) {
          await setSession({
            provider: "dropbox",
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
          });
          vault.update((draft) => {
            draft.version = draft.version;
          });
        } else {
          logger.error("Token response missing tokens:", data);
        }
      } catch (err) {
        logger.error("Token exchange error:", err);
      }
    },
    [setSession, vault]
  );

  const mobileRedirectUri = useMemo(
    () => (isMobile ? getMobileRedirectUri() : "http://127.0.0.1/unused"),
    []
  );

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: DROPBOX_CLIENT_ID,
      redirectUri: mobileRedirectUri,
      scopes: SCOPES,
      responseType: "code",
      usePKCE: true,
      extraParams: { token_access_type: "offline" },
    },
    {
      authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
      tokenEndpoint: "https://api.dropboxapi.com/oauth2/token",
    }
  );

  useEffect(() => {
    if (!isMobile || response?.type !== "success") {
      return;
    }

    const { code } = response.params;
    const verifier = request?.codeVerifier || "";
    exchangeToken(code, mobileRedirectUri, verifier);
  }, [exchangeToken, mobileRedirectUri, request?.codeVerifier, response]);

  const closeAuthWindowIfAny = useCallback(async () => {
    try {
      await closeOAuthPopupWindow();
    } catch {}
  }, []);

  const handleTauriAuth = useCallback(async () => {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;

    try {
      const port = await start({ ports: [57771, 57772, 57773] });
      portRef.current = port;
      const redirectUri = `http://127.0.0.1:${port}`;

      const { createPkcePair } = require("../utils/pkce.web");
      const { codeVerifier, codeChallenge, method } = await createPkcePair();
      stateRef.current = await randState();

      const unsubscribe = await onUrl(async (url) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        const parsedUrl = new URL(url);
        const code = parsedUrl.searchParams.get("code");
        const state = parsedUrl.searchParams.get("state");

        if (!code) {
          return;
        }

        if (!state || state !== stateRef.current) {
          logger.warn("State mismatch (tauri). Ignoring callback.");
          return;
        }

        stateRef.current = null;

        try {
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
          }
        } catch {}

        await closeAuthWindowIfAny();
        busyRef.current = false;

        (async () => {
          try {
            await exchangeToken(code, redirectUri, codeVerifier);
          } catch (error) {
            logger.error("Token exchange (bg) failed:", error);
          } finally {
            try {
              if (portRef.current != null) {
                await cancel(portRef.current);
              }
            } catch {}
            portRef.current = null;
          }
        })();
      });
      unsubscribeRef.current = unsubscribe;

      timeoutRef.current = setTimeout(async () => {
        logger.warn("OAuth timeout - kein Redirect erhalten.");
        try {
          if (portRef.current != null) {
            await cancel(portRef.current);
          }
        } catch {}
        portRef.current = null;

        try {
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
          }
        } catch {}

        await closeAuthWindowIfAny();
        busyRef.current = false;
        stateRef.current = null;
      }, 120_000);

      logger.info("Redirect URI: ", redirectUri);

      const authUrl =
        "https://www.dropbox.com/oauth2/authorize?" +
        new URLSearchParams({
          client_id: DROPBOX_CLIENT_ID,
          response_type: "code",
          redirect_uri: redirectUri,
          token_access_type: "offline",
          scope: SCOPES.join(" "),
          code_challenge: codeChallenge,
          code_challenge_method: method,
          state: stateRef.current!,
        }).toString();

      await openOAuthPopupWindow(authUrl, "Dropbox Login");
    } catch (err) {
      logger.error("OAuth flow failed (Tauri):", err);
      try {
        if (portRef.current != null) {
          await cancel(portRef.current);
        }
      } catch {}
      portRef.current = null;

      try {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      } catch {}

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      stateRef.current = null;
      await closeAuthWindowIfAny();
      busyRef.current = false;
    }
  }, [closeAuthWindowIfAny, exchangeToken]);

  useEffect(() => {
    return () => {
      try {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } catch {}
      timeoutRef.current = null;

      try {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      } catch {}

      (async () => {
        try {
          if (portRef.current != null) {
            await cancel(portRef.current);
          }
        } catch {}
        portRef.current = null;
        await closeAuthWindowIfAny();
      })();

      stateRef.current = null;
      busyRef.current = false;
    };
  }, [closeAuthWindowIfAny]);

  const handleAuth = useCallback(() => {
    if (isWeb) {
      handleTauriAuth();
    } else if (isMobile) {
      promptAsync();
    } else {
      logger.error("Unsupported platform for this auth flow.");
    }
  }, [handleTauriAuth, promptAsync]);

  return (
    <SettingsItem leadingIcon="dropbox" onPress={handleAuth}>
      Sign in with Dropbox
    </SettingsItem>
  );
}

export default DropboxLoginButton;
