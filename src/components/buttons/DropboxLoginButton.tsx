import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import { useToken } from "../../contexts/TokenProvider";
import { useEffect, useState } from "react";

import { DROPBOX_CLIENT_ID } from "@env";
import SettingsItem from "../items/SettingsItem";
import { Platform } from "react-native";

import { onOpenUrl } from "@tauri-apps/plugin-deep-link";
const REDIRECT_URI = getRedirectUri();
const SCOPES = ["account_info.read files.content.read files.content.write"];

WebBrowser.maybeCompleteAuthSession();

export function getRedirectUri(): string {
  if (Platform.OS === "web") {
    const isDev = process.env.NODE_ENV === "development";
    if (isDev)
      return AuthSession.makeRedirectUri({
        preferLocalhost: true,
      });
    return "clavispass://redirect";
  }
  return AuthSession.makeRedirectUri({
    native: "clavispass://redirect",
  });
}

function DropboxLoginButton() {
  const { setToken, setRefreshToken, saveRefreshToken, checkTokenType } =
    useToken();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "kzgl7hhvg4juwnq",
      redirectUri: REDIRECT_URI,
      scopes: SCOPES,
      responseType: "code",
      usePKCE: true,
      extraParams: {
        token_access_type: "offline",
      },
    },
    {
      authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
      tokenEndpoint: "https://api.dropboxapi.com/oauth2/token",
    }
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      const exchangeToken = async () => {
        try {
          const tokenResponse = await fetch(
            "https://api.dropboxapi.com/oauth2/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                code: code,
                grant_type: "authorization_code",
                client_id: DROPBOX_CLIENT_ID,
                redirect_uri: REDIRECT_URI,
                code_verifier: request?.codeVerifier || "",
              }).toString(),
            }
          );

          const data = await tokenResponse.json();

          if (data.access_token && data.refresh_token) {
            setToken(data.access_token);
            setRefreshToken(data.refresh_token);
            saveRefreshToken(data.refresh_token);
          } else {
            console.error("Token response error:", data);
          }
        } catch (error) {
          console.error("Token exchange error:", error);
        }
      };

      exchangeToken();
    }
  }, [response]);

  useEffect(() => {
    onOpenUrl((url) => {
      console.log("🔗 Received deep link while running:", url);
    });
  }, []);

  const handleAuth = async () => {
    promptAsync();
  };

  return (
    <SettingsItem leadingIcon="dropbox" onPress={handleAuth}>
      Sign in with Dropbox
    </SettingsItem>
  );
}

export default DropboxLoginButton;
