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
import LoginStack from "./src/stacks/LoginStack";
import FastAccessScreen from "./src/pages/FastAccessScreen";
import { DevModeProvider } from "./src/contexts/DevModeProvider";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import TabNavigator from "./src/ui/TabNavigatior";
import { onOpenUrl, register } from "@tauri-apps/plugin-deep-link";
import UpdateManager from "./src/components/UpdateManager";
import * as store from "./src/utils/store";
import { i18n, initI18n } from "./src/i18n";
import { AppLanguage, toAppLanguage } from "./src/i18n/types";

const Tab = createBottomTabNavigator();

const protocol = async () => {
  await register("clavispass");
};

export function AppWithNavigation() {
  protocol();
  useEffect(() => {
    const cleanup = onOpenUrl((event) => {
      console.log("Deep link received:", event);
      try {
        const url = new URL(event as any);
        const code = url.searchParams.get("code");
        if (code) {
          console.log("Received code:", code);
        }
      } catch (err) {
        console.error("Fehler beim Parsen der URL:", err);
      }
    });

    return () => {
      cleanup.then((off) => off());
    };
  }, []);

  useEffect(() => {
    store.get("LANGUAGE").then((stored) => {
      const lang = toAppLanguage(stored);
      initLanguage(lang);
    });
  }, []);

  const initLanguage = async (lang: AppLanguage) => {
    await initI18n(lang);
  };
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
                          <TabNavigator />
                          <UpdateManager />
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
