import React, { useEffect } from "react";
import { register, unregister } from "@tauri-apps/plugin-global-shortcut";
import { Platform } from "react-native";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useAuth } from "../../../app/providers/AuthProvider";

function GlobalShortcuts() {
  const auth = useAuth();

  useEffect(() => {
    if (Platform.OS === "web") {
      const isDev = process.env.NODE_ENV === "development";
      if (isDev) return;

      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      const handleWheel = (event: WheelEvent) => {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
        }
      };
      const handleKeyDown = (event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        const isBrowserShortcut =
          (event.ctrlKey &&
            [
              "0",
              "=",
              "+",
              "-",
              "c",
              "f",
              "i",
              "j",
              "l",
              "o",
              "p",
              "r",
              "s",
              "u",
            ].includes(key)) ||
          (event.ctrlKey && event.shiftKey && ["c", "i", "j"].includes(key)) ||
          ["f1", "f3", "f5", "f6", "f11", "f12"].includes(key) ||
          (event.altKey && ["arrowleft", "arrowright", "home"].includes(key));

        if (
          isBrowserShortcut ||
          ((event.metaKey || event.ctrlKey) && ["+", "-", "="].includes(key))
        ) {
          event.preventDefault();
          event.stopPropagation();
        }
      };

      document.addEventListener("contextmenu", handleContextMenu, true);
      window.addEventListener("keydown", handleKeyDown, true);
      window.addEventListener("wheel", handleWheel, {
        passive: false,
        capture: true,
      });

      return () => {
        document.removeEventListener("contextmenu", handleContextMenu, true);
        window.removeEventListener("keydown", handleKeyDown, true);
        window.removeEventListener("wheel", handleWheel, true);
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
