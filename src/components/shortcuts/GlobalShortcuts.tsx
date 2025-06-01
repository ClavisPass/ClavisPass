import React, { useEffect, useState } from "react";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { Platform } from "react-native";
import { getCurrentWebviewWindow, WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useAuth } from "../../contexts/AuthProvider";

function GlobalShortcuts() {
  const auth = useAuth();
  const [appWindow, setAppWindow] = useState<WebviewWindow | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      const isDev = process.env.NODE_ENV === "development";
      if (isDev) return;

      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
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

      // Hier RICHTIG die Funktion aufrufen!
      const windowInstance = getCurrentWebviewWindow();
      setAppWindow(windowInstance);

      return () => {
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  useEffect(() => {
    if (!appWindow) return;

    const registerShortcuts = async () => {
      await register("alt+W", async () => {
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

    registerShortcuts();

    // Optional: Aufräumen mit unregister

  }, [appWindow, auth]);

  return null;
}

export default GlobalShortcuts;
