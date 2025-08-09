import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useMemo, useRef, useCallback } from "react";
import { Platform } from "react-native";
import SettingsItem from "../items/SettingsItem";
import { useToken } from "../../contexts/TokenProvider";
import { DROPBOX_CLIENT_ID } from "@env";
import { start, onUrl, cancel } from "@fabianlars/tauri-plugin-oauth";
import * as Random from "expo-random";

WebBrowser.maybeCompleteAuthSession();

const SCOPES = [
  "account_info.read",
  "files.content.read",
  "files.content.write",
];
const isMobile = Platform.OS === "ios" || Platform.OS === "android";
// wie gewünscht:
const isTauri = Platform.OS === "web";

// -------- Helpers --------
function getMobileRedirectUri() {
  return AuthSession.makeRedirectUri({ native: "clavispass://redirect" });
}

async function randState(len = 32) {
  const bytes = await Random.getRandomBytesAsync(len);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function DropboxLoginButton() {
  const { setToken, setRefreshToken, saveRefreshToken } = useToken();

  // Flow-Refs
  const unsubscribeRef = useRef<null | (() => void)>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busyRef = useRef(false);
  const portRef = useRef<number | null>(null);
  const stateRef = useRef<string | null>(null);
  const popupRef = useRef<Window | null>(null);

  // Gemeinsamer Token-Exchange
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
          console.error("Token exchange failed:", data);
          return;
        }
        if (data.access_token && data.refresh_token) {
          setToken(data.access_token);
          setRefreshToken(data.refresh_token);
          saveRefreshToken(data.refresh_token);
        } else {
          console.error("Token response missing tokens:", data);
        }
      } catch (err) {
        console.error("Token exchange error:", err);
      }
    },
    [saveRefreshToken, setRefreshToken, setToken]
  );

  // --- Mobile (Expo) ---
  const MOBILE_REDIRECT_URI = useMemo(
    () => (isMobile ? getMobileRedirectUri() : "http://127.0.0.1/unused"),
    [isMobile]
  );

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: DROPBOX_CLIENT_ID,
      redirectUri: MOBILE_REDIRECT_URI,
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
    if (!isMobile) return;
    if (response?.type === "success") {
      const { code } = response.params; // kein eigener state-Check auf Mobile
      const verifier = request?.codeVerifier || "";
      exchangeToken(code, MOBILE_REDIRECT_URI, verifier);
    }
  }, [
    response,
    isMobile,
    MOBILE_REDIRECT_URI,
    request?.codeVerifier,
    exchangeToken,
  ]);

  // --- Tauri (Desktop) ---
  const closeAuthWindowIfAny = useCallback(() => {
    try {
      if (popupRef.current && !popupRef.current.closed)
        popupRef.current.close();
    } catch {}
    popupRef.current = null;
  }, []);

  const handleTauriAuth = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;

    try {
      // 1) Lokalen Listener starten (feste/mehrere Ports optional)
      const port = await start({ ports: [57771, 57772, 57773] });
      portRef.current = port;
      const redirectUri = `http://127.0.0.1:${port}`;

      // 2) PKCE + CSRF state (nur Tauri)
      const { createPkcePair } = require("../../utils/pkce.web");
      const { codeVerifier, codeChallenge, method } = await createPkcePair();
      stateRef.current = await randState();

      // 3) Redirect-Listener – Fenster SOFORT schließen, Rest im Hintergrund
      const unsubscribe = await onUrl(async (url) => {
        // Stoppe Timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        const u = new URL(url);
        const code = u.searchParams.get("code");
        const state = u.searchParams.get("state");
        if (!code) return;
        if (!state || state !== stateRef.current) {
          console.warn("State mismatch (tauri). Ignoring callback.");
          return;
        }

        // a) State leeren
        stateRef.current = null;

        // b) Listener & Popup sofort schließen
        try {
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
          }
        } catch {}
        closeAuthWindowIfAny();

        // c) UI freigeben
        busyRef.current = false;

        // d) Hintergrund-Tasks: Token tauschen + Port schließen
        (async () => {
          try {
            await exchangeToken(code, redirectUri, codeVerifier);
          } catch (e) {
            console.error("Token exchange (bg) failed:", e);
          } finally {
            try {
              if (portRef.current != null) await cancel(portRef.current);
            } catch {}
            portRef.current = null;
          }
        })();
      });
      unsubscribeRef.current = unsubscribe;

      // 4) Timeout (2 min)
      timeoutRef.current = setTimeout(async () => {
        console.warn("OAuth timeout – kein Redirect erhalten.");
        try {
          if (portRef.current != null) await cancel(portRef.current);
        } catch {}
        portRef.current = null;
        try {
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
          }
        } catch {}
        closeAuthWindowIfAny();
        busyRef.current = false;
        stateRef.current = null;
      }, 120_000);

      // 5) Auth-URL
      const authUrl =
        "https://www.dropbox.com/oauth2/authorize?" +
        new URLSearchParams({
          client_id: DROPBOX_CLIENT_ID,
          response_type: "code",
          redirect_uri: redirectUri,
          token_access_type: "offline",
          scope: SCOPES.join(" "),
          code_challenge: codeChallenge,
          code_challenge_method: method, // "S256"
          state: stateRef.current!,
        }).toString();

      // 6) Externes Fenster öffnen
      popupRef.current = window.open(authUrl) ?? null;
      if (!popupRef.current) {
        console.warn("Popup konnte nicht geöffnet werden (Popup-Blocker?).");
      }
    } catch (err) {
      console.error("OAuth flow failed (Tauri):", err);
      busyRef.current = false;

      // Cleanup
      try {
        if (portRef.current != null) await cancel(portRef.current);
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
      closeAuthWindowIfAny();
    }
  }, [exchangeToken, closeAuthWindowIfAny]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
          if (portRef.current != null) await cancel(portRef.current);
        } catch {}
        portRef.current = null;
        closeAuthWindowIfAny();
      })();

      stateRef.current = null;
      busyRef.current = false;
    };
  }, [closeAuthWindowIfAny]);

  // Button
  const handleAuth = useCallback(() => {
    if (isTauri) {
      handleTauriAuth();
    } else if (isMobile) {
      // kein eigener state auf Mobile – Expo handhabt das intern
      promptAsync();
    } else {
      console.error("Unsupported platform for this auth flow.");
    }
  }, [handleTauriAuth, promptAsync]);

  return (
    <SettingsItem leadingIcon="dropbox" onPress={handleAuth}>
      Sign in with Dropbox
    </SettingsItem>
  );
}

export default DropboxLoginButton;
