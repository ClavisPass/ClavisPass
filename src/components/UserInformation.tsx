import React, { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

import { Chip, ActivityIndicator, Text, Avatar } from "react-native-paper";

import { View } from "react-native";

import { useToken } from "../contexts/TokenProvider";
import fetchUserInfo from "../api/fetchUserInfo";
import DropboxLoginButton from "./buttons/DropboxLoginButton";
import UserInfoType from "../types/UserInfoType";

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
    setLoading(false);
  }, [token, loading]);

  useEffect(() => {
    props.setUserInfo?.(userInfo);
  }, [userInfo]);

  return (
    <>
      {token ? (
        <>
          <View
            style={{
              flex: 1,
              display: "flex",
              padding: 10,
              paddingLeft: 4,
              minWidth: 140,
              minHeight: 54,
              height: 30,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            {userInfo ? (
              <>
                {userInfo.avatar ? (
                  <Avatar.Image
                    size={30}
                    style={{
                      margin: 0,
                    }}
                    source={{ uri: userInfo?.avatar }}
                  />
                ) : (
                  <Avatar.Text size={30} label={userInfo?.username.charAt(0)} />
                )}
                <Text
                  variant="bodyLarge"
                  style={{ userSelect: "none" }}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {userInfo?.username}
                </Text>
                <Chip
                  onPress={() => {
                    removeToken();
                    setUserInfo(null);
                  }}
                  icon="logout"
                >
                  Logout
                </Chip>
              </>
            ) : (
              <>
                {loading ? (
                  <View style={{ flex: 1 }}>
                    <ActivityIndicator animating={true} />
                  </View>
                ) : (
                  <>
                    {/*<Icon name="wifi-remove" size={20} />
                    <IconButton
                      icon={"replay"}
                      size={20}
                      onPress={() => {
                        fetch(token);
                      }}
                    />*/}
                  </>
                )}
              </>
            )}
          </View>
        </>
      ) : (
        <DropboxLoginButton />
      )}
    </>
  );
}

export default UserInformation;
