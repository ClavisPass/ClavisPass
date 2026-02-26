import * as React from "react";
import { View, StyleSheet } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { IconButton, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../providers/ThemeProvider";
import { useAuth } from "../providers/AuthProvider";
import { useOnline } from "../providers/OnlineProvider";
import AnimatedPressable from "../../shared/components/AnimatedPressable";
import { useTranslation } from "react-i18next";

const SIDEBAR_WIDTH = 88;
export const sidebarWidth = SIDEBAR_WIDTH;

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
  const { theme } = useTheme();
  const auth = useAuth();
  const { isOnline } = useOnline();
  const { t } = useTranslation();

  const handleLogout = () => auth.logout();

  const activeRouteName = getActiveRouteName(state as any);
  const isInEditScreen =
    activeRouteName === "Edit" || activeRouteName === "EditScreen";
  const isAddDisabled = isInEditScreen;

  const goAdd = () => {
    if (isAddDisabled) return;
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

  const focusedKey = state.routes[state.index]?.key;

  return (
    <View
      style={[
        {
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          borderRightWidth: 1,
          paddingVertical: 8,
          borderColor: theme.colors.outlineVariant,
          backgroundColor: theme.colors.background,
          justifyContent: "space-between",
          paddingBottom:0,
        },
      ]}
    >
      <View>
        {orderedRoutes.map((route, _index) => {
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
              <IconButton
                icon="plus"
                size={30}
                mode="contained-tonal"
                selected={true}
                iconColor={theme.colors.primary}
                onPress={goAdd}
              />
            );
          } else if (name === "LogoutStack") {
            iconEl = (
              <MaterialCommunityIcons
                name="logout"
                size={26}
                color={isFocused ? theme.colors.primary : "#777"}
              />
            );
          } else {
            iconEl =
              options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? theme.colors.primary : "#777",
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

          const isAction = name === "AddTriggerStack" || name === "LogoutStack";
          const bgActive =
            name === "AddTriggerStack"
              ? theme.colors.background
              : isFocused
                ? theme.colors.secondaryContainer
                : "transparent";

          return (
            <AnimatedPressable
              key={route.key}
              onPress={name === "AddTriggerStack" ? undefined : onPress}
              style={[
                styles.item,
                { backgroundColor: bgActive, opacity: isOnline ? 1 : 0.85 },
                isAction && styles.itemAction,
                name === "AddTriggerStack" &&
                  isAddDisabled && { opacity: 0.45 },
              ]}
              disabled={(name === "AddTriggerStack" && isAddDisabled) || false}
            >
              <View style={styles.itemInner}>
                {iconEl}
                {label ? (
                  <Text
                    style={[
                      styles.label,
                      { color: isFocused ? theme.colors.onSurface : "#777" },
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
      {!isOnline && (
        <View
          style={{
            backgroundColor: theme.colors.secondary,
            paddingVertical: 4,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 11 }}>
            Offline
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    height: 64,
    marginHorizontal: 8,
    marginVertical: 3,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  itemAction: {
    borderWidth: 0,
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
