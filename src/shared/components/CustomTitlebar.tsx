import React, { useEffect } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Icon } from "react-native-paper";
import { useAuth } from "../../app/providers/AuthProvider";
import { useTheme } from "../../app/providers/ThemeProvider";
import showMainWindow from "../../infrastructure/platform/showMainWindow";
import AnimatedPressable from "./AnimatedPressable";
import { useSetting } from "../../app/providers/SettingsProvider";
import {
  detectTauriEnvironment,
  isMacWebRuntime,
  isTauriEnvironment,
  useIsTauriEnvironment,
} from "../../infrastructure/platform/isTauri";
import {
  TITLEBAR_CONTROLS_WIDTH,
  TITLEBAR_HEIGHT,
} from "./titlebarMetrics";

export {
  TITLEBAR_CONTROLS_WIDTH,
  TITLEBAR_HEIGHT,
};

const styles = StyleSheet.create({
  titlebar: {
    height: TITLEBAR_HEIGHT,
    width: "100%",
    zIndex: 0,
  },
  windowControls: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    height: 40,
    left: 14,
    position: "absolute",
    top: 0,
    zIndex: 3,
  },
  windowControlButton: {
    borderRadius: 6,
    cursor: "pointer",
    height: 12,
    width: 12,
  },
});

type Props = {
  filled?: boolean;
};

type WindowControlsProps = {
  closeWindow: () => void;
  headerWhite: boolean;
  minimizeWindow: () => void;
};

function WindowControls(props: WindowControlsProps) {
  return (
    <View style={styles.windowControls} pointerEvents="box-none">
      <AnimatedPressable
        onPress={props.closeWindow}
        style={[styles.windowControlButton, { backgroundColor: "#FF5F57" }]}
      />
      <AnimatedPressable
        onPress={props.minimizeWindow}
        style={[styles.windowControlButton, { backgroundColor: "#FFBD2E" }]}
      />
      <View
        style={[
          styles.windowControlButton,
          {
            backgroundColor: props.headerWhite
              ? "rgba(255,255,255,0.36)"
              : "rgba(120,127,246,0.32)",
          },
        ]}
      />
    </View>
  );
}

function WindowsWindowControls(props: WindowControlsProps) {
  return (
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
        onPress={props.minimizeWindow}
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
          color={props.headerWhite ? "white" : "#787FF6"}
        />
      </AnimatedPressable>
      <AnimatedPressable
        onPress={props.closeWindow}
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
          color={props.headerWhite ? "white" : "#787FF6"}
        />
      </AnimatedPressable>
    </View>
  );
}

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
  const {
    headerWhite,
    headerSpacing,
    titlebarCenterGap,
    titlebarOverlayDragEnabled,
  } = useTheme();
  const { width } = useWindowDimensions();

  const { value: closeBehavior } = useSetting("CLOSE_BEHAVIOR");
  const { value: startBehavior } = useSetting("START_BEHAVIOR");
  const isTauri = useIsTauriEnvironment();
  const isMac = isMacWebRuntime();

  useEffect(() => {
    if (isTauri) {
      if (document) {
        const dragLeft = document.getElementById("titlebar-drag-left");
        const dragRight = document.getElementById("titlebar-drag-right");

        dragLeft?.setAttribute("data-tauri-drag-region", "");
        dragRight?.setAttribute("data-tauri-drag-region", "");

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(
          "::-webkit-scrollbar {width: 8px} ::-webkit-scrollbar-track {background: transparent;} ::-webkit-scrollbar-thumb {background: #5e5e5e50; border-radius: 10px;} input::-ms-reveal {display: none;} .css-text-146c3p1 {user-select: none;}"
        );
        document.adoptedStyleSheets = [sheet];
      }
    }
  }, [isTauri, titlebarOverlayDragEnabled, width]);

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

    if (closeBehavior === "hide") {
      auth.logout();
    }

    try {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("close_main_window", { behavior: closeBehavior });
    } catch (error) {
      console.warn("[CustomTitlebar] Native close command failed:", error);
      const [{ getCurrentWindow }, { exit }] = await Promise.all([
        import("@tauri-apps/api/window"),
        import("@tauri-apps/plugin-process"),
      ]);

      if (closeBehavior === "exit") {
        await exit(0);
      } else {
        await getCurrentWindow().hide();
      }
    }
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
          marginLeft: isMac ? 0 : headerSpacing + (width > 600 ? 88 : 0),
        }}
        pointerEvents="box-none"
      >
        {isMac ? (
          <WindowControls
            closeWindow={closeWindow}
            headerWhite={headerWhite}
            minimizeWindow={minimizeWindow}
          />
        ) : null}
        <View
          id={"titlebar"}
          style={{
            width: "100%",
            height: 40,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          pointerEvents="box-none"
        >
          {titlebarOverlayDragEnabled ? (
            <View
              id={"titlebar-drag-left"}
              style={{
                flex: 1,
                height: 40,
                marginLeft: isMac ? TITLEBAR_CONTROLS_WIDTH : 0,
              }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                marginLeft: isMac ? TITLEBAR_CONTROLS_WIDTH : 0,
              }}
              pointerEvents="none"
            />
          )}
          {titlebarOverlayDragEnabled && width > 600 && titlebarCenterGap > 0 ? (
            <View
              style={{
                width: titlebarCenterGap,
                height: 40,
              }}
              pointerEvents="none"
            />
          ) : null}
          {titlebarOverlayDragEnabled && width > 600 ? (
            <View
              id={"titlebar-drag-right"}
              style={{
                flex: 1,
                height: 40,
              }}
            />
          ) : null}
          {!isMac ? (
            <WindowsWindowControls
              closeWindow={closeWindow}
              headerWhite={headerWhite}
              minimizeWindow={minimizeWindow}
            />
          ) : null}
        </View>
      </View>
    ) : null}</>
  );
}

export default CustomTitlebar;
