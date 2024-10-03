import React, { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

import { Text, IconButton } from "react-native-paper";

import { View } from "react-native";

import { Image } from "expo-image";
import { useToken } from "../contexts/TokenProvider";
import fetchUserInfo from "../api/fetchUserInfo";
import GoogleDriveLoginButton from "./buttons/GoogleDriveLoginButton";

WebBrowser.maybeCompleteAuthSession();

function GoogleDriveUser() {
  const { token, removeToken } = useToken();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (token) {
      fetchUserInfo(token, setUserInfo);
    }
  }, [token]);

  return (
    <>
      {token ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            width: "100%",
          }}
        >
          {userInfo ? (
            <>
              <Image
                style={{ width: 30, height: 30, margin: 0, borderRadius: 50 }}
                source={userInfo?.photoLink}
                contentFit="cover"
                transition={250}
              />
              <Text>{`Hello ${userInfo?.displayName}`}</Text>
            </>
          ): <Text>{`Google Drive unavailable`}</Text>}
          <IconButton
            icon={"logout"}
            iconColor={"grey"}
            size={20}
            selected
            mode="contained-tonal"
            onPress={() => {
              removeToken();
              setUserInfo(null);
            }}
          />
        </View>
      ) : (
        <GoogleDriveLoginButton />
      )}
    </>
  );
}

export default GoogleDriveUser;
