import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Platform } from "react-native";
import { GOOGLE_CLIENT_ID_DESKTOP } from "@env";
import { cancel, onUrl, start } from "@fabianlars/tauri-plugin-oauth";
import * as Random from "expo-random";
import SettingsItem from "../../settings/components/SettingsItem";
import { useToken } from "../../../app/providers/CloudProvider";
import { useVault } from "../../../app/providers/VaultProvider";
import { logger } from "../../../infrastructure/logging/logger";
import {
  getGoogleClientIdForCurrentPlatform,
  getGoogleMobileRedirectUri,
} from "../../../infrastructure/cloud/utils/googleOAuth";
import {
  closeOAuthPopupWindow,
  openOAuthPopupWindow,
} from "../utils/oauthPopup";

WebBrowser.maybeCompleteAuthSession();

const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.appdata",
];

const isMobile = Platform.OS === "ios" || Platform.OS === "android";
const isWeb = Platform.OS === "web";

function getMobileRedirectUri() {
  const redirectUri = getGoogleMobileRedirectUri();

  if (!redirectUri) {
    return null;
  }

  return AuthSession.makeRedirectUri({ native: redirectUri });
}

async function randState(len = 32) {
  const bytes = await Random.getRandomBytesAsync(len);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function GoogleDriveLoginButton() {
  const { setSession } = useToken();
  const vault = useVault();
  const currentClientId = getGoogleClientIdForCurrentPlatform();
  const desktopClientId = GOOGLE_CLIENT_ID_DESKTOP || currentClientId;

  const unsubscribeRef = useRef<null | (() => void)>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busyRef = useRef(false);
  const portRef = useRef<number | null>(null);
  const stateRef = useRef<string | null>(null);

  const exchangeToken = useCallback(
    async (code: string, redirectUri: string, codeVerifier?: string) => {
      try {
        const res = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code,
            grant_type: "authorization_code",
            client_id: currentClientId,
            redirect_uri: redirectUri,
            ...(codeVerifier ? { code_verifier: codeVerifier } : {}),
          }).toString(),
        });

        const data = await res.json();
        if (!res.ok) {
          logger.error("[GoogleDrive] Token exchange failed:", data);
          return;
        }

        if (data.access_token && data.refresh_token) {
          await setSession({
            provider: "googleDrive",
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
          });
          vault.update((draft) => {
            draft.version = draft.version;
          });
        } else {
          logger.error("[GoogleDrive] Token response missing tokens:", data);
        }
      } catch (err) {
        logger.error("[GoogleDrive] Token exchange error:", err);
      }
    },
    [currentClientId, setSession, vault]
  );

  const mobileRedirectUri = useMemo(
    () => (isMobile ? getMobileRedirectUri() : "http://127.0.0.1/unused"),
    []
  );

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: currentClientId || "",
      redirectUri: mobileRedirectUri || "http://127.0.0.1/unused",
      scopes: SCOPES,
      responseType: "code",
      usePKCE: true,
      extraParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
    {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
    }
  );

  useEffect(() => {
    if (!isMobile || response?.type !== "success") {
      return;
    }

    const { code } = response.params;
    const verifier = request?.codeVerifier || "";

    if (!mobileRedirectUri) {
      logger.error("[GoogleDrive] Missing mobile redirect URI for Google OAuth.");
      return;
    }

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
        const error = parsedUrl.searchParams.get("error");

        if (error) {
          logger.warn("[GoogleDrive] OAuth error:", error);
          return;
        }

        if (!code) {
          return;
        }

        if (!state || state !== stateRef.current) {
          logger.warn("[GoogleDrive] State mismatch (tauri). Ignoring callback.");
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
            logger.error("[GoogleDrive] Token exchange (bg) failed:", error);
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
        logger.warn("[GoogleDrive] OAuth timeout - kein Redirect erhalten.");
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

      logger.info("[GoogleDrive] Redirect URI: ", redirectUri);
      logger.info("[GoogleDrive] ClientID: ", desktopClientId);

      const authUrl =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
          client_id: desktopClientId,
          response_type: "code",
          redirect_uri: redirectUri,
          scope: SCOPES.join(" "),
          access_type: "offline",
          prompt: "consent",
          code_challenge: codeChallenge,
          code_challenge_method: method,
          state: stateRef.current!,
        }).toString();

      await openOAuthPopupWindow(authUrl, "Google Drive Login");
    } catch (err) {
      logger.error("[GoogleDrive] OAuth flow failed (Tauri):", err);
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
  }, [closeAuthWindowIfAny, desktopClientId, exchangeToken]);

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
      return;
    }

    if (isMobile) {
      if (!currentClientId) {
        logger.error("[GoogleDrive] Missing Google mobile client ID.");
        return;
      }

      if (!mobileRedirectUri) {
        logger.error(
          "[GoogleDrive] Missing Google mobile redirect URI. Check platform client ID setup."
        );
        return;
      }

      promptAsync();
      return;
    }

    logger.error("[GoogleDrive] Unsupported platform for this auth flow.");
  }, [currentClientId, handleTauriAuth, mobileRedirectUri, promptAsync]);

  return (
    <SettingsItem leadingIcon="google-drive" onPress={handleAuth}>
      Sign in with Google Drive
    </SettingsItem>
  );
}

export default GoogleDriveLoginButton;
