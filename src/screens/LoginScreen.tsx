import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";

import { Text } from "react-native-paper";

import ContentProtection from "../shared/components/ContentProtection";
import Login from "../features/auth/components/Login";
import Backup from "../features/sync/components/Backup";
import AnimatedLogo from "../shared/ui/AnimatedLogo";

import UserInfoType from "../features/sync/model/UserInfoType";

import { useOnline } from "../app/providers/OnlineProvider";
import { useTheme } from "../app/providers/ThemeProvider";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../app/navigation/stacks/Stack";
import { useToken } from "../app/providers/CloudProvider";
import { fetchUserInfo } from "../infrastructure/clients/CloudStorageClient";
import { logger } from "../infrastructure/logging/logger";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import DropboxLoginButton from "../features/sync/components/DropboxLoginButton";
import GoogleDriveLoginButton from "../features/sync/components/GoogleDriveLoginButton";
import SettingsDivider from "../features/settings/components/SettingsDivider";
import { useTranslation } from "react-i18next";

type LoginScreenProps = StackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { isOnline } = useOnline();
  const { headerWhite, setHeaderWhite, darkmode, theme, setHeaderSpacing } =
    useTheme();
  const { t } = useTranslation();

  const {
    provider,
    accessToken,
    ensureFreshAccessToken,
    isInitializing,
    clearSession,
  } = useToken();

  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setHeaderWhite(false);
    }, [setHeaderSpacing, setHeaderWhite])
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
            "[LoginScreen] No access token – treating userInfo as null."
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
        }
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
        <ContentProtection enabled={false} />
        <View style={{ height: 17 }}></View>
        <BlurView
          intensity={80}
          tint={darkmode ? "dark" : undefined}
          style={{
            height: "80%",
            maxHeight: 500,
            borderRadius: 12,
            padding: 20,
            overflow: "hidden",
            margin: 8,
            minWidth: 300,
            maxWidth: 300,
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
              Easing.bezier(0.4, 0, 0.2, 1)
            )}
            exiting={FadeOut.duration(500).easing(
              Easing.bezier(0.4, 0, 0.2, 1)
            )}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {!isOnline ? (
              <Backup />
            ) : isInitializing || loadingUserInfo ? (
              <AnimatedLogo />
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
            onPress={handleLogout}
          >
            {t("login:deviceSave")}
          </Text>
        )}
        <BottomSheetModalProvider>
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
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
