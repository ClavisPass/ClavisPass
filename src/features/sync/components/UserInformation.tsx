import React, { useState, useEffect, useMemo } from "react";
import * as WebBrowser from "expo-web-browser";
import { Avatar, Icon, IconButton, Text, useTheme } from "react-native-paper";
import { Skeleton } from "moti/skeleton";
import { View } from "react-native";
import { MotiView } from "moti";

import DropboxLoginButton from "./DropboxLoginButton";
import GoogleDriveLoginButton from "./GoogleDriveLoginButton";
import SettingsDivider from "../../settings/components/SettingsDivider";

import UserInfoType from "../model/UserInfoType";
import { useToken } from "../../../app/providers/CloudProvider";
import { useOnline } from "../../../app/providers/OnlineProvider";
import { fetchUserInfo } from "../../../infrastructure/cloud/clients/CloudStorageClient";
import { logger } from "../../../infrastructure/logging/logger";
import { useTheme as useAppTheme } from "../../../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  setUserInfo?: (userInfo: UserInfoType | null) => void;
};

function UserInformation(props: Props) {
  const paperTheme = useTheme();
  const { darkmode } = useAppTheme();
  const { isOnline } = useOnline();
  const { t } = useTranslation();

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
        () => setLoading(false)
      );
    } catch (err) {
      logger.error("[UserInformation] Failed to load user info:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCloudSession, provider, isOnline]);

  const handleLogout = async () => {
    try {
      await clearSession();
    } finally {
      setUserInfoState(null);
      props.setUserInfo?.(null);
    }
  };

  const providerLabel =
    provider === "dropbox"
      ? "Dropbox " + t("common:connected")
      : provider === "googleDrive"
      ? "Google Drive " + t("common:connected")
      : t("common:notConnected");

  const providerIcon =
    provider === "dropbox"
      ? "dropbox"
      : provider === "googleDrive"
      ? "google-drive"
      : "cloud-off-outline";

  return (
    <View style={{ width: "100%" }}>
      {hasCloudSession ? (
        <MotiView
          from={{ opacity: 0, translateY: -6 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: "timing", duration: 220 }}
        >
          {/* Account Card */}
          <View
            style={{
              width: "100%",
              borderRadius: 12,
              padding: 8,
              //backgroundColor: paperTheme.colors.elevation.level1,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Avatar */}
            {loading || !userInfo ? (
              <Skeleton
                show
                height={48}
                width={48}
                radius={999}
                colorMode={darkmode ? "dark" : "light"}
              />
            ) : userInfo.avatar ? (
              <Avatar.Image size={48} source={{ uri: userInfo.avatar }} />
            ) : (
              <Avatar.Text
                size={48}
                label={(userInfo?.username?.charAt(0) ?? "?").toUpperCase()}
              />
            )}

            {/* Name + Provider */}
            <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
              {loading || !userInfo ? (
                <>
                  <Skeleton
                    show
                    height={16}
                    width={140}
                    radius={6}
                    colorMode={darkmode ? "dark" : "light"}
                  />
                  <Skeleton
                    show
                    height={12}
                    width={110}
                    radius={6}
                    colorMode={darkmode ? "dark" : "light"}
                  />
                </>
              ) : (
                <>
                  <Text variant="titleMedium" numberOfLines={1}>
                    {userInfo.username}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Icon
                      source={providerIcon}
                      size={18}
                      color={paperTheme.colors.primary}
                    />
                    <Text
                      variant="bodySmall"
                      style={{ color: paperTheme.colors.onSurfaceVariant }}
                      numberOfLines={1}
                    >
                      {providerLabel}
                      {!isOnline ? " • offline" : ""}
                    </Text>
                  </View>
                </>
              )}
            </View>
            <IconButton
              icon="logout"
              mode="contained-tonal"
              onPress={handleLogout}
              disabled={loading}
              accessibilityLabel="Logout"
            />
          </View>
        </MotiView>
      ) : (
        <MotiView
          from={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 220 }}
        >
          <DropboxLoginButton />
          <SettingsDivider />
          <GoogleDriveLoginButton />
        </MotiView>
      )}
    </View>
  );
}

export default UserInformation;
