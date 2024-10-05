import React, { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

import { Text, IconButton, Chip } from "react-native-paper";

import { View } from "react-native";

import { Image } from "expo-image";
import { useToken } from "../contexts/TokenProvider";
import fetchUserInfo from "../api/fetchUserInfo";
import GoogleDriveLoginButton from "./buttons/GoogleDriveLoginButton";
import DropboxLoginButton from "./buttons/DropboxLoginButton";
import UserInfoType from "../types/UserInfoType";

WebBrowser.maybeCompleteAuthSession();

function UserInformation() {
  const { token, removeToken, tokenType } = useToken();
  const [userInfo, setUserInfo] = useState<UserInfoType>(null);

  useEffect(() => {
    if (token) {
      fetchUserInfo(token, tokenType, setUserInfo);
    }
  }, [token]);

  return (
    <>
      {token ? (
        <>
          {userInfo ? (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                width: "100%",
              }}
            >
              {userInfo.avatar &&
                <Image
                  style={{ width: 30, height: 30, margin: 0, borderRadius: 50 }}
                  source={userInfo?.avatar}
                  contentFit="cover"
                  transition={250}
                />
              }
              <Text>{`Hello ${userInfo?.username}`}</Text>
            </View>
          ) : (
            <Text>{`Unavailable`}</Text>
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              width: "100%",
            }}
          >
            {tokenType === "Dropbox" && <Chip icon="check">Dropbox</Chip>}
            {tokenType === "GoogleDrive" && (
              <Chip icon="check">Google Drive</Chip>
            )}
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
        </>
      ) : (
        <>
          <GoogleDriveLoginButton />
          <DropboxLoginButton />
        </>
      )}
    </>
  );
}

export default UserInformation;
