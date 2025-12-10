import React, { useState, useEffect, useMemo } from "react";
import * as WebBrowser from "expo-web-browser";
import { Chip, Text, Avatar } from "react-native-paper";
import { Skeleton } from "moti/skeleton";
import { View } from "react-native";
import { MotiView } from "moti";
import DropboxLoginButton from "./buttons/DropboxLoginButton";
import UserInfoType from "../types/UserInfoType";
import { useTheme } from "../contexts/ThemeProvider";
import { useToken } from "../contexts/CloudProvider";
import { logger } from "../utils/logger";
import { fetchUserInfo } from "../api/CloudStorageClient";
import GoogleDriveLoginButton from "./buttons/GoogleDriveLoginButton";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  setUserInfo?: (userInfo: UserInfoType | null) => void;
};

function UserInformation(props: Props) {
  const { darkmode } = useTheme();

  const {
    provider,
    accessToken,
    refreshToken,
    ensureFreshAccessToken,
    clearSession,
  } = useToken();

  const [userInfo, setUserInfoState] = useState<UserInfoType | null>(null);
  const [loading, setLoading] = useState(false);

  const hasCloudSession = useMemo(
    () => provider !== "device" && !!refreshToken,
    [provider, refreshToken]
  );

  const loadUserInfo = async () => {
    if (!hasCloudSession) {
      setUserInfoState(null);
      props.setUserInfo?.(null);
      return;
    }

    try {
      setLoading(true);

      const token = accessToken ?? (await ensureFreshAccessToken());

      if (!token) {
        logger.warn("[UserInformation] No access token available.");
        setLoading(false);
        return;
      }

      await fetchUserInfo(
        token,
        provider,
        (info) => {
          setUserInfoState(info);
          props.setUserInfo?.(info);
        },
        () => {
          setLoading(false);
        }
      );
    } catch (err) {
      logger.error("[UserInformation] Failed to load user info:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCloudSession, provider]);

  const handleLogout = async () => {
    try {
      await clearSession();
    } finally {
      setUserInfoState(null);
      props.setUserInfo?.(null);
    }
  };

  return (
    <View
      style={{
        width: "100%",
      }}
    >
      {hasCloudSession ? (
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
              paddingLeft: 8,
              minWidth: 140,
              minHeight: 54,
              height: 54,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            {loading || !userInfo ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
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
            ) : (
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
                  style={{ userSelect: "none" as any }}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {userInfo.username}
                </Text>
                <Chip onPress={handleLogout} icon="logout">
                  Logout
                </Chip>
              </MotiView>
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
          <GoogleDriveLoginButton />
        </MotiView>
      )}
    </View>
  );
}

export default UserInformation;
