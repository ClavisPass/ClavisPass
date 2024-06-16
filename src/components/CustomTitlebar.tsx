import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { Divider, IconButton } from "react-native-paper";
import theme from "../ui/theme";
import WebSpecific from "./platformSpecific/WebSpecific";
import { appWindow } from "@tauri-apps/api/window";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../ui/linearGradient";

type Props = {};

export function TitlebarHeight() {
  return (
    <WebSpecific>
      <View style={{ height: 46, width: "100%", zIndex: 9999 }}></View>
    </WebSpecific>
  );
}

function CustomTitlebar(props: Props) {
  useEffect(() => {
    if (Platform.OS === "web") {
      if (document) {
        document
          .getElementById("titlebar")
          ?.setAttribute("data-tauri-drag-region", "");
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
      appWindow.close();
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
          <View>
            {/*
            <IconButton
              icon={"layers-outline"}
              iconColor={"white"}
              size={20}
              onPress={minimizeWindow}
            />
            */}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
              paddingLeft: 16,
            }}
          >
            <IconButton
              icon={"window-minimize"}
              iconColor={theme.colors.primary}
              size={20}
              onPress={minimizeWindow}
            />
            <IconButton
              icon={"window-close"}
              iconColor={theme.colors.primary}
              size={20}
              onPress={closeWindow}
            />
          </View>
        </View>
        {/*<LinearGradient
          colors={getColors().reverse()}
          dither={true}
          style={{
            width: "96%",
            height: 2,
            borderRadius: 10,
          }}
          end={{ x: 0.1, y: 0.2 }}
        />*/}
      </View>
    </WebSpecific>
  );
}

export default CustomTitlebar;
