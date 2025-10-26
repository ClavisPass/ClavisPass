import * as React from "react";
import { View, Pressable, Platform, StyleSheet } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { IconButton, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeProvider";
import { useAuth } from "../contexts/AuthProvider";
import { useOnline } from "../contexts/OnlineProvider";
import Animated from "react-native-reanimated";
import AnimatedPressable from "../components/AnimatedPressable";

const SIDEBAR_WIDTH = 88;
export const sidebarWidth = SIDEBAR_WIDTH;

export default function LeftSideTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { theme } = useTheme();
  const auth = useAuth();
  const { isOnline } = useOnline();

  const handleLogout = () => auth.logout();
  const goAdd = () =>
    navigation.navigate("HomeStack", {
      screen: "Home",
      params: { triggerAdd: Date.now() },
    });

  const orderedRoutes = React.useMemo(() => {
    const r = [...state.routes];
    const i = r.findIndex((rt) => rt.name === "AddTrigger");
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
        },
      ]}
    >
      {!isOnline && (
        <View
          style={{
            backgroundColor: theme.colors.secondary,
            marginHorizontal: 8,
            marginTop: 8,
            marginBottom: 4,
            borderRadius: 10,
            paddingVertical: 4,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 11 }}>
            Offline
          </Text>
        </View>
      )}

      {orderedRoutes.map((route, _index) => {
        const isFocused = route.key === focusedKey;
        const name = route.name;

        const { options } = descriptors[route.key];
        const label =
          name === "AddTrigger"
            ? ""
            : (options.tabBarLabel ?? options.title ?? (route.name as string));

        let iconEl: React.ReactNode = null;
        if (name === "AddTrigger") {
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
        } else if (name === "Logout") {
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
          if (name === "Logout") {
            handleLogout();
            return;
          }
          if (name === "AddTrigger") {
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

        const isAction = name === "AddTrigger" || name === "Logout";
        const bgActive =
          name === "AddTrigger"
            ? theme.colors.surface
            : isFocused
              ? "rgba(0,0,0,0.06)"
              : "transparent";

        return (
          <AnimatedPressable
            key={route.key}
            onPress={onPress}
            style={[
              styles.item,
              { backgroundColor: bgActive, opacity: isOnline ? 1 : 0.85 },
              isAction && styles.itemAction,
            ]}
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
                  {label + ""}
                </Text>
              ) : null}
            </View>
          </AnimatedPressable>
        );
      })}
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
