import React from "react";

import { PaperProvider } from "react-native-paper";

import { CommonActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import "react-native-gesture-handler";

import HomeScreen from "./src/pages/HomeScreen";
import SettingsScreen from "./src/pages/SettingsScreen";

import theme from "./src/ui/theme";
import EditScreen from "./src/pages/EditScreen";
import AnalysisScreen from "./src/pages/AnalysisScreen";
import { AuthProvider } from "./src/contexts/AuthProvider";
import { DataProvider } from "./src/contexts/DataProvider";
import ProtectedRoute from "./src/utils/ProtectedRoute";
import LoginScreen from "./src/pages/LoginScreen";
import transitionSpecConfig from "./src/configs/TransitionSpecConfig";
import { Platform, View } from "react-native";
import CustomTitlebar from "./src/components/CustomTitlebar";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <DataProvider>
          <View
            style={{
              borderRadius: Platform.OS === "web" ? 10 : 0,
              overflow: "hidden",
              flex: 1,
            }}
          >
            <CustomTitlebar />
            <ProtectedRoute loginScreen={<LoginScreen />}>
              <NavigationContainer>
                <Tab.Navigator
                  initialRouteName="HomeStack"
                  screenOptions={{
                    headerShown: false,
                  }}
                  tabBar={({ navigation, state, descriptors, insets }) => (
                    <BottomNavigation.Bar
                      shifting={true}
                      navigationState={state}
                      safeAreaInsets={insets}
                      onTabPress={({ route, preventDefault }) => {
                        const event = navigation.emit({
                          type: "tabPress",
                          target: route.key,
                          canPreventDefault: true,
                        });

                        if (event.defaultPrevented) {
                          preventDefault();
                        } else {
                          navigation.dispatch({
                            ...CommonActions.navigate(route.name, route.params),
                            target: state.key,
                          });
                        }
                      }}
                      renderIcon={({ route, focused, color }) => {
                        const { options } = descriptors[route.key];
                        if (options.tabBarIcon) {
                          return options.tabBarIcon({
                            focused,
                            color,
                            size: 24,
                          });
                        }

                        return null;
                      }}
                      getLabelText={({ route }) => {
                        const { options } = descriptors[route.key];

                        let label: string = "test";

                        if (options.title !== undefined) {
                          label = options.title;
                        }

                        return label;
                      }}
                    />
                  )}
                >
                  <Tab.Screen
                    name="Analysis"
                    component={AnalysisScreen}
                    options={{
                      tabBarLabel: "Analysis",
                      title: "Analysis",
                      tabBarIcon: ({ color, size }) => {
                        return (
                          <Icon
                            name="shield-search"
                            size={size}
                            color={color}
                          />
                        );
                      },
                    }}
                  />
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
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                      tabBarLabel: "Settings",
                      title: "Settings",
                      tabBarIcon: ({ color, size }) => {
                        return <Icon name="cog" size={size} color={color} />;
                      },
                    }}
                  />
                </Tab.Navigator>
              </NavigationContainer>
            </ProtectedRoute>
          </View>
        </DataProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: "vertical",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: transitionSpecConfig,
            close: transitionSpecConfig,
          },
        }}
      />
      <Stack.Screen
        name="Edit"
        component={EditScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: transitionSpecConfig,
            close: transitionSpecConfig,
          },
        }}
      />
    </Stack.Navigator>
  );
}
