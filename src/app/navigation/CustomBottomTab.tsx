import React, { useEffect, useRef } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Animated, Easing, Platform, View, StyleSheet } from "react-native";
import { BottomNavigation, IconButton, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../providers/ThemeProvider";
import { useAuth } from "../providers/AuthProvider";
import { useOnline } from "../providers/OnlineProvider";
import { useTranslation } from "react-i18next";

function getActiveRouteName(state: any): string | undefined {
  if (!state) return undefined;
  const route = state.routes?.[state.index ?? 0];
  if (!route) return undefined;
  return route.state ? getActiveRouteName(route.state) : route.name;
}

const OFFLINE_BAR_HEIGHT = 16;
const PLUS_TOP_ONLINE = 8;

const CustomBottomTab = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { theme } = useTheme();
  const auth = useAuth();
  const { isOnline } = useOnline();
  const { t } = useTranslation();

  // Offline badge: height JS, opacity native (aber NICHT im gleichen View!)
  const offlineHeight = useRef(new Animated.Value(0)).current; // 0..16 (JS)
  const offlineOpacity = useRef(new Animated.Value(0)).current; // 0..1 (native)

  // Plus button: translateY native
  const plusTranslateY = useRef(new Animated.Value(0)).current; // 0..16 (native)

  useEffect(() => {
    const easing = Easing.bezier(0.2, 0.7, 0.3, 1);

    Animated.timing(offlineHeight, {
      toValue: isOnline ? 0 : OFFLINE_BAR_HEIGHT,
      duration: 250,
      easing,
      useNativeDriver: false, // height => JS
    }).start();

    Animated.timing(offlineOpacity, {
      toValue: isOnline ? 0 : 1,
      duration: isOnline ? 200 : 250,
      easing,
      useNativeDriver: true, // opacity => native
    }).start();

    Animated.timing(plusTranslateY, {
      toValue: isOnline ? 0 : OFFLINE_BAR_HEIGHT,
      duration: 250,
      easing,
      useNativeDriver: true, // transform => native
    }).start();
  }, [isOnline, offlineHeight, offlineOpacity, plusTranslateY]);

  const handleLogout = () => auth.logout();

  const activeRouteName = getActiveRouteName(state as any);
  const isInEditScreen =
    activeRouteName === "Edit" || activeRouteName === "EditScreen";

  const routes = state.routes.map((route, idx) => {
    const isAdd = route.name === "AddTriggerStack";
    const isLogout = route.name === "LogoutStack";
    const isFocused = state.index === idx;

    const label = isAdd
      ? ""
      : t(`bar:${descriptors[route.key].options.title ?? route.name}`);

    return {
      key: route.key,
      title: label,
      focusedIcon: ({ color, size }: any) => {
        if (isAdd) return null;

        if (isLogout) {
          return (
            <MaterialCommunityIcons name="logout" size={size} color={color} />
          );
        }

        return descriptors[route.key].options.tabBarIcon?.({
          focused: isFocused,
          color,
          size,
        });
      },
      onPress: () => {
        if (isLogout) {
          handleLogout();
        } else if (isAdd) {
          if (isInEditScreen) return;
          navigation.navigate("HomeStack", {
            screen: "Home",
            params: { triggerAdd: Date.now() },
          });
        } else {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!event.defaultPrevented) navigation.navigate(route.name);
        }
      },
    };
  });

  return (
    <View
      style={{
        position: "relative",
        backgroundColor: isOnline
          ? Platform.OS === "web"
            ? theme.colors.elevation.level4
            : theme.colors.elevation.level2
          : theme.colors.secondary,
      }}
    >
      {/* Hintergrund-"Kante" unten */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 12,
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
          borderTopColor: theme.colors.outlineVariant,
          zIndex: 0,
        }}
      />

      {/* OFFLINE BADGE: Outer animiert height (JS), inner animiert opacity (native) */}
      <Animated.View
        style={{
          height: offlineHeight,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            opacity: offlineOpacity,
            backgroundColor: theme.colors.secondary,
            borderRadius: 12,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            justifyContent: "center",
          }}
        >
          {!isOnline ? (
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 12,
                lineHeight: 16,
              }}
            >
              Offline
            </Text>
          ) : null}
        </Animated.View>
      </Animated.View>

      {/* Plus Button: base top + translateY (native) */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: PLUS_TOP_ONLINE,
            alignSelf: "center",
            zIndex: 10,
            backgroundColor: theme.colors.background,
            borderRadius: 28,
            transform: [{ translateY: plusTranslateY }],
          },
          {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          },
        ]}
      >
        <IconButton
          icon="plus"
          size={30}
          mode="contained-tonal"
          selected={true}
          iconColor={theme.colors.primary}
          disabled={isInEditScreen}
          onPress={() => {
            if (isInEditScreen) return;
            navigation.navigate("HomeStack", {
              screen: "Home",
              params: { triggerAdd: Date.now() },
            });
          }}
        />
      </Animated.View>

      {/* Tab Bar */}
      <View
        style={[
          {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          },
        ]}
      >
        <View
          style={{
            overflow: "hidden",
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: theme.colors.outlineVariant,
            backgroundColor: theme.colors.background,
          }}
        >
          <BottomNavigation.Bar
            navigationState={{ index: state.index, routes }}
            onTabPress={({ route }) => route.onPress()}
            shifting={true}
            style={{ backgroundColor: theme.colors.background }}
            activeIndicatorStyle={{
              backgroundColor: theme.colors.secondaryContainer,
              borderRadius: 12,
            }}
            renderLabel={({ route, focused }) => (
              <Text
                style={{
                  fontSize: 10,
                  textAlign: "center",
                  color: focused ? theme.colors.onSurface : "#777",
                }}
              >
                {route.title}
              </Text>
            )}
            animationEasing={Easing.bezier(0.2, 0.7, 0.3, 1)}
            activeColor={theme.colors.primary}
            inactiveColor={"#777"}
          />
        </View>
      </View>
    </View>
  );
};

export default CustomBottomTab;