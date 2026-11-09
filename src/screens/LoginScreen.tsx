import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  KeyboardAvoidingView,
  View,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FocusAwareStatusBar from "../shared/components/FocusAwareStatusBar";
import AppHeaderBrand from "../shared/components/AppHeaderBrand";
import Constants from "expo-constants";

import { Button, Icon, Text } from "react-native-paper";

import Login from "../features/auth/components/Login";
import AnimatedLoginVisual from "../features/auth/components/AnimatedLoginVisual";
import AnimatedLogo from "../shared/ui/AnimatedLogo";
import Backup from "../features/sync/components/Backup";

import UserInfoType from "../features/sync/model/UserInfoType";

import { useOnline } from "../app/providers/OnlineProvider";
import { useTheme } from "../app/providers/ThemeProvider";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useToken } from "../app/providers/CloudProvider";
import { fetchUserInfo } from "../infrastructure/cloud/clients/CloudStorageClient";
import { logger } from "../infrastructure/logging/logger";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import DropboxLoginButton from "../features/sync/components/DropboxLoginButton";
import GoogleDriveLoginButton from "../features/sync/components/GoogleDriveLoginButton";
import ClavisPassHubLoginButton from "../features/sync/components/ClavisPassHubLoginButton";
import LocalFileLoginButton from "../features/sync/components/LocalFileLoginButton";
import SettingsDivider from "../features/settings/components/SettingsDivider";
import { useTranslation } from "react-i18next";
import SettingsItem from "../features/settings/components/SettingsItem";
import { LoginStackParamList } from "../app/navigation/model/types";
import FirstOpened from "../features/onboarding/components/FirstOpened";
import { useSetting } from "../app/providers/SettingsProvider";
import Modal from "../shared/components/modals/Modal";
import AnimatedPressable from "../shared/components/AnimatedPressable";
import {
  TITLEBAR_CONTROLS_WIDTH,
  TITLEBAR_HEIGHT,
} from "../shared/components/titlebarMetrics";
import { resolveWindowControlsSide } from "../infrastructure/platform/windowControls";
import {
  getGlassChromeStyle,
  getScreenContentStyle,
} from "../shared/ui/glass";

type LoginScreenProps = NativeStackScreenProps<LoginStackParamList, "Login">;

const webDragRegionProps =
  Platform.OS === "web"
    ? ({ dataSet: { tauriDragRegion: "" } } as any)
    : null;
