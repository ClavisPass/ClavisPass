import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import "react-native-gesture-handler";
import { AuthProvider } from "./src/app/providers/AuthProvider";
import { DataProvider } from "./src/app/providers/DataProvider";
import { Platform, View } from "react-native";
import CustomTitlebar from "./src/shared/components/CustomTitlebar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GlobalShortcuts from "./src/shared/components/shortcuts/GlobalShortcuts";
import { ThemeProvider } from "./src/app/providers/ThemeProvider";
import { CloudProvider } from "./src/app/providers/CloudProvider";
import theme from "./src/shared/ui/theme";
import { OnlineProvider } from "./src/app/providers/OnlineProvider";
import FastAccessScreen from "./src/screens/FastAccessScreen";
import { DevModeProvider } from "./src/app/providers/DevModeProvider";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { onOpenUrl, register } from "@tauri-apps/plugin-deep-link";
import { logger } from "./src/infrastructure/logging/logger";
import GlobalErrorSnackbar from "./src/shared/components/GlobalErrorSnackbar";
import { SettingsProvider } from "./src/app/providers/SettingsProvider";
import I18nBridge from "./src/shared/components/I18nBridge";
import DropdownLayer from "./src/shared/components/web/DropdownLayer";
import NavigationContainer from "./src/app/navigation/NavigationContainer";

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
                        <NavigationContainer />
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
