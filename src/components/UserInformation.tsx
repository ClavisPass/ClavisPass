import React, { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { Chip, Text, Avatar } from "react-native-paper";
import { Skeleton } from "moti/skeleton";
import { View } from "react-native";
import { MotiView } from "moti";
import { useToken } from "../contexts/TokenProvider";
import fetchUserInfo from "../api/fetchUserInfo/fetchUserInfo";
import DropboxLoginButton from "./buttons/DropboxLoginButton";
import UserInfoType from "../types/UserInfoType";
import { useTheme } from "../contexts/ThemeProvider";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  changeEditTokenVisibility?: (value: boolean) => void;
  setUserInfo?: (userInfo: UserInfoType) => void;
};

function UserInformation(props: Props) {
  const { token, removeToken, tokenType } = useToken();
  const { darkmode } = useTheme();
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
  }, [token]);

  useEffect(() => {
    props.setUserInfo?.(userInfo);
  }, [userInfo]);

  return (
    <View
      style={{
        height: token ? 56 : 44,
        width: "100%",
      }}
    >
      {token ? (
        <MotiView
          from={{ opacity: 0, translateY: -4 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: "timing", duration: 250 }}
        >
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
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "timing", duration: 300, delay: 100 }}
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                {userInfo.avatar ? (
                  <Avatar.Image size={30} source={{ uri: userInfo.avatar }} />
                ) : (
                  <Avatar.Text size={30} label={userInfo.username.charAt(0)} />
                )}
                <Text
                  variant="bodyLarge"
                  style={{ userSelect: "none" }}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {userInfo.username}
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
              </MotiView>
            ) : (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Skeleton
                  show
                  height={30}
                  width={30}
                  radius={50}
                  colorMode={darkmode ? "dark" : "light"}
                />
                <Skeleton
                  show
                  height={20}
                  width={100}
                  radius={6}
                  colorMode={darkmode ? "dark" : "light"}
                />
              </View>
            )}
          </View>
        </MotiView>
      ) : (
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 300 }}
        >
          <DropboxLoginButton />
        </MotiView>
      )}
    </View>
  );
}

export default UserInformation;
