import React, { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

import { Text, IconButton } from "react-native-paper";

import { View } from "react-native";

import { Image } from "expo-image";
import { useToken } from "../contexts/TokenProvider";
import fetchUserInfo from "../api/fetchUserInfo";
import GoogleDriveLoginButton from "./GoogleDriveLoginButton";

WebBrowser.maybeCompleteAuthSession();

function GoogleDrive() {
  const { token, setToken } = useToken();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (token) {
      fetchUserInfo(token, setUserInfo);
    }
  }, [token]);

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
              setToken(null);
              setUserInfo(null);
            }}
          />
        </View>
      )}
      {token ? <></> : <GoogleDriveLoginButton />}
    </>
  );
}

export default GoogleDrive;
