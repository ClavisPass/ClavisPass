import React, { useEffect } from "react";
import { Platform, View, StyleSheet } from "react-native";
import { Icon, IconButton, TouchableRipple } from "react-native-paper";
import theme from "../ui/theme";
import WebSpecific from "./platformSpecific/WebSpecific";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useAuth } from "../contexts/AuthProvider";
const appWindow = getCurrentWebviewWindow()

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
        ></View>
      </WebSpecific>
    );
  }
  return (
    <WebSpecific>
      <View style={styles.titlebar}></View>
    </WebSpecific>
  );
}

function CustomTitlebar() {
  const auth = useAuth();
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

  const minimizeWindow = () => {
    if (Platform.OS === "web") {
      appWindow.minimize();
    }
  };

  const closeWindow = () => {
    if (Platform.OS === "web") {
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
                color={theme.colors.primary}
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
                color={theme.colors.primary}
              />
            </TouchableRipple>
          </View>
        </View>
      </View>
    </WebSpecific>
  );
}

export default CustomTitlebar;
