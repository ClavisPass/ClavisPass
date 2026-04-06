import React, { useEffect } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Icon } from "react-native-paper";
import theme from "../ui/theme";
import { useAuth } from "../../app/providers/AuthProvider";
import { useTheme } from "../../app/providers/ThemeProvider";
import showMainWindow from "../../infrastructure/platform/showMainWindow";
import AnimatedPressable from "./AnimatedPressable";
import { useSetting } from "../../app/providers/SettingsProvider";
import {
  detectTauriEnvironment,
  isTauriEnvironment,
  useIsTauriEnvironment,
} from "../../infrastructure/platform/isTauri";

export const TITLEBAR_HEIGHT = isTauriEnvironment() ? 40 : 0;

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
  if (!isTauriEnvironment()) {
    return null;
  }

  if (props.filled) {
    return (
      <View
        style={[
          styles.titlebar,
          { backgroundColor: "white", borderRadius: 20, marginBottom: 4 },
        ]}
      />
    );
  }
  return <View style={styles.titlebar} />;
}

function CustomTitlebar() {
  const auth = useAuth();
  const { headerWhite, headerSpacing } = useTheme();
  const { width } = useWindowDimensions();

  const { value: closeBehavior } = useSetting("CLOSE_BEHAVIOR");
  const { value: startBehavior } = useSetting("START_BEHAVIOR");
  const isTauri = useIsTauriEnvironment();

  useEffect(() => {
    if (isTauri) {
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
  }, [isTauri]);

  useEffect(() => {
    if (isTauri) {
      showMainWindow(startBehavior);
    }
  }, [isTauri, startBehavior]);

  const minimizeWindow = async () => {
    if (!(await detectTauriEnvironment())) return;
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    const appWindow = getCurrentWindow();
    if (appWindow) {
      await appWindow.minimize();
    }
  };

  const closeWindow = async () => {
    if (!(await detectTauriEnvironment())) return;
    const [{ getCurrentWindow }, { exit }] = await Promise.all([
      import("@tauri-apps/api/window"),
      import("@tauri-apps/plugin-process"),
    ]);
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
    <>{isTauri ? (
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
    ) : null}</>
  );
}

export default CustomTitlebar;
