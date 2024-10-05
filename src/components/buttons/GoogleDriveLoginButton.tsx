import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import { Button } from "react-native-paper";

import { Platform } from "react-native";

import { useToken } from "../../contexts/TokenProvider";
import { useEffect } from "react";

const CLIENT_ID_WEB =
  "838936511257-vavcs00oa2dgv2ikvv5a2upt7oa4kdsg.apps.googleusercontent.com";

const CLIENT_ID_ANDROID =
  "838936511257-vg2gndum9lnn7l3kntr4ekddpgo7ed6i.apps.googleusercontent.com";
const REDIRECT_URI = AuthSession.makeRedirectUri({
  //useProxy: Platform.select({ web: false, default: true }),
});
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

WebBrowser.maybeCompleteAuthSession();

function GoogleDriveLoginButton() {
  const { token, setToken } = useToken();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: Platform.OS === "web" ? CLIENT_ID_WEB : CLIENT_ID_ANDROID,
      redirectUri: REDIRECT_URI,
      scopes: SCOPES,
      responseType: "token",
      usePKCE: false,
      prompt: AuthSession.Prompt.SelectAccount,
    },
    {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
      revocationEndpoint: "https://oauth2.googleapis.com/revoke",
    }
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  const handleAuth = async () => {
    promptAsync();
  };

  return (
    <Button icon={"google-drive"} mode="contained-tonal" onPress={handleAuth}>
      Sign in with Google
    </Button>
  );
}

export default GoogleDriveLoginButton;
