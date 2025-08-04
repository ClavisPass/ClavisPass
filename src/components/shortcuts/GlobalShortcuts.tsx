import React, { useEffect, useState } from "react";
import { register, unregister } from "@tauri-apps/plugin-global-shortcut";
import { Platform } from "react-native";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useAuth } from "../../contexts/AuthProvider";

function GlobalShortcuts() {
  const auth = useAuth();

  useEffect(() => {
    if (Platform.OS === "web") {
      const isDev = process.env.NODE_ENV === "development";
      if (isDev) return;

      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          (event.ctrlKey &&
            ["f", "p", "u", "+", "-", "j"].includes(event.key.toLowerCase())) ||
          event.key === "F3"
        ) {
          event.preventDefault();
        }
      };

      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  const windowInstance = async () => {
    const win = await WebviewWindow.getByLabel("main");
    if (!win) {
      return;
    }
    return win;
  };

  useEffect(() => {
    let lastTriggered = 0;

    const registerShortcut = async () => {
      await register("Alt+W", async () => {
        const now = Date.now();
        if (now - lastTriggered < 500) {
          return;
        }
        lastTriggered = now;
        const appWindow = await windowInstance();
        if (!appWindow) {
          return;
        }
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

    registerShortcut();
    return () => {
      unregister("Alt+W");
    };
  }, []);

  return null;
}

export default GlobalShortcuts;
