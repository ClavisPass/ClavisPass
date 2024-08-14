import React, { useState, useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import { Text, Button, IconButton } from "react-native-paper";

import { invoke } from "@tauri-apps/api";
import { Platform, View } from "react-native";
import WebSpecific from "./platformSpecific/WebSpecific";

import { Image } from "expo-image";

async function googleDriveCall(url: string, token: string) {
  try {
    if (Platform.OS === "web") {
      return await invoke("fetch_from_api", { url: url, token: token });
    } else {
      return await fetch(
        "https://cors-anywhere.herokuapp.com/https://www.googleapis.com/oauth2/v3/about",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const CLIENT_ID =
  "838936511257-vavcs00oa2dgv2ikvv5a2upt7oa4kdsg.apps.googleusercontent.com";
const REDIRECT_URI = AuthSession.makeRedirectUri({
  //useProxy: Platform.select({ web: false, default: true }),
});
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

WebBrowser.maybeCompleteAuthSession();

function GoogleDrive() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
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
    if (authToken) {
      fetchUserInfo();
    }
  }, [authToken]);

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setAuthToken(access_token);
    }
  }, [response]);

  const handleAuth = async () => {
    promptAsync();
  };

  const fetchUserInfo = async () => {
    if (authToken) {
      try {
        const fields = "user,storageQuota";
        const response: any = await fetch(
          `https://www.googleapis.com/drive/v3/about?fields=${encodeURIComponent(fields)}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data.user);
          setUserInfo(data.user);
        } else {
          // Handle error response
          const errorData = await response.json();
          console.error("Error fetching user info:", errorData);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }
  };

  const fetchDriveFiles = async () => {
    const response = await fetch("https://www.googleapis.com/drive/v3/files", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <>
      {userInfo && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Image
            style={{ width: 30, height: 30, margin: 0, borderRadius: 50 }}
            source={userInfo.photoLink}
            contentFit="cover"
            transition={250}
          />{" "}
          <Text>{`Hello ${userInfo.displayName}`}</Text>
          <IconButton
            icon={"logout"}
            iconColor={"lightgrey"}
            size={20}
            onPress={() => {
              setAuthToken(null);
              setUserInfo(null);
            }}
          />
        </View>
      )}
      {authToken ? (
        <Button mode="contained-tonal" onPress={fetchDriveFiles}>
          Fetch Drive Files
        </Button>
      ) : (
        <WebSpecific>
          <Button icon={"login"} mode="contained-tonal" onPress={handleAuth}>
            Sign in with Google
          </Button>
        </WebSpecific>
      )}
    </>
  );
}

export default GoogleDrive;
