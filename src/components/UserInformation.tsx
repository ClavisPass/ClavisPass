import React, { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

import { Text, Chip, ActivityIndicator, IconButton } from "react-native-paper";

import { View } from "react-native";

import { Image } from "expo-image";
import { useToken } from "../contexts/TokenProvider";
import fetchUserInfo from "../api/fetchUserInfo";
import DropboxLoginButton from "./buttons/DropboxLoginButton";
import UserInfoType from "../types/UserInfoType";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  changeEditTokenVisibility?: (value: boolean) => void;
  setUserInfo?: (userInfo: UserInfoType) => void;
};

function UserInformation(props: Props) {
  const { token, removeToken, tokenType } = useToken();
  const [userInfo, setUserInfo] = useState<UserInfoType>(null);
  const [loading, setLoading] = useState(false);

  const fetch = (token: string) => {
    console.log("TRY");
    setLoading(true);
    fetchUserInfo(token, tokenType, setUserInfo, () => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetch(token);
    }
    setLoading(false)
  }, [token, loading]);

  useEffect(() => {
    props.setUserInfo?.(userInfo)
  }, [userInfo]);

  return (
    <>
      {token ? (
        <>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              width: "100%",
              height: 30,
            }}
          >
            {userInfo ? (
              <>
                {userInfo.avatar && (
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      margin: 0,
                      borderRadius: 50,
                    }}
                    source={userInfo?.avatar}
                    contentFit="cover"
                    transition={250}
                  />
                )}
                <Text variant="bodyLarge">{`Hello ${userInfo?.username}!`}</Text>
              </>
            ) : (
              <>
                {loading ? (
                  <View style={{ flex: 1 }}>
                    <ActivityIndicator animating={true} />
                  </View>
                ) : (
                  <>
                    <Icon name="wifi-remove" size={20} />
                    <IconButton
                      icon={"replay"}
                      size={20}
                      onPress={() => {
                        fetch(token);
                      }}
                    />
                  </>
                )}
              </>
            )}
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              width: "100%",
            }}
          >
            {tokenType === "Dropbox" && (
              <Chip
                onPress={() => {
                  props.changeEditTokenVisibility?.(true);
                }}
                icon="dropbox"
              >
                Dropbox
              </Chip>
            )}
            {tokenType === "GoogleDrive" && (
              <Chip icon="check">Google Drive</Chip>
            )}
            <Chip
              onPress={() => {
                removeToken();
                setUserInfo(null);
              }}
              icon="logout"
            >
              Logout
            </Chip>
          </View>
        </>
      ) : (
        <>
          {/*<GoogleDriveLoginButton />*/}
          <DropboxLoginButton />
        </>
      )}
    </>
  );
}

export default UserInformation;
