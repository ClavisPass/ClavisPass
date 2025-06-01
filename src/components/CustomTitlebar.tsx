import React, { useEffect, useState } from "react";
import { Platform, View, StyleSheet } from "react-native";
import { Icon, TouchableRipple } from "react-native-paper";
import theme from "../ui/theme";
import WebSpecific from "./platformSpecific/WebSpecific";
import { getCurrentWebviewWindow, WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useAuth } from "../contexts/AuthProvider";
import isTauri from "../utils/isTauri";
import { useTheme } from "../contexts/ThemeProvider";

export const TITLEBAR_HEIGHT = Platform.OS === "web" ? 46 : 0;

const styles = StyleSheet.create({
  titlebar: {
    height: TITLEBAR_HEIGHT,
    width: "100%",
    zIndex: 0,
  },
});

type Props = {
  filled?: boolean;
};

export function TitlebarHeight(props: Props) {
  if (props.filled) {
    return (
      <WebSpecific>
        <View
          style={[
            styles.titlebar,
            { backgroundColor: "white", borderRadius: 20, marginBottom: 4 },
          ]}
        />
      </WebSpecific>
    );
  }
  return (
    <WebSpecific>
      <View style={styles.titlebar} />
    </WebSpecific>
  );
}

function CustomTitlebar() {
  const auth = useAuth();
  const {headerWhite} = useTheme();

  // Zustand für appWindow
  const [appWindow, setAppWindow] = useState<WebviewWindow | null>(null);

  useEffect(() => {
    if (isTauri()) {
      try {
        const window = getCurrentWebviewWindow();
        setAppWindow(window);
      } catch (error) {
        console.warn("Tauri runtime not ready yet:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") {
      if (document) {
        document.getElementById("titlebar")?.setAttribute("data-tauri-drag-region", "");

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(
          "::-webkit-scrollbar {width: 8px} ::-webkit-scrollbar-track {background: transparent;} ::-webkit-scrollbar-thumb {background: #5e5e5e50; border-radius: 10px;} input::-ms-reveal {display: none;} .css-text-146c3p1 {user-select: none;}"
        );
        document.adoptedStyleSheets = [sheet];
      }
    }
  }, []);

  const minimizeWindow = () => {
    if (appWindow) {
      appWindow.minimize();
    }
  };

  const closeWindow = () => {
    if (appWindow) {
      auth.logout();
      appWindow.hide();
    }
  };

  return (
    <WebSpecific>
      <View
        style={{
          position: "absolute",
          width: "100%",
          backgroundColor: "transparent",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View
          id={"titlebar"}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View></View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
              paddingLeft: 16,
            }}
          >
            <TouchableRipple
              onPress={minimizeWindow}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: 50,
                height: 38,
                borderRadius: 4,
              }}
              rippleColor="rgba(0, 0, 0, 0.158)"
            >
              <Icon
                source={"window-minimize"}
                size={20}
                color={headerWhite? 'white' : theme.colors.primary}
              />
            </TouchableRipple>
            <TouchableRipple
              onPress={closeWindow}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: 50,
                height: 38,
                borderRadius: 4,
              }}
              rippleColor="rgba(0, 0, 0, 0.158)"
            >
              <Icon
                source={"window-close"}
                size={20}
                color={headerWhite? 'white' : theme.colors.primary}
              />
            </TouchableRipple>
          </View>
        </View>
      </View>
    </WebSpecific>
  );
}

export default CustomTitlebar;
