import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import {
  useFonts,
  LexendExa_400Regular,
  LexendExa_700Bold,
} from "@expo-google-fonts/lexend-exa";
import { AuthProvider } from "./src/app/providers/AuthProvider";
import { View } from "react-native";
import CustomTitlebar from "./src/shared/components/CustomTitlebar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GlobalShortcuts from "./src/shared/components/shortcuts/GlobalShortcuts";
import { ThemeProvider } from "./src/app/providers/ThemeProvider";
import { CloudProvider } from "./src/app/providers/CloudProvider";
import { OnlineProvider } from "./src/app/providers/OnlineProvider";
import FastAccessScreen from "./src/screens/FastAccessScreen";
import { DevModeProvider } from "./src/app/providers/DevModeProvider";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { logger } from "./src/infrastructure/logging/logger";
import GlobalErrorSnackbar from "./src/shared/components/GlobalErrorSnackbar";
import { SettingsProvider } from "./src/app/providers/SettingsProvider";
import I18nBridge from "./src/shared/components/I18nBridge";
import DropdownLayer from "./src/shared/components/web/DropdownLayer";
import NavigationContainer from "./src/app/navigation/NavigationContainer";
import { VaultProvider } from "./src/app/providers/VaultProvider";
import { ContentProtectionProvider } from "./src/app/providers/ContentProtectionProvider";
import GlobalClipboardSnackbar from "./src/shared/components/GlobalClipboardSnackbar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getAppScheme } from "./src/shared/utils/appScheme";
import MobileFastAccessOverlay from "./src/features/fastaccess/components/MobileFastAccessOverlay";
import FastAccessSessionBridge from "./src/features/fastaccess/components/FastAccessSessionBridge";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import BrowserBridgeSessionSync from "./src/features/browserBridge/components/BrowserBridgeSessionSync";
import BrowserBridgeWriteSync from "./src/features/browserBridge/components/BrowserBridgeWriteSync";
import { useTheme } from "./src/app/providers/ThemeProvider";
import {
  detectTauriEnvironment,
  useIsTauriEnvironment,
} from "./src/infrastructure/platform/isTauri";

export function AppWithNavigation() {
  useEffect(() => {
    void (async () => {
      if (!(await detectTauriEnvironment())) {
        return;
      }

      const { register } = await import("@tauri-apps/plugin-deep-link");
      await register(getAppScheme());
    })();
  }, []);

  useEffect(() => {
    let cleanup: Promise<() => void> | null = null;
    void (async () => {
      if (!(await detectTauriEnvironment())) {
        return;
      }

      const { onOpenUrl } = await import("@tauri-apps/plugin-deep-link");
      cleanup = onOpenUrl((event) => {
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
    })();
    return () => {
      cleanup?.then((off) => off());
    };
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
        <AutocompleteDropdownContextProvider>
          <SettingsProvider>
            <ContentProtectionProvider defaultEnabled={true}>
              <ThemeProvider>
                <AppShell />
              </ThemeProvider>
            </ContentProtectionProvider>
          </SettingsProvider>
        </AutocompleteDropdownContextProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const getCurrentWindowSafe = async () => {
  if (!(await detectTauriEnvironment())) {
    return null;
  }
  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  const win = getCurrentWindow();
  const label = await win.label;
  return { label };
};

export default function App() {
  const [fontsLoaded] = useFonts({
    LexendExa_400Regular,
    LexendExa_700Bold,
  });
  const [view, setView] = useState<"main" | "popup" | null>(null);

  useEffect(() => {
    const detectWindow = async () => {
      if (!(await detectTauriEnvironment())) {
        setView("main");
        return;
      }

      try {
        const windowInfo = await getCurrentWindowSafe();
        if (!windowInfo) {
          setView("main");
          return;
        }
        const { label } = windowInfo;
        setView(label === "popup" ? "popup" : "main");
      } catch (e) {
        logger.warn("Fehler beim Lesen des Fensters:", e);
        setView("main");
      }
    };

    detectWindow();
  }, []);

  if (!fontsLoaded || view === null) return <></>;

  if (view === "popup") {
    return (
      <SafeAreaProvider>
        <SettingsProvider>
          <ThemeProvider>
            <I18nBridge />
            <FastAccessScreen />
          </ThemeProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    );
  }

  return <AppWithNavigation />;
}

function AppShell() {
  const { theme } = useTheme();
  const isTauri = useIsTauriEnvironment();

  return (
    <>
      <DropdownLayer />
      <I18nBridge />
      <OnlineProvider>
        <AuthProvider>
          <FastAccessSessionBridge />
          <CloudProvider>
            <VaultProvider>
              <BrowserBridgeSessionSync />
              <BrowserBridgeWriteSync />
              <DevModeProvider>
                <BottomSheetModalProvider>
                  <GlobalErrorSnackbar />
                  <GlobalClipboardSnackbar />
                  <MobileFastAccessOverlay />
                  <View style={{ flex: 1, backgroundColor: "transparent" }}>
                    <View
                      style={{
                        borderColor:
                          isTauri ? theme.colors.primary : undefined,
                        borderRadius: isTauri ? 6 : 0,
                        borderWidth: isTauri ? 1 : 0,
                        backgroundColor: theme.colors.background,
                        overflow: "hidden",
                        flex: 1,
                      }}
                    >
                      <GlobalShortcuts />
                      <CustomTitlebar />
                      <NavigationContainer />
                    </View>
                  </View>
                </BottomSheetModalProvider>
              </DevModeProvider>
            </VaultProvider>
          </CloudProvider>
        </AuthProvider>
      </OnlineProvider>
    </>
  );
}

