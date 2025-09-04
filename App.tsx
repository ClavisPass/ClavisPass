import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import "react-native-gesture-handler";
import { AuthProvider } from "./src/contexts/AuthProvider";
import { DataProvider } from "./src/contexts/DataProvider";
import ProtectedRoute from "./src/utils/ProtectedRoute";
import { Platform, View, Text } from "react-native";
import CustomTitlebar from "./src/components/CustomTitlebar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GlobalShortcuts from "./src/components/shortcuts/GlobalShortcuts";
import { ThemeProvider } from "./src/contexts/ThemeProvider";
import { TokenProvider } from "./src/contexts/TokenProvider";
import theme from "./src/ui/theme";
import { OnlineProvider } from "./src/contexts/OnlineProvider";
import CustomBottomTab from "./src/ui/CustomBottomTab";
import HomeStack from "./src/stacks/HomeStack";
import AnalysisStack from "./src/stacks/AnalysisStack";
import SettingsStack from "./src/stacks/SettingsStack";
import LoginStack from "./src/stacks/LoginStack";
import FastAccessScreen from "./src/pages/FastAccessScreen";
import { DevModeProvider } from "./src/contexts/DevModeProvider";
import LogoutStack from "./src/stacks/LogoutStack";
import AddTriggerStack from "./src/stacks/AddTriggerStack";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

const Tab = createBottomTabNavigator();

export function AppWithNavigation() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AutocompleteDropdownContextProvider>
        <ThemeProvider>
          <OnlineProvider>
            <AuthProvider>
              <TokenProvider>
                <DataProvider>
                  <DevModeProvider>
                    <View
                      style={{
                        borderRadius: Platform.OS === "web" ? 6 : 0,
                        borderColor:
                          Platform.OS === "web"
                            ? theme.colors.primary
                            : undefined,
                        borderWidth: Platform.OS === "web" ? 1 : 0,
                        overflow: "hidden",
                        flex: 1,
                      }}
                    >
                      <GlobalShortcuts />
                      <CustomTitlebar />
                      <NavigationContainer>
                        <ProtectedRoute loginScreen={<LoginStack />}>
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
                                    <Icon
                                      name="home"
                                      size={size}
                                      color={color}
                                    />
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
                                  return (
                                    <Icon
                                      name="cog"
                                      size={size}
                                      color={color}
                                    />
                                  );
                                },
                              }}
                            />
                            <Tab.Screen
                              name="Logout"
                              component={LogoutStack}
                              options={{
                                tabBarLabel: "Logout",
                                tabBarIcon: ({ color, size }) => (
                                  <Icon
                                    name="logout"
                                    color={color}
                                    size={size}
                                  />
                                ),
                              }}
                            />
                          </Tab.Navigator>
                        </ProtectedRoute>
                      </NavigationContainer>
                    </View>
                  </DevModeProvider>
                </DataProvider>
              </TokenProvider>
            </AuthProvider>
          </OnlineProvider>
        </ThemeProvider>
      </AutocompleteDropdownContextProvider>
    </GestureHandlerRootView>
  );
}

let getCurrentWindowSafe: (() => Promise<{ label: string }>) | null = null;

if (Platform.OS === "web") {
  getCurrentWindowSafe = async () => {
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    const win = getCurrentWindow();
    const label = await win.label;
    return { label };
  };
}

export default function App() {
  const [view, setView] = useState<"main" | "popup" | null>(null);

  useEffect(() => {
    const detectWindow = async () => {
      if (Platform.OS !== "web" || !getCurrentWindowSafe) {
        // Native Plattformen -> Immer Main
        setView("main");
        return;
      }

      try {
        const { label } = await getCurrentWindowSafe();
        if (label === "main") {
          setView("main");
        } else {
          setView("popup");
        }
      } catch (e) {
        console.warn("Fehler beim Lesen des Fensters:", e);
        setView("main");
      }
    };

    detectWindow();
  }, []);

  if (view === null)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  if (view === "popup")
    return (
      <ThemeProvider>
        <FastAccessScreen />
      </ThemeProvider>
    );
  return <AppWithNavigation />;
}
