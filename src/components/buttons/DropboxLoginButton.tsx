import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import { Button } from "react-native-paper";

import { useToken } from "../../contexts/TokenProvider";
import { useEffect } from "react";

import { DROPBOX_CLIENT_ID } from '@env';
const REDIRECT_URI = AuthSession.makeRedirectUri({});
const SCOPES = ["account_info.read files.content.read files.content.write"];

WebBrowser.maybeCompleteAuthSession();

function DropboxLoginButton() {
  const { setToken, setRefreshToken } = useToken();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: DROPBOX_CLIENT_ID,
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
      //revocationEndpoint: "https://api.dropboxapi.com/oauth2/token/revoke",
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

          console.log(data);

          if (data.access_token && data.refresh_token) {
            console.log("Access Token:", data.access_token);
            setToken(data.access_token);
            console.log("Refresh Token:", data.refresh_token);
            setRefreshToken(data.refresh_token);
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

  const handleAuth = async () => {
    console.log(DROPBOX_CLIENT_ID)
    console.log("redirectURI: " + REDIRECT_URI);
    promptAsync();
  };

  return (
    <Button icon={"dropbox"} mode="contained-tonal" onPress={handleAuth}>
      Sign in with Dropbox
    </Button>
  );
}

export default DropboxLoginButton;
