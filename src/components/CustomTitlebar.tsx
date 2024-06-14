import React, { useEffect } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import theme from "../ui/theme";
import WebSpecific from "./platformSpecific/WebSpecific";

import { appWindow } from "@tauri-apps/api/window";

type Props = {};

function CustomTitlebar(props: Props) {
  useEffect(() => {
    document
      .getElementById("titlebar")
      ?.setAttribute("data-tauri-drag-region", "");
  });
  return (
    <WebSpecific>
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
          onPress={() => {
            appWindow.minimize();
          }}
        />
        <IconButton
          icon={"window-close"}
          iconColor={theme.colors.primary}
          size={20}
          onPress={() => {
            appWindow.close();
          }}
        />
      </View>
    </WebSpecific>
  );
}

export default CustomTitlebar;
