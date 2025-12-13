import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { listen } from "@tauri-apps/api/event";
import { Icon, Text, TextInput } from "react-native-paper";
import { useTheme } from "../app/providers/ThemeProvider";
import Header from "../shared/components/Header";
import PasswordTextbox from "../shared/components/PasswordTextbox";
import CopyToClipboard from "../shared/components/buttons/CopyToClipboard";
import { hideFastAccess } from "../features/fastaccess/utils/FastAccess";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import AnimatedPressable from "../shared/components/AnimatedPressable";

export default function FastAccessScreen() {
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { theme, globalStyles } = useTheme();

  useEffect(() => {
    listen("show-popup", (event) => {
      const payload = event.payload as {
        title: string;
        username: string;
        password: string;
      };
      setTitle(payload.title);
      setUsername(payload.username);
      setPassword(payload.password);
    });
  }, []);

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        width: "100%",
        height: "100%",
      }}
    >
      <Header
        leftNode={
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginLeft: 8,
              gap: 4,
              alignItems: "center",
            }}
          >
            <Icon
              color={theme.colors.primary}
              size={20}
              source={"tooltip-account"}
            />
            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.primary, userSelect: "none" }}
            >
              {title}
            </Text>
          </View>
        }
      >
        <View style={{ display: "flex", flexDirection: "row" }}>
          <AnimatedPressable
            onPress={async () => {
              const win = await WebviewWindow.getByLabel("main");
              if (!win) {
                return;
              }
              await win.show();
              await win.unminimize();
              await win.setFocus();
            }}
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
              source={"open-in-app"}
              size={20}
              color={theme.colors.primary}
            />
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => {
              hideFastAccess();
            }}
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
              color={theme.colors.primary}
            />
          </AnimatedPressable>
        </View>
      </Header>
      <View style={{ flex: 1, width: "100%", padding: 8, paddingTop: 0 }}>
        <View style={globalStyles.moduleView}>
          <View style={{ height: 40, flexGrow: 1 }}>
            <TextInput
              outlineStyle={globalStyles.outlineStyle}
              style={globalStyles.textInputStyle}
              value={username}
              mode="outlined"
            />
          </View>
          <CopyToClipboard value={username} />
        </View>

        <View style={globalStyles.moduleView}>
          <PasswordTextbox value={password} placeholder="" />
          <CopyToClipboard value={password} />
        </View>
      </View>
    </View>
  );
}
