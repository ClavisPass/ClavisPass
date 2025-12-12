import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { AuthProvider } from "./src/contexts/AuthProvider";
import { DataProvider } from "./src/contexts/DataProvider";
import ProtectedRoute from "./src/utils/ProtectedRoute";
import { Platform, View } from "react-native";
import CustomTitlebar from "./src/components/CustomTitlebar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GlobalShortcuts from "./src/components/shortcuts/GlobalShortcuts";
import { ThemeProvider } from "./src/contexts/ThemeProvider";
import { CloudProvider } from "./src/contexts/CloudProvider";
import theme from "./src/ui/theme";
import { OnlineProvider } from "./src/contexts/OnlineProvider";
import LoginStack from "./src/stacks/LoginStack";
import FastAccessScreen from "./src/pages/FastAccessScreen";
import { DevModeProvider } from "./src/contexts/DevModeProvider";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import TabNavigator from "./src/ui/TabNavigatior";
import { onOpenUrl, register } from "@tauri-apps/plugin-deep-link";
import UpdateManager from "./src/components/UpdateManager";
import { logger } from "./src/utils/logger";
import GlobalErrorSnackbar from "./src/components/GlobalErrorSnackbar";
import { SettingsProvider } from "./src/contexts/SettingsProvider";
import I18nBridge from "./src/components/I18nBridge";
import DropdownLayer from "./src/components/web/DropdownLayer";

const Tab = createBottomTabNavigator();

const protocol = async () => {
  await register("clavispass");
};

export function AppWithNavigation() {
  protocol();

  useEffect(() => {
    const cleanup = onOpenUrl((event) => {
      logger.info("Deep link received:", event);
      try {
        const url = new URL(event as any);
        const code = url.searchParams.get("code");
        if (code) {
          logger.info("Received code:", code);
        }
      } catch (err) {
        logger.error("Fehler beim Parsen der URL:", err);
      }
    });

    return () => {
      cleanup.then((off) => off());
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AutocompleteDropdownContextProvider>
        <SettingsProvider>
          <ThemeProvider>
            <DropdownLayer />
            <I18nBridge />
            <OnlineProvider>
              <AuthProvider>
                <CloudProvider>
                  <DataProvider>
                    <DevModeProvider>
                      <GlobalErrorSnackbar />
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
                </CloudProvider>
              </AuthProvider>
            </OnlineProvider>
          </ThemeProvider>
        </SettingsProvider>
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
        setView("main");
        return;
      }

      try {
        const { label } = await getCurrentWindowSafe();
        setView(label === "main" ? "main" : "popup");
      } catch (e) {
        logger.warn("Fehler beim Lesen des Fensters:", e);
        setView("main");
      }
    };

    detectWindow();
  }, []);

  if (view === null) return <></>;

  if (view === "popup") {
    return (
      <SettingsProvider>
        <ThemeProvider>
          <I18nBridge />
          <FastAccessScreen />
        </ThemeProvider>
      </SettingsProvider>
    );
  }

  return <AppWithNavigation />;
}
