import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useMemo, useRef, useCallback } from "react";
import { Platform } from "react-native";
import SettingsItem from "../items/SettingsItem";
import { GOOGLE_CLIENT_ID } from "@env";
import { start, onUrl, cancel } from "@fabianlars/tauri-plugin-oauth";
import * as Random from "expo-random";
import { logger } from "../../utils/logger";
import { useToken } from "../../contexts/CloudProvider";
import { useData } from "../../contexts/DataProvider";
import { G } from "react-native-svg";

WebBrowser.maybeCompleteAuthSession();

// Scopes für Google Drive (angepasst auf deinen Use Case)
const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.appdata",
];

const isMobile = Platform.OS === "ios" || Platform.OS === "android";
const isWeb = Platform.OS === "web";

// -------- Helpers --------
function getMobileRedirectUri() {
  // Wichtig: Für iOS/Android musst du dein Custom Scheme bei Google als Redirect-URI registrieren.
  return AuthSession.makeRedirectUri({ native: "clavispass://redirect" });
}

async function randState(len = 32) {
  const bytes = await Random.getRandomBytesAsync(len);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function GoogleDriveLoginButton() {
  const { setSession } = useToken();
  const { setShowSave } = useData();

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
        const res = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code,
            grant_type: "authorization_code",
            client_id: GOOGLE_CLIENT_ID,
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
          setShowSave(true);
        } else {
          logger.error("[GoogleDrive] Token response missing tokens:", data);
        }
      } catch (err) {
        logger.error("[GoogleDrive] Token exchange error:", err);
      }
    },
    [setSession]
  );

  const MOBILE_REDIRECT_URI = useMemo(
    () => (isMobile ? getMobileRedirectUri() : "http://127.0.0.1/unused"),
    [isMobile]
  );

  // Expo Auth Request (Mobile)
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      redirectUri: MOBILE_REDIRECT_URI,
      scopes: SCOPES,
      responseType: "code",
      usePKCE: true,
      extraParams: {
        access_type: "offline", // wichtig für Refresh-Token
        prompt: "consent", // erzwingt Consent, damit offline-Zugriff gewährt wird
      },
    },
    {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
    }
  );

  // Mobile-Flow
  useEffect(() => {
    if (!isMobile) return;
    if (response?.type === "success") {
      const { code } = response.params;
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

  const closeAuthWindowIfAny = useCallback(async () => {
    try {
      const tauri = require("@tauri-apps/api/webviewWindow");
      const win = await tauri.WebviewWindow.getByLabel("GoogleDriveAuth");
      win.close();
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    } catch {}
    popupRef.current = null;
  }, []);

  // Tauri/Web-Flow
  const handleTauriAuth = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;

    const prePopup = window.open(
      "about:blank",
      "GoogleDriveAuth",
      "width=720,height=840"
    );

    if (!prePopup) {
      logger.warn(
        "[GoogleDrive] Popup konnte nicht geöffnet werden (Popup-Blocker/Policy)."
      );
      busyRef.current = false;
      return;
    }
    popupRef.current = prePopup;
    try {
      prePopup.document.title = "Google Drive Login …";
      prePopup.document.body.innerHTML =
        "<p style='font-family:system-ui;margin:16px'></p>";
    } catch {}

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
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        const u = new URL(url);
        const code = u.searchParams.get("code");
        const state = u.searchParams.get("state");
        const error = u.searchParams.get("error");

        if (error) {
          logger.warn("[GoogleDrive] OAuth error:", error);
          return;
        }

        if (!code) return;
        if (!state || state !== stateRef.current) {
          logger.warn(
            "[GoogleDrive] State mismatch (tauri). Ignoring callback."
          );
          return;
        }

        stateRef.current = null;

        try {
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
          }
        } catch {}
        closeAuthWindowIfAny();

        busyRef.current = false;

        (async () => {
          try {
            await exchangeToken(code, redirectUri, codeVerifier);
          } catch (e) {
            logger.error("[GoogleDrive] Token exchange (bg) failed:", e);
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
        logger.warn("[GoogleDrive] OAuth timeout – kein Redirect erhalten.");
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

      logger.info("[GoogleDrive] Redirect URI: ", redirectUri);
      logger.info("[GoogleDrive] ClientID: ", GOOGLE_CLIENT_ID);

      // 5) Auth-URL
      const authUrl =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          response_type: "code",
          redirect_uri: redirectUri,
          scope: SCOPES.join(" "),
          access_type: "offline", // Refresh-Token
          prompt: "consent", // expliziter Consent
          code_challenge: codeChallenge,
          code_challenge_method: method, // "S256"
          state: stateRef.current!,
        }).toString();

      try {
        prePopup.location.href = authUrl;
      } catch (e) {
        logger.warn("[GoogleDrive] Konnte Popup nicht navigieren:", e);
      }
    } catch (err) {
      logger.error("[GoogleDrive] OAuth flow failed (Tauri):", err);
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
      busyRef.current = false;
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
    if (isWeb) {
      handleTauriAuth();
    } else if (isMobile) {
      promptAsync();
    } else {
      logger.error("[GoogleDrive] Unsupported platform for this auth flow.");
    }
  }, [handleTauriAuth, promptAsync]);

  if (Platform.OS !== "web") {
    return null;
  }

  return (
    <SettingsItem leadingIcon="google-drive" onPress={handleAuth}>
      Sign in with Google Drive
    </SettingsItem>
  );
}

export default GoogleDriveLoginButton;
