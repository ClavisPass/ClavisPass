import React, { useEffect } from "react";
import { register } from "@tauri-apps/api/globalShortcut";
import { Platform } from "react-native";
import { appWindow } from "@tauri-apps/api/window";
import { useAuth } from "../../contexts/AuthProvider";

type Props = {};

function GlobalShortcuts(props: Props) {
  const auth = useAuth();
  const registerShortcuts = async () => {
    await register("alt+W", async () => {
      console.log("Shortcut triggered");
      const stateIsVisible = await appWindow.isVisible();
      const stateIsFocused = await appWindow.isFocused();
      if (stateIsVisible && stateIsFocused) {
        auth.logout();
        appWindow.hide();
      } else {
        appWindow.show();
        appWindow.unminimize();
        appWindow.setFocus();
      }
    });
  };
  useEffect(() => {
    if (Platform.OS === "web") {
      const isDev = process.env.NODE_ENV === "development";
      if (isDev) return;

      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          (event.ctrlKey && ["f", "p", "u", "+", "-"].includes(event.key.toLowerCase())) ||
          event.key === "F3"
        ) {
          event.preventDefault();
        }
      };

      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handleKeyDown);

      registerShortcuts();

      return () => {
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  return null;
}

export default GlobalShortcuts;
