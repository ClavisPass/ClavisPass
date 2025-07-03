import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { BottomNavigation, IconButton } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../contexts/ThemeProvider";
import { useAuth } from "../contexts/AuthProvider";

const CustomBottomTab = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { theme } = useTheme();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };

  const routes = state.routes.map((route, idx) => {
    const isAdd = route.name === "AddTrigger";
    const isLogout = route.name === "Logout";
    const isFocused = state.index === idx;

    const label =
      isAdd
        ? ""
        : descriptors[route.key].options.title ?? route.name;

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
          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }
      },
    };
  });

  return (
    <View style={{ position: "relative" }}>
      <View
        style={{
          position: "absolute",
          top: 10,
          alignSelf: "center",
          zIndex: 10,
          backgroundColor: theme.colors.background,
          borderRadius: 28,
          //boxShadow: theme.colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 3,
        }}
      >
        <IconButton
          icon="plus"
          size={30}
          mode="contained-tonal"
          selected={true}
          iconColor={theme.colors.primary}
          onPress={() =>
            navigation.navigate("HomeStack", {
              screen: "Home",
              params: { triggerAdd: Date.now() },
            })
          }
        />
      </View>

      <BottomNavigation.Bar
        navigationState={{ index: state.index, routes }}
        onTabPress={({ route }) => route.onPress()}
        shifting={false}
        style={{
          backgroundColor: theme.colors.background,
          boxShadow: theme.colors.shadow,
          borderRadius: 12,
        }}
      />
    </View>
  );
};

export default CustomBottomTab;
