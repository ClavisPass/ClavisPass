import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";

import ContentProtection from "../components/ContentProtection";
import Login from "../components/Login";
import Backup from "../components/Backup";
import AnimatedLogo from "../ui/AnimatedLogo";

import UserInfoType from "../types/UserInfoType";

import { useOnline } from "../contexts/OnlineProvider";
import { useTheme } from "../contexts/ThemeProvider";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../stacks/Stack";
import { useToken } from "../contexts/CloudProvider";
import { fetchUserInfo } from "../api/CloudStorageClient";
import { logger } from "../utils/logger";

type LoginScreenProps = StackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { isOnline } = useOnline();
  const { headerWhite, setHeaderWhite, darkmode, theme, setHeaderSpacing } =
    useTheme();

  const { provider, accessToken, ensureFreshAccessToken, isInitializing } =
    useToken();

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
        <BlurView
          intensity={80}
          tint={darkmode ? "dark" : undefined}
          style={{
            height: "70%",
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
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
