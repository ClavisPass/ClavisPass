import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useSetting } from "../../../app/providers/SettingsProvider";
import { subscribeHotkeyRecording } from "../../../infrastructure/events/hotkeyRecordingBus";
import { emitOpenAddValueRequest } from "../../../infrastructure/events/openAddValueBus";
import { HotkeyAction } from "../../../infrastructure/platform/hotkeys";
import { logger } from "../../../infrastructure/logging/logger";
import {
  detectTauriEnvironment,
  useIsTauriEnvironment,
} from "../../../infrastructure/platform/isTauri";

function GlobalShortcuts() {
  const auth = useAuth();
  const isTauri = useIsTauriEnvironment();
  const { value: hotkeys } = useSetting("HOTKEYS");
  const [hotkeyRecording, setHotkeyRecording] = useState(false);
  const logoutRef = useRef(auth.logout);
  const isLoggedInRef = useRef(auth.isLoggedIn);

  useEffect(() => {
    logoutRef.current = auth.logout;
    isLoggedInRef.current = auth.isLoggedIn;
  }, [auth.logout, auth.isLoggedIn]);

  useEffect(() => subscribeHotkeyRecording(setHotkeyRecording), []);

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
    try {
      if (!(await detectTauriEnvironment())) {
        return;
      }
      const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
      const win = await WebviewWindow.getByLabel("main");
      if (!win) {
        return;
      }
      return win;
    } catch (error) {
      logger.warn("[GlobalShortcuts] Failed to resolve main window:", error);
      return;
    }
  };

  const toggleMainWindow = async () => {
    const appWindow = await windowInstance();
    if (!appWindow) {
      return;
    }
    const stateIsVisible = await appWindow.isVisible();
    const stateIsFocused = await appWindow.isFocused();

    if (stateIsVisible && stateIsFocused) {
      logoutRef.current();
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("close_main_window", { behavior: "hide" });
      } catch (error) {
        logger.warn("[GlobalShortcuts] Native close command failed:", error);
        await appWindow.hide();
      }
    } else {
      await appWindow.show();
      await appWindow.unminimize();
      await appWindow.setFocus();
    }
  };

  const lockVault = () => {
    logoutRef.current();
  };

  const openNewEntry = async () => {
    const appWindow = await windowInstance();
    if (appWindow) {
      await appWindow.show();
      await appWindow.unminimize();
      await appWindow.setFocus();
    }

    if (isLoggedInRef.current) {
      emitOpenAddValueRequest();
    }
  };

  const runHotkeyAction = async (action: HotkeyAction) => {
    if (action === "toggleMainWindow") {
      await toggleMainWindow();
    } else if (action === "lockVault") {
      lockVault();
    } else if (action === "newEntry") {
      await openNewEntry();
    }
  };

  useEffect(() => {
    const lastTriggered = new Map<HotkeyAction, number>();
    let active = true;
    const registeredHotkeys = Object.values(hotkeys).filter(
      (hotkey): hotkey is string => typeof hotkey === "string" && hotkey.length > 0,
    );

    const registerShortcut = async () => {
      try {
        if (
          !(await detectTauriEnvironment()) ||
          !active ||
          hotkeyRecording
        ) {
          return;
        }

        const { register, unregister } = await import(
          "@tauri-apps/plugin-global-shortcut"
        );
        if (!active) return;

        for (const hotkey of registeredHotkeys) {
          try {
            await unregister(hotkey);
          } catch {
            // It is fine if the shortcut was not registered before.
          }
        }

        const entries = Object.entries(hotkeys) as Array<
          [HotkeyAction, string | null]
        >;

        for (const [action, hotkey] of entries) {
          if (!hotkey) continue;

          await register(hotkey, async () => {
            try {
              const now = Date.now();
              const previous = lastTriggered.get(action) ?? 0;
              if (now - previous < 500) {
                return;
              }
              lastTriggered.set(action, now);
              await runHotkeyAction(action);
            } catch (error) {
              logger.warn(
                `[GlobalShortcuts] ${action} handler failed:`,
                error,
              );
            }
          });
        }
      } catch (error) {
        logger.warn("[GlobalShortcuts] Failed to register hotkeys:", error);
      }
    };

    void registerShortcut();
    return () => {
      active = false;
      void (async () => {
        if (!(await detectTauriEnvironment())) {
          return;
        }
        try {
          const { unregister } = await import(
            "@tauri-apps/plugin-global-shortcut"
          );
          for (const hotkey of registeredHotkeys) {
            await unregister(hotkey);
          }
        } catch (error) {
          logger.warn("[GlobalShortcuts] Failed to unregister hotkeys:", error);
        }
      })();
    };
  }, [hotkeyRecording, hotkeys]);

  return null;
}

export default GlobalShortcuts;
