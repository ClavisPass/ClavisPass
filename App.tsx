import React from "react";

import { CommonActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import "react-native-gesture-handler";

import HomeScreen from "./src/pages/HomeScreen";
import SettingsScreen from "./src/pages/SettingsScreen";

import EditScreen from "./src/pages/EditScreen";
import AnalysisScreen, {
  CachedPasswordsType,
} from "./src/pages/AnalysisScreen";
import { AuthProvider, useAuth } from "./src/contexts/AuthProvider";
import { DataProvider } from "./src/contexts/DataProvider";
import ProtectedRoute from "./src/utils/ProtectedRoute";
import LoginScreen from "./src/pages/LoginScreen";
import transitionSpecConfig from "./src/configs/TransitionSpecConfig";
import {
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CustomTitlebar from "./src/components/CustomTitlebar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GlobalShortcuts from "./src/components/shortcuts/GlobalShortcuts";
import { ThemeProvider } from "./src/contexts/ThemeProvider";
import { TokenProvider } from "./src/contexts/TokenProvider";
import ValuesType from "./src/types/ValuesType";
import ScanScreen from "./src/pages/ScanScreen";
import theme from "./src/ui/theme";
import AnalysisDetailScreen from "./src/pages/AnalysisDetailScreen";
import { OnlineProvider } from "./src/contexts/OnlineProvider";
import LogoutScreen from "./src/pages/LogoutScreen";
import CustomBottomTab from "./src/ui/CustomBottomTab";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <OnlineProvider>
          <AuthProvider>
            <TokenProvider>
              <DataProvider>
                <View
                  style={{
                    borderRadius: Platform.OS === "web" ? 10 : 0,
                    borderColor:
                      Platform.OS === "web" ? theme.colors.primary : undefined,
                    borderWidth: Platform.OS === "web" ? 1 : 0,
                    overflow: "hidden",
                    flex: 1,
                  }}
                >
                  <GlobalShortcuts />
                  <CustomTitlebar />
                  <NavigationContainer>
                    <ProtectedRoute loginScreen={<LoginStack />}>
                      {/*<Tab.Navigator
                        initialRouteName="HomeStack"
                        screenOptions={{
                          headerShown: false,
                        }}
                        tabBar={({
                          navigation,
                          state,
                          descriptors,
                          insets,
                        }) => (
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
                                  ...CommonActions.navigate(
                                    route.name,
                                    route.params
                                  ),
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
                          name="HomeStack"
                          component={HomeStack}
                          options={{
                            tabBarLabel: "Home",
                            title: "Home",

                            tabBarIcon: ({ color, size }) => {
                              return (
                                <Icon name="home" size={size} color={color} />
                              );
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
                          name="SettingsStack"
                          component={SettingsStack}
                          options={{
                            tabBarLabel: "Settings",
                            title: "Settings",
                            tabBarIcon: ({ color, size }) => {
                              return (
                                <Icon name="cog" size={size} color={color} />
                              );
                            },
                          }}
                        />
                        <Tab.Screen
                          name="Logout"
                          component={LogoutScreen}
                          options={{
                            tabBarLabel: "Logout",
                            tabBarIcon: ({ color, size }) => (
                              <Icon name="logout" color={color} size={size} />
                            ),
                          }}
                        />
                      </Tab.Navigator>*/}
                      <Tab.Navigator
                        initialRouteName="HomeStack"
                        screenOptions={{ headerShown: false }}
                        tabBar={(props) => <CustomBottomTab {...props} />}
                      >
                        <Tab.Screen
                          name="HomeStack"
                          component={HomeStack}
                          options={{
                            tabBarLabel: "Home",
                            title: "Home",

                            tabBarIcon: ({ color, size }) => {
                              return (
                                <Icon name="home" size={size} color={color} />
                              );
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
                          name="AddTrigger"
                          component={() => null} // Dummy-Screen
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
                              return (
                                <Icon name="cog" size={size} color={color} />
                              );
                            },
                          }}
                        />
                        <Tab.Screen
                          name="Logout"
                          component={LogoutScreen}
                          options={{
                            tabBarLabel: "Logout",
                            tabBarIcon: ({ color, size }) => (
                              <Icon name="logout" color={color} size={size} />
                            ),
                          }}
                        />
                      </Tab.Navigator>
                    </ProtectedRoute>
                  </NavigationContainer>
                </View>
              </DataProvider>
            </TokenProvider>
          </AuthProvider>
        </OnlineProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export type RootStackParamList = {
  Home: {
    triggerAdd: boolean | undefined;
  };
  Edit: {
    value: ValuesType;
  };
  Analysis: undefined;
  AnalysisDetail: {
    value: CachedPasswordsType;
  };
  Settings: undefined;
  Login: undefined;
  Scan: undefined;
};

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureDirection: "vertical",
        gestureEnabled: true,
        detachPreviousScreen: false,
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
          detachPreviousScreen: false,
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

function AnalysisStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureDirection: "vertical",
      }}
    >
      <Stack.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: transitionSpecConfig,
            close: transitionSpecConfig,
          },
          detachPreviousScreen: false,
        }}
      />
      <Stack.Screen
        name="AnalysisDetail"
        component={AnalysisDetailScreen}
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

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: "vertical",
      }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: transitionSpecConfig,
            close: transitionSpecConfig,
          },
          detachPreviousScreen: false,
        }}
      />
      <Stack.Screen
        name="Scan"
        component={ScanScreen}
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

function LoginStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: "vertical",
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: transitionSpecConfig,
            close: transitionSpecConfig,
          },
        }}
      />
      <Stack.Screen
        name="Scan"
        component={ScanScreen}
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
