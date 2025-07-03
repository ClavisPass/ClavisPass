import React, { use } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../contexts/ThemeProvider";
import { useAuth } from "../contexts/AuthProvider";

const { width } = Dimensions.get("window");

const CustomBottomTab = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };

  const handlePress = (route: any, index: number) => {
    const isLogout = route.name === "Logout";
    const isAdd = route.name === "AddTrigger";

    if (isLogout) {
      handleLogout();
      return;
    }

    if (isAdd) {
      navigation.navigate("HomeStack", {
        screen: "Home",
        params: { triggerAdd: Date.now() },
      });
      return;
    }

    const event = navigation.emit({
      type: "tabPress",
      target: state.routes[index].key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          shadowColor: theme.colors.shadow,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        const isAdd = route.name === "AddTrigger";
        const isLogout = route.name === "Logout";

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : isAdd || isLogout
              ? " "
              : options.title ?? route.name;

        const iconColor = isFocused ? "#fff" : "#999";
        const iconSize = isFocused ? 30 : 24;

        const animatedBackgroundStyle = useAnimatedStyle(() => ({
          transform: [
            {
              scale: withTiming(isFocused ? 1 : 0, {
                duration: 150,
                easing: Easing.out(Easing.ease),
              }),
            },
          ],
        }));

        const labelAnimatedStyle = useAnimatedStyle(() => ({
          opacity: withTiming(isFocused ? 0 : 1, {
            duration: 150,
            easing: Easing.out(Easing.ease),
          }),
          transform: [
            {
              translateY: withTiming(isFocused ? 4 : 0, {
                duration: 150,
                easing: Easing.out(Easing.ease),
              }),
            },
          ],
        }));

        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => handlePress(route, index)}
          >
            <View style={styles.tabButton}>
              <Animated.View
                style={[
                  styles.animatedBackground,
                  { backgroundColor: theme.colors.primary },
                  animatedBackgroundStyle,
                ]}
              />
              <View style={styles.iconContainer}>
                {isAdd ? (
                  <Icon name="plus" size={28} color="#fff" />
                ) : isLogout ? (
                  <Icon name="logout" size={24} color="#fff" />
                ) : (
                  options.tabBarIcon?.({
                    focused: isFocused,
                    color: iconColor,
                    size: iconSize,
                  })
                )}
                <Animated.Text
                  style={[
                    styles.label,
                    { color: iconColor },
                    labelAnimatedStyle,
                  ]}
                >
                  {label + ""}
                </Animated.Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    marginBottom: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    borderRadius: 12,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabButton: {
    width: width / 7,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    cursor: "pointer",
    overflow: "hidden",
  },
  animatedBackground: {
    position: "absolute",
    width: 60,
    height: 40,
    borderRadius: 12,
    top: 8,
    alignSelf: "center",
    zIndex: -1,
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
    marginTop: 2,
  },
});

export default CustomBottomTab;
