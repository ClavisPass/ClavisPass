import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useWindowDimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import HomeStack from "./stacks/HomeStack";
import AnalysisStack from "./stacks/AnalysisStack";
import AddTriggerStack from "./stacks/AddTriggerStack";
import SettingsStack from "./stacks/SettingsStack";
import LogoutStack from "./stacks/LogoutStack";

import CustomBottomTabBar from "./CustomBottomTab";
import LeftSideTabBar from "./LeftSideBar";
import { AppTabsParamList } from "./model/types";

const Tab = createBottomTabNavigator<AppTabsParamList>();

export default function TabNavigator() {
  const { width } = useWindowDimensions();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // Hinweis: "animation" ist keine BottomTab option; falls es bei dir ohne Fehler lief, ignoriert RN das.
        sceneStyle: width > 600 ? { marginLeft: 88 } : undefined,
      }}
      tabBar={(props) =>
        width > 600 ? (
          <LeftSideTabBar {...props} />
        ) : (
          <CustomBottomTabBar {...props} />
        )
      }
      initialRouteName="HomeStack"
      detachInactiveScreens={false}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="AnalysisStack"
        component={AnalysisStack}
        options={{
          tabBarLabel: "Analysis",
          title: "Analysis",
          tabBarIcon: ({ color, size }) => (
            <Icon name="shield-search" size={size} color={color} />
          ),
        }}
      />

      {/* renamed: AddTrigger -> AddTriggerStack */}
      <Tab.Screen
        name="AddTriggerStack"
        component={AddTriggerStack}
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{
          tabBarLabel: "Settings",
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />

      {/* renamed: Logout -> LogoutStack */}
      <Tab.Screen
        name="LogoutStack"
        component={LogoutStack}
        options={{
          tabBarLabel: "Logout",
          tabBarIcon: ({ color, size }) => (
            <Icon name="logout" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
