import React, { useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { listen } from "@tauri-apps/api/event";
import {
  Icon,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { useTheme } from "../contexts/ThemeProvider";
import Header from "../components/Header";
import PasswordTextbox from "../components/PasswordTextbox";
import CopyToClipboard from "../components/buttons/CopyToClipboard";
import { hideFastAccess } from "../utils/FastAccess";

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
            }}
          >
            <Icon
              color={theme.colors.primary}
              size={20}
              source={"tooltip-account"}
            />
            <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
              {title}
            </Text>
          </View>
        }
      >
        <TouchableRipple
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
          rippleColor="rgba(0, 0, 0, 0.158)"
        >
          <Icon
            source={"window-close"}
            size={20}
            color={theme.colors.primary}
          />
        </TouchableRipple>
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
