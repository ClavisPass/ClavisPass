import React, { useState, useEffect, useMemo } from "react";
import * as WebBrowser from "expo-web-browser";
import { Icon, IconButton, Text, useTheme } from "react-native-paper";
import { Skeleton } from "moti/skeleton";
import { Image, Platform, View } from "react-native";
import { MotiView } from "moti";

import DropboxLoginButton from "./DropboxLoginButton";
import GoogleDriveLoginButton from "./GoogleDriveLoginButton";
import ClavisPassHubLoginButton from "./ClavisPassHubLoginButton";
import LocalFileLoginButton from "./LocalFileLoginButton";
import SettingsDivider from "../../settings/components/SettingsDivider";
import TooltipIconButton from "../../../shared/components/buttons/TooltipIconButton";

import UserInfoType from "../model/UserInfoType";
import { useToken } from "../../../app/providers/CloudProvider";
import { useOnline } from "../../../app/providers/OnlineProvider";
import { fetchUserInfo } from "../../../infrastructure/cloud/clients/CloudStorageClient";
import { logger } from "../../../infrastructure/logging/logger";
import { useTheme as useAppTheme } from "../../../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import LogoColored from "../../../shared/ui/LogoColored";

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
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

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
          if (!info) {
            setUserInfoState(null);
            props.setUserInfo?.(null);
            return;
          }

          logger.info("[UserInformation] Loaded cloud user info:", {
            provider,
            username: info.username,
            avatar: info.avatar,
          });
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

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [userInfo?.avatar]);

  const avatarSource = useMemo(
    () => (userInfo?.avatar ? { uri: userInfo.avatar } : undefined),
    [userInfo?.avatar]
  );

  const handleLogout = async () => {
    try {
      await clearSession();
    } finally {
      setUserInfoState(null);
      props.setUserInfo?.(null);
    }
  };

  const localVaultFileName = useMemo(() => {
    if (provider !== "localFile") return null;

    const path = accessToken ?? refreshToken ?? "";
    const normalized = path.replace(/\\/g, "/");
    return normalized.split("/").filter(Boolean).pop() ?? null;
  }, [accessToken, provider, refreshToken]);
  const localVaultPath = useMemo(() => {
    if (provider !== "localFile") return null;
    return accessToken ?? refreshToken ?? null;
  }, [accessToken, provider, refreshToken]);
  const isLocalFileProvider = provider === "localFile";

  const providerLabel =
    provider === "dropbox"
      ? "Dropbox " + t("common:connected")
      : provider === "googleDrive"
      ? "Google Drive " + t("common:connected")
      : provider === "clavispassHub"
      ? "ClavisPass Hub " + t("common:connected")
      : provider === "localFile"
      ? t("login:localVaultConnected")
      : t("common:notConnected");

  const providerIcon =
    provider === "dropbox"
      ? "dropbox"
      : provider === "googleDrive"
      ? "google-drive"
      : provider === "clavispassHub"
      ? "server-network"
      : provider === "localFile"
      ? "folder"
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
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            {!isLocalFileProvider ? (
              <>
                {/* Avatar */}
                {loading || !userInfo ? (
                  <Skeleton
                    show
                    height={48}
                    width={48}
                    radius={999}
                    colorMode={darkmode ? "dark" : "light"}
                  />
                ) : avatarSource && !avatarLoadFailed ? (
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 999,
                      overflow: "hidden",
                      backgroundColor: paperTheme.colors.secondaryContainer,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      source={avatarSource}
                      resizeMode="cover"
                      onError={(error) => {
                        logger.warn("[UserInformation] Avatar image failed:", {
                          provider,
                          avatar: userInfo.avatar,
                          error: error.nativeEvent,
                        });
                        setAvatarLoadFailed(true);
                      }}
                      style={{ width: 48, height: 48 }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 999,
                      backgroundColor: paperTheme.colors.secondaryContainer,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      source="account"
                      size={25}
                      color={paperTheme.colors.primary}
                    />
                  </View>
                )}
              </>
            ) : null}

            {/* Name + Provider */}
            <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
              {isLocalFileProvider ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                      minWidth: 0,
                    }}
                  >
                    <Text
                      variant="titleMedium"
                      numberOfLines={1}
                      style={{ flexShrink: 1 }}
                    >
                      {localVaultFileName ?? t("login:loadVault")}
                    </Text>
                    {localVaultPath ? (
                      <TooltipIconButton
                        tooltip={localVaultPath}
                        icon="information-outline"
                        iconColor={paperTheme.colors.primary}
                        size={16}
                        style={{ margin: 0, width: 28, height: 28 }}
                      />
                    ) : null}
                  </View>

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
                    </Text>
                  </View>
                </>
              ) : loading || !userInfo ? (
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
                    {provider === "clavispassHub" ? (
                      <LogoColored
                        width={14}
                        height={14}
                        fillColor={paperTheme.colors.primary}
                      />
                    ) : (
                      <Icon
                        source={providerIcon}
                        size={18}
                        color={paperTheme.colors.primary}
                      />
                    )}
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
              iconColor={paperTheme.colors.primary}
              mode="contained-tonal"
              onPress={handleLogout}
              disabled={loading && !isLocalFileProvider}
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
          {Platform.OS === "web" ? (
            <>
              <LocalFileLoginButton />
              <SettingsDivider />
            </>
          ) : null}
          <DropboxLoginButton />
          <SettingsDivider />
          <GoogleDriveLoginButton />
          <SettingsDivider />
          <ClavisPassHubLoginButton />
        </MotiView>
      )}
    </View>
  );
}

export default UserInformation;
