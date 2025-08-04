import React, { createContext, useState, useContext, ReactNode } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { useTheme } from "./ThemeProvider";
import { Text } from "react-native-paper";

interface DevModeContextType {
  devMode: boolean;
  setDevMode: (value: boolean) => void;
}

export const DevModeContext = createContext<DevModeContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const DevModeProvider = ({ children }: Props) => {
  const { theme } = useTheme();
  const [devMode, setDevMode] = useState(false);

  const startDevTools = async () => {
    if (Platform.OS === "web") {
      const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
      const win = await WebviewWindow.getByLabel("main");
      if (!win) {
        return;
      }
      //win.openDevTools();
    }
  };

  return (
    <DevModeContext.Provider value={{ devMode, setDevMode }}>
      {children}
      {devMode && (
        <View
          style={{
            position: "relative",
            bottom: 0,
            right: 0,
            left: 0,
            height: 20,
            zIndex: 1000,
            backgroundColor: theme.colors.secondary,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          <Text style={{ color: "white" }}>DevMode</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              height: 20,
              alignItems: "center",
            }}
          >
            {Platform.OS === "web" && (
              <TouchableOpacity
                onPress={startDevTools}
                style={{
                  paddingLeft: 4,
                  paddingRight: 4,
                  height: 20,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white" }}>DevTools</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                paddingLeft: 4,
                paddingRight: 4,
                height: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setDevMode(false)}
            >
              <Text style={{ color: "white" }}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </DevModeContext.Provider>
  );
};

export const useDevMode = () => {
  return useContext(DevModeContext) as DevModeContextType;
};
