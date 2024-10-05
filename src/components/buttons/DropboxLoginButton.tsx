import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import { Button } from "react-native-paper";

import { useToken } from "../../contexts/TokenProvider";
import { useEffect } from "react";

const CLIENT_ID =
  "kzgl7hhvg4juwnq";

const REDIRECT_URI = AuthSession.makeRedirectUri({});
const SCOPES = ["account_info.read files.content.read files.content.write"];

WebBrowser.maybeCompleteAuthSession();

function DropboxLoginButton() {
  const { token, setToken } = useToken();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: SCOPES,
      responseType: "token",
      usePKCE: false,
      //prompt: AuthSession.Prompt.SelectAccount,
    },
    {
      authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
      tokenEndpoint: "https://api.dropboxapi.com/oauth2/token",
      revocationEndpoint: "https://api.dropboxapi.com/oauth2/token/revoke",
    }
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  const handleAuth = async () => {
    console.log("redirectURI: "+REDIRECT_URI)
    promptAsync();
  };

  return (
    <Button icon={"dropbox"} mode="contained-tonal" onPress={handleAuth}>
      Sign in with Dropbox
    </Button>
  );
}

export default DropboxLoginButton;
