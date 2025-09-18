import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "../stacks/HomeStack";
import AnalysisStack from "../stacks/AnalysisStack";
import AddTriggerStack from "../stacks/AddTriggerStack";
import SettingsStack from "../stacks/SettingsStack";
import LogoutStack from "../stacks/LogoutStack";
import CustomBottomTabBarDeprecated from "./CustomBottomTabDeprecated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomBottomTabBarDeprecated {...props} />}
      initialRouteName="HomeStack"
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          title: "Home",

          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="AnalysisStack"
        component={AnalysisStack}
        options={{
          tabBarLabel: "Analysis",
          title: "Analysis",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="shield-search" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="AddTrigger"
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
          tabBarIcon: ({ color, size }) => {
            return <Icon name="cog" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Logout"
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