const webDragStyle =
  Platform.OS === "web"
    ? ({ WebkitAppRegion: "drag", appRegion: "drag", cursor: "default" } as const)
    : undefined;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { isOnline } = useOnline();
  const {
    darkmode,
    theme,
    setHeaderSpacing,
    setTitlebarCenterGap,
    setTitlebarOverlayDragEnabled,
  } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { value: onboardingDone } = useSetting("ONBOARDING_DONE");
  const { value: windowControlsStyle } = useSetting("WINDOW_CONTROLS_STYLE");
  const controlsLeft =
    resolveWindowControlsSide(windowControlsStyle) === "left";
  const isWideLoginLayout = width >= 600;
  const showSplitLayout = width >= 720;
  const glassChromeStyle = getGlassChromeStyle(darkmode);
  const screenContentStyle = getScreenContentStyle(theme);

  const {
    provider,
    accessToken,
    ensureFreshAccessToken,
    isInitializing,
    clearSession,
  } = useToken();

  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [deviceSaveModalVisible, setDeviceSaveModalVisible] = useState(false);
  const [cloudProviderModalVisible, setCloudProviderModalVisible] =
    useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setTitlebarCenterGap(0);
      setTitlebarOverlayDragEnabled(false);
    }, [
      setHeaderSpacing,
      setTitlebarCenterGap,
      setTitlebarOverlayDragEnabled,
    ]),
  );

  const loadUserInfo = useCallback(async () => {
    try {
      setLoadingUserInfo(true);

      if (isInitializing) {
        return;
      }

      if (!isOnline) {
        setLoadingUserInfo(false);
        return;
      }

      const currentProvider = provider ?? "device";

      let tokenToUse = "";

      if (currentProvider !== "device") {
        const freshToken = accessToken ?? (await ensureFreshAccessToken());
        if (!freshToken) {
          logger.warn(
            "[LoginScreen] No access token – treating userInfo as null.",
          );
          setUserInfo(null);
          setLoadingUserInfo(false);
          return;
        }
        tokenToUse = freshToken;
      }

      await fetchUserInfo(
        tokenToUse,
        currentProvider,
        (info) => {
          setUserInfo(info);
        },
        () => {
          setLoadingUserInfo(false);
        },
      );
    } catch (error) {
      logger.error("[LoginScreen] Error during userInfo fetch:", error);
      setUserInfo(null);
      setLoadingUserInfo(false);
    }
  }, [isInitializing, isOnline, provider, accessToken, ensureFreshAccessToken]);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  const showOfflineBackup = !isOnline && provider !== "device";
  const currentKey = useMemo(() => {
    if (showOfflineBackup) return "offline";
    if (isInitializing || loadingUserInfo) return "loading";
    return "online";
  }, [showOfflineBackup, isInitializing, loadingUserInfo]);
  const showStartupLogo = currentKey === "loading";

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    if (Platform.OS === "web") {
      setCloudProviderModalVisible(true);
      return;
    }

    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    setCloudProviderModalVisible(false);
    bottomSheetModalRef.current?.dismiss();
  }, []);

  useEffect(() => {
    handleDismissModalPress();
  }, [provider]);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const styleId = "clavispass-login-selection-style";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      #clavispass-login-page,
      #clavispass-login-page * {
        -webkit-user-select: none;
        user-select: none;
      }

      #clavispass-login-page input,
      #clavispass-login-page textarea {
        -webkit-user-select: text;
        user-select: text;
      }

      #clavispass-login-page input::placeholder,
      #clavispass-login-page textarea::placeholder {
        -webkit-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleLogout = async () => {
    try {
      await clearSession();
    } finally {
      setUserInfo(null);
    }
  };

  const localVaultFileName = useMemo(() => {
    if (provider !== "localFile") return null;

    const path = accessToken ?? "";
    const normalized = path.replace(/\\/g, "/");
    return normalized.split("/").filter(Boolean).pop() ?? null;
  }, [accessToken, provider]);

  const renderCloudProviderOptions = () => (
    <>
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
      <SettingsDivider />
      <SettingsItem
        leadingIcon={"qrcode-scan"}
        onPress={() => {
          handleDismissModalPress();
          navigation.navigate("Scan");
        }}
      >
        {t("settings:scanqrcode")}
      </SettingsItem>
    </>
  );

  const connectedProviderLabel =
    provider === "dropbox"
      ? `Dropbox ${t("common:connected")}`
      : provider === "googleDrive"
        ? `Google Drive ${t("common:connected")}`
        : provider === "clavispassHub"
          ? `ClavisPass Hub ${t("common:connected")}`
          : provider === "localFile"
            ? `${localVaultFileName ?? t("login:loadVault")} ${t("common:connected")}`
            : t("common:notConnected");

  const connectedProviderIcon =
    provider === "dropbox"
      ? "dropbox"
      : provider === "googleDrive"
        ? "google-drive"
        : provider === "clavispassHub"
          ? "server-network"
          : provider === "localFile"
            ? "folder-outline"
            : "cloud-off-outline";

  return (
    <BottomSheetModalProvider>
      <KeyboardAvoidingView
        // Keep keyboard coordinates relative to the full screen, not the centered card.
        enabled={Platform.OS !== "web"}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <FocusAwareStatusBar
          animated={true}
          style={darkmode ? "light" : "dark"}
          translucent={true}
        />
        <View
          style={{
            ...glassChromeStyle,
            minHeight: isWideLoginLayout ? undefined : 37 + Constants.statusBarHeight,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginBottom: 0,
            paddingHorizontal: isWideLoginLayout ? 12 : 8,
            paddingTop: Constants.statusBarHeight + 4,
            paddingBottom: isWideLoginLayout ? 2 : 3,
            borderBottomWidth: StyleSheet.hairlineWidth,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              minHeight: 34,
              width: "100%",
              flexDirection: "row",
              paddingLeft:
                Platform.OS === "web" && TITLEBAR_HEIGHT > 0 && controlsLeft
                  ? TITLEBAR_CONTROLS_WIDTH
                  : 0,
              paddingRight:
                Platform.OS === "web" && TITLEBAR_HEIGHT > 0 && !controlsLeft
                  ? 104
                  : 0,
            }}
          >
            <View
              {...webDragRegionProps}
              style={{ flex: 1, minWidth: 0, justifyContent: "center", ...webDragStyle }}
            >
              <AppHeaderBrand compact={!isWideLoginLayout} />
            </View>
          </View>
        </View>
        <View
          id="clavispass-login-page"
          style={[screenContentStyle, styles.page, showSplitLayout && styles.splitPage]}
        >
          {showSplitLayout && !showStartupLogo ? (
            <AnimatedLoginVisual
              active={isFocused}
              caption={
                currentKey === "online" && onboardingDone
                  ? t(
                      isCreatingVault
                        ? "login:introCreateVault"
                        : "login:introUnlockVault",
                    )
                  : undefined
              }
            />
          ) : null}
          <ScrollView
            style={styles.formPane}
            contentContainerStyle={[
              styles.scrollContent,
              showSplitLayout && styles.splitScrollContent,
              insets.bottom > 0 && { paddingBottom: insets.bottom + 8 },
            ]}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {!showSplitLayout && !showStartupLogo ? (
              <AnimatedLoginVisual compact active={isFocused} />
            ) : null}
            <View style={styles.formStack}>
              <Animated.View
                key={currentKey}
                entering={FadeIn.duration(500).easing(
                  Easing.bezier(0.4, 0, 0.2, 1),
                )}
                exiting={FadeOut.duration(500).easing(
                  Easing.bezier(0.4, 0, 0.2, 1),
                )}
                style={styles.stage}
              >
                {showOfflineBackup ? (
                  <Backup />
                ) : showStartupLogo ? (
                  <View
                    testID="login-loading-logo"
                    accessibilityRole="progressbar"
                    style={styles.loadingLogo}
                  >
                    <AnimatedLogo />
                  </View>
                ) : !onboardingDone ? (
                  <FirstOpened navigation={navigation} />
                ) : (
                  <Login
                    userInfo={userInfo}
                    onIntroModeChange={
                      showSplitLayout ? setIsCreatingVault : undefined
                    }
                  />
                )}
              </Animated.View>
              {showStartupLogo ? null : provider === "device" ? (
                <AnimatedPressable
                  onPress={handlePresentModalPress}
                  style={{
                    minHeight: 36,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingLeft: 12,
                    paddingRight: 14,
                    borderRadius: 12,
                    maxWidth: "100%",
                    backgroundColor: theme.colors.secondaryContainer,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Icon
                      source="folder-outline"
                      size={18}
                      color={theme.colors.primary}
                    />
                    <Text style={{ color: theme.colors.primary, flexShrink: 1 }}>
                      {t("login:cloudSave")}
                    </Text>
                  </View>
                </AnimatedPressable>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0,
                  }}
                >
                  <View
                    style={{
                      minHeight: 36,
                      flexDirection: "row",
                      alignItems: "stretch",
                      overflow: "hidden",
                      borderRadius: 12,
                      maxWidth: "100%",
                      backgroundColor: theme.colors.secondaryContainer,
                    }}
                  >
                    <View
                      style={{
                        minHeight: 36,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        paddingLeft: 12,
                        paddingRight: 14,
                        flexShrink: 1,
                      }}
                    >
                      <Icon
                        source={connectedProviderIcon}
                        size={18}
                        color={theme.colors.primary}
                      />
                      <Text style={{ color: theme.colors.primary, flexShrink: 1 }}>
                        {connectedProviderLabel}
                      </Text>
                    </View>
                    <AnimatedPressable
                      onPress={() => setDeviceSaveModalVisible(true)}
                      accessibilityLabel="Logout"
                      style={{
                        width: 42,
                        minHeight: 36,
                        alignItems: "center",
                        justifyContent: "center",
                        borderLeftWidth: StyleSheet.hairlineWidth,
                        borderLeftColor: theme.colors.outlineVariant,
                      }}
                    >
                      <Icon
                        source="logout"
                        size={18}
                        color={theme.colors.primary}
                      />
                    </AnimatedPressable>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          <Modal
            visible={deviceSaveModalVisible}
            onDismiss={() => setDeviceSaveModalVisible(false)}
            avoidKeyboard
          >
            <View
              style={{
                width: 280,
                minHeight: 170,
                display: "flex",
                flexDirection: "column",
                padding: 14,
                justifyContent: "space-between",
                borderRadius: 12,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: theme.colors.outlineVariant,
              }}
            >
              <View
                style={{ display: "flex", flexDirection: "column", gap: 6 }}
              >
                <Text variant="headlineSmall" style={{ userSelect: "none" }}>
                  {t("login:deviceSaveConfirmTitle")}
                </Text>
                <Text variant="bodyMedium" style={{ userSelect: "none" }}>
                  {t("login:deviceSaveConfirmText")}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 6,
                  alignSelf: "flex-end",
                  marginTop: 16,
                }}
              >
                <Button
                  style={{ borderRadius: 12 }}
                  mode="contained-tonal"
                  onPress={() => setDeviceSaveModalVisible(false)}
                >
                  {t("common:cancel")}
                </Button>
                <Button
                  style={{ borderRadius: 12 }}
                  mode="contained"
                  onPress={async () => {
                    setDeviceSaveModalVisible(false);
                    await handleLogout();
                  }}
                >
                  {t("login:deviceSaveConfirmAction")}
                </Button>
              </View>
            </View>
          </Modal>

          {Platform.OS === "web" && cloudProviderModalVisible ? (
            <View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              <Pressable
                onPress={handleDismissModalPress}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
              />
              <View
                style={{
                  width: 340,
                  maxWidth: "100%",
                  borderRadius: 12,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: theme.colors.outlineVariant,
                  backgroundColor: theme.colors.background,
                  boxShadow: theme.colors.shadow,
                  overflow: "hidden",
                  zIndex: 1001,
                }}
              >
                {renderCloudProviderOptions()}
              </View>
            </View>
          ) : (
            <BottomSheetModal
              ref={bottomSheetModalRef}
              style={{
                borderColor: theme.colors.outlineVariant,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderRadius: 0,
              }}
              handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}
              backgroundStyle={{
                backgroundColor: theme.colors.background,
                borderRadius: 0,
              }}
            >
              <BottomSheetView style={{ borderRadius: 0, paddingBottom: 60 }}>
                <SettingsDivider />
                {renderCloudProviderOptions()}
                <SettingsDivider />
              </BottomSheetView>
            </BottomSheetModal>
          )}
        </View>
      </KeyboardAvoidingView>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: 0,
    marginHorizontal: 8,
    marginBottom: 8,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
  },
  splitPage: {
    flexDirection: "row",
  },
  formPane: {
    flexGrow: 60,
    flexBasis: 0,
    minWidth: 0,
    minHeight: 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  splitScrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  formStack: {
    width: "100%",
    maxWidth: 480,
    alignItems: "center",
    gap: 16,
  },
  stage: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingLogo: {
    width: 100,
    height: 100,
  },
});

export default LoginScreen;
