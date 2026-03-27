import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";

import { Text } from "react-native-paper";
import { Button } from "react-native-paper";

import Login from "../features/auth/components/Login";
import Backup from "../features/sync/components/Backup";
import AnimatedLogo from "../shared/ui/AnimatedLogo";

import UserInfoType from "../features/sync/model/UserInfoType";

import { useOnline } from "../app/providers/OnlineProvider";
import { useTheme } from "../app/providers/ThemeProvider";
import { useFocusEffect } from "@react-navigation/native";
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
import SettingsDivider from "../features/settings/components/SettingsDivider";
import { useTranslation } from "react-i18next";
import SettingsItem from "../features/settings/components/SettingsItem";
import { LoginStackParamList } from "../app/navigation/model/types";
import FirstOpened from "../features/onboarding/components/FirstOpened";
import { useSetting } from "../app/providers/SettingsProvider";
import Modal from "../shared/components/modals/Modal";

type LoginScreenProps = NativeStackScreenProps<LoginStackParamList, "Login">;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { isOnline } = useOnline();
  const { headerWhite, setHeaderWhite, darkmode, theme, setHeaderSpacing } =
    useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { value: onboardingDone } =
    useSetting("ONBOARDING_DONE");
  const isWideLoginLayout = width >= 600;
  const loginCardWidth = isWideLoginLayout
    ? Math.min(width - 220, 760)
    : 300;

  const {
    provider,
    accessToken,
    ensureFreshAccessToken,
    isInitializing,
    clearSession,
  } = useToken();

  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [deviceSaveModalVisible, setDeviceSaveModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setHeaderWhite(false);
    }, [setHeaderSpacing, setHeaderWhite]),
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

  const currentKey = useMemo(() => {
    if (!isOnline) return "offline";
    if (isInitializing || loadingUserInfo) return "loading";
    return "online";
  }, [isOnline, isInitializing, loadingUserInfo]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  useEffect(() => {
    handleDismissModalPress();
  }, [provider]);

  const handleLogout = async () => {
    try {
      await clearSession();
    } finally {
      setUserInfo(null);
    }
  };

  return (
    <BottomSheetModalProvider>
      <ImageBackground
        source={
          darkmode
            ? require("../../assets/blurred-bg-dark.png")
            : require("../../assets/blurred-bg.png")
        }
        resizeMode="cover"
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            padding: 20,
            flex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatusBar
            animated={true}
            style={headerWhite ? "light" : darkmode ? "light" : "dark"}
            translucent={true}
          />
          <View style={{ height: 17 }}></View>
          <BlurView
            intensity={80}
            tint={darkmode ? "dark" : undefined}
            style={{
              height: "80%",
              maxHeight: 500,
              width: loginCardWidth,
              borderRadius: 12,
              overflow: "hidden",
              margin: isWideLoginLayout ? 8 : 4,
              minWidth: isWideLoginLayout ? 560 : 300,
              maxWidth: loginCardWidth,
              display: "flex",
              justifyContent: "center",
              boxShadow: theme.colors.shadow,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: darkmode ? theme.colors.outlineVariant : "white",
            }}
          >
            <Animated.View
              key={currentKey}
              entering={FadeIn.duration(500).easing(
                Easing.bezier(0.4, 0, 0.2, 1),
              )}
              exiting={FadeOut.duration(500).easing(
                Easing.bezier(0.4, 0, 0.2, 1),
              )}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!isOnline ? (
                <Backup />
              ) : isInitializing || loadingUserInfo ? (
                <AnimatedLogo />
              ) : !onboardingDone ? (
                <FirstOpened
                  navigation={navigation}
                />
              ) : (
                <Login userInfo={userInfo} />
              )}
            </Animated.View>
          </BlurView>
          {provider === "device" ? (
            <Text
              style={{ marginTop: 8, textDecorationLine: "underline" }}
              onPress={handlePresentModalPress}
            >
              {t("login:cloudSave")}
            </Text>
          ) : (
            <Text
              style={{ marginTop: 8, textDecorationLine: "underline" }}
              onPress={() => setDeviceSaveModalVisible(true)}
            >
              {t("login:deviceSave")}
            </Text>
          )}

          <Modal
            visible={deviceSaveModalVisible}
            onDismiss={() => setDeviceSaveModalVisible(false)}
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
              <View style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
              <DropboxLoginButton />
              <SettingsDivider />
              <GoogleDriveLoginButton />
              <SettingsDivider />
              <ClavisPassHubLoginButton />
              <SettingsDivider />
              <SettingsItem
                leadingIcon={"qrcode-scan"}
                onPress={() => navigation.navigate("Scan")}
              >
                {t("settings:scanqrcode")}
              </SettingsItem>
              <SettingsDivider />
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </ImageBackground>
    </BottomSheetModalProvider>
  );
};

export default LoginScreen;
