import React, { useEffect } from "react";
import { useAuth } from "../../../app/providers/AuthProvider";
import {
  detectTauriEnvironment,
  useIsTauriEnvironment,
} from "../../../infrastructure/platform/isTauri";

function GlobalShortcuts() {
  const auth = useAuth();
  const isTauri = useIsTauriEnvironment();

  useEffect(() => {
    if (isTauri) {
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
  }, [isTauri]);

  const windowInstance = async () => {
    if (!(await detectTauriEnvironment())) {
      return;
    }
    const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
    const win = await WebviewWindow.getByLabel("main");
    if (!win) {
      return;
    }
    return win;
  };

  useEffect(() => {
    let lastTriggered = 0;
    let active = true;

    const registerShortcut = async () => {
      if (!(await detectTauriEnvironment())) {
        return;
      }

      const { register } = await import("@tauri-apps/plugin-global-shortcut");
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

    void registerShortcut();
    return () => {
      active = false;
      void (async () => {
        if (!(await detectTauriEnvironment())) {
          return;
        }
        const { unregister } = await import("@tauri-apps/plugin-global-shortcut");
        await unregister("Alt+W");
      })();
    };
  }, []);

  return null;
}

export default GlobalShortcuts;
