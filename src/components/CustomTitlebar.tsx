import React, { useEffect } from "react";
import { Platform, View, StyleSheet, useWindowDimensions } from "react-native";
import { Icon } from "react-native-paper";
import theme from "../ui/theme";
import WebSpecific from "./platformSpecific/WebSpecific";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useAuth } from "../contexts/AuthProvider";
import { exit } from "@tauri-apps/plugin-process";
import { useTheme } from "../contexts/ThemeProvider";
import showMainWindow from "../utils/showMainWindow";
import AnimatedPressable from "./AnimatedPressable";
import { useSetting } from "../contexts/SettingsProvider";

export const TITLEBAR_HEIGHT = Platform.OS === "web" ? 40 : 0;

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
  const { headerWhite, headerSpacing } = useTheme();
  const { width } = useWindowDimensions();

  const { value: closeBehavior } = useSetting("CLOSE_BEHAVIOR");
  const { value: startBehavior } = useSetting("START_BEHAVIOR");

  useEffect(() => {
    if (Platform.OS === "web") {
      if (document) {
        document
          .getElementById("titlebar")
          ?.setAttribute("data-tauri-drag-region", "");

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(
          "::-webkit-scrollbar {width: 8px} ::-webkit-scrollbar-track {background: transparent;} ::-webkit-scrollbar-thumb {background: #5e5e5e50; border-radius: 10px;} input::-ms-reveal {display: none;} .css-text-146c3p1 {user-select: none;}"
        );
        document.adoptedStyleSheets = [sheet];
      }
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") {
      showMainWindow(startBehavior);
    }
  }, [startBehavior]);

  const minimizeWindow = () => {
    const appWindow = getCurrentWindow();
    if (appWindow) {
      appWindow.minimize();
    }
  };

  const closeWindow = async () => {
    const appWindow = getCurrentWindow();
    if (!appWindow) return;

    if (closeBehavior === "exit") {
      await exit(0);
      return;
    }

    auth.logout();
    appWindow.hide();
  };

  return (
    <WebSpecific>
      <View
        style={{
          left: 0,
          right: 0,
          position: "absolute",
          backgroundColor: "transparent",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginLeft: headerSpacing + (width > 600 ? 88 : 0),
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
          <View />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
              paddingLeft: 16,
            }}
          >
            <AnimatedPressable
              onPress={minimizeWindow}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: 50,
                height: 40,
                borderRadius: 4,
              }}
            >
              <Icon
                source={"window-minimize"}
                size={20}
                color={headerWhite ? "white" : theme.colors.primary}
              />
            </AnimatedPressable>
            <AnimatedPressable
              onPress={closeWindow}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: 50,
                height: 40,
                borderRadius: 4,
                borderBottomEndRadius: 12,
              }}
            >
              <Icon
                source={"window-close"}
                size={20}
                color={headerWhite ? "white" : theme.colors.primary}
              />
            </AnimatedPressable>
          </View>
        </View>
      </View>
    </WebSpecific>
  );
}

export default CustomTitlebar;
