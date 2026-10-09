import * as React from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Text } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../providers/ThemeProvider";
import { useAuth } from "../providers/AuthProvider";
import { useOnline } from "../providers/OnlineProvider";
import AnimatedPressable from "../../shared/components/AnimatedPressable";
import { useTranslation } from "react-i18next";
import { emitOpenAddValue } from "../../infrastructure/events/openAddValueBus";
import { TITLEBAR_HEIGHT } from "../../shared/components/titlebarMetrics";
import { useSetting } from "../providers/SettingsProvider";
import { resolveWindowControlsSide } from "../../infrastructure/platform/windowControls";

const SIDEBAR_WIDTH = 88;
export const sidebarWidth = SIDEBAR_WIDTH;
const OFFLINE_BAR_HEIGHT = 24;

function getActiveRouteName(state: any): string | undefined {
  if (!state) return undefined;
  const route = state.routes?.[state.index ?? 0];
  if (!route) return undefined;
  return route.state ? getActiveRouteName(route.state) : route.name;
}

export default function LeftSideTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { theme, darkmode } = useTheme();
  const auth = useAuth();
  const { isOnline } = useOnline();
  const { t } = useTranslation();
  const offlineHeight = React.useRef(new Animated.Value(0)).current;
  const offlineOpacity = React.useRef(new Animated.Value(0)).current;
  const { value: windowControlsStyle } = useSetting("WINDOW_CONTROLS_STYLE");
  const controlsLeft =
    resolveWindowControlsSide(windowControlsStyle) === "left";

  const handleLogout = () => auth.logout();

  const activeRouteName = getActiveRouteName(state as any);
  const isInEditScreen =
    activeRouteName === "Edit" || activeRouteName === "EditScreen";
  const isAddDisabled = isInEditScreen;
  const reserveWindowControlsSpace = TITLEBAR_HEIGHT > 0 && controlsLeft;
  const goAdd = () => {
    if (isAddDisabled) return;
    emitOpenAddValue();
    navigation.navigate("HomeStack", {
      screen: "Home",
      params: { triggerAdd: Date.now() },
    });
  };

  const orderedRoutes = React.useMemo(() => {
    const r = [...state.routes];
    const i = r.findIndex((rt) => rt.name === "AddTriggerStack");
    if (i > 0) {
      const [add] = r.splice(i, 1);
      r.unshift(add);
    }
    return r;
  }, [state.routes]);
  const mainRoutes = React.useMemo(
    () => orderedRoutes.filter((route) => route.name !== "LogoutStack"),
    [orderedRoutes],
  );
  const logoutRoute = React.useMemo(
    () => orderedRoutes.find((route) => route.name === "LogoutStack"),
    [orderedRoutes],
  );

  const focusedKey = state.routes[state.index]?.key;
  const chipBackgroundColor = darkmode
    ? "rgba(120, 127, 246, 0.16)"
    : "rgba(120, 127, 246, 0.10)";
  const chipBorderColor = darkmode
    ? "rgba(120, 127, 246, 0.26)"
    : "rgba(120, 127, 246, 0.18)";
  const inactiveContentColor = theme.colors.onSurfaceVariant;
  const activeLabelColor = theme.colors.onSurfaceVariant;

  React.useEffect(() => {
    const easing = Easing.bezier(0.2, 0.7, 0.3, 1);

    Animated.timing(offlineHeight, {
      toValue: isOnline ? 0 : OFFLINE_BAR_HEIGHT,
      duration: 250,
      easing,
      useNativeDriver: false,
    }).start();

    Animated.timing(offlineOpacity, {
      toValue: isOnline ? 0 : 1,
      duration: isOnline ? 200 : 250,
      easing,
      useNativeDriver: true,
    }).start();
  }, [isOnline, offlineHeight, offlineOpacity]);

  return (
    <View
      style={[
        {
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 50,
          elevation: 50,
          width: SIDEBAR_WIDTH,
          paddingTop: reserveWindowControlsSpace ? TITLEBAR_HEIGHT + 8 : 8,
          paddingHorizontal: 8,
          paddingBottom: 8,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          backgroundColor: "transparent",
          justifyContent: "space-between",
        },
      ]}
    >
      <View style={styles.routeGroup}>
        {mainRoutes.map((route) => {
          const isFocused = route.key === focusedKey;
          const name = route.name;

          const { options } = descriptors[route.key];
          const label =
            name === "AddTriggerStack"
              ? ""
              : (options.tabBarLabel ??
                options.title ??
                (route.name as string));

          let iconEl: React.ReactNode = null;
          if (name === "AddTriggerStack") {
            iconEl = (
              <View
                style={[
                  styles.addChip,
                  {
                    backgroundColor: chipBackgroundColor,
                    borderColor: chipBorderColor,
                  },
                ]}
              >
                <Feather name="plus" size={24} color={theme.colors.primary} />
              </View>
            );
          } else if (name === "LogoutStack") {
            iconEl = (
              <Feather
                name="log-out"
                size={26}
                color={isFocused ? theme.colors.primary : inactiveContentColor}
              />
            );
          } else {
            iconEl =
              options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? theme.colors.primary : inactiveContentColor,
                size: 26,
              }) ?? null;
          }

          const onPress = () => {
            if (name === "LogoutStack") {
              handleLogout();
              return;
            }
            if (name === "AddTriggerStack") {
              if (isAddDisabled) return;
              goAdd();
              return;
            }
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const bgActive =
            name === "AddTriggerStack"
              ? "transparent"
              : isFocused
                ? theme.colors.secondaryContainer
                : "transparent";

          if (name === "AddTriggerStack") {
            return (
              <View
                key={route.key}
                style={[
                  styles.item,
                  { opacity: isAddDisabled ? 0.45 : isOnline ? 1 : 0.85 },
                ]}
              >
                <AnimatedPressable
                  onPress={onPress}
                  borderless={false}
                  style={styles.addItem}
                  disabled={isAddDisabled}
                >
                  {iconEl}
                </AnimatedPressable>
              </View>
            );
          }

          return (
            <AnimatedPressable
              key={route.key}
              onPress={onPress}
              style={[
                styles.item,
                {
                  backgroundColor: bgActive,
                  opacity: isOnline ? 1 : 0.85,
                },
              ]}
            >
              <View style={styles.itemInner}>
                {iconEl}
                {label ? (
                  <Text
                    style={[
                      styles.label,
                      {
                        color: isFocused
                          ? activeLabelColor
                          : inactiveContentColor,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {t(`bar:${label}`)}
                  </Text>
                ) : null}
              </View>
            </AnimatedPressable>
          );
        })}
      </View>
      <View style={styles.bottomGroup}>
        {logoutRoute ? (() => {
          const isFocused = logoutRoute.key === focusedKey;
          const { options } = descriptors[logoutRoute.key];
          const label =
            options.tabBarLabel ??
            options.title ??
            (logoutRoute.name as string);

          return (
            <AnimatedPressable
              key={logoutRoute.key}
              onPress={handleLogout}
              style={[
                styles.item,
                {
                  backgroundColor: isFocused
                    ? theme.colors.secondaryContainer
                    : "transparent",
                  opacity: isOnline ? 1 : 0.85,
                },
                styles.itemAction,
              ]}
            >
              <View style={styles.itemInner}>
                <Feather
                  name="log-out"
                  size={26}
                  color={isFocused ? theme.colors.primary : inactiveContentColor}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      color: isFocused
                        ? activeLabelColor
                        : inactiveContentColor,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {t(`bar:${label}`)}
                </Text>
              </View>
            </AnimatedPressable>
          );
        })() : null}
        <Animated.View
          style={{
            height: offlineHeight,
            overflow: "hidden",
            marginTop: isOnline ? 0 : 8,
          }}
        >
        <Animated.View
          style={{
            flex: 1,
            opacity: offlineOpacity,
            backgroundColor: theme.colors.secondary,
            justifyContent: "center",
          }}
        >
          {!isOnline ? (
            <Text style={{ textAlign: "center", color: "white", fontSize: 11 }}>
              {t("common:offline")}
            </Text>
          ) : null}
        </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    height: 64,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addItem: {
    width: 46,
    height: 46,
    borderRadius: 999,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  routeGroup: {
    gap: 8,
  },
  bottomGroup: {
    gap: 0,
  },
  itemAction: {
    borderWidth: 0,
  },
  addChip: {
    width: 46,
    minWidth: 46,
    height: 46,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  itemInner: {
    alignItems: "center",
  },
  label: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
  },
});
