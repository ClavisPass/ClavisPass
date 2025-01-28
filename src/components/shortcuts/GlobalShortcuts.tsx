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
      document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.key === "f") {
          event.preventDefault();
        }
        if (event.ctrlKey && event.key === "p") {
          event.preventDefault();
        }
        if (event.ctrlKey && event.key === "u") {
          event.preventDefault();
        }
        if (event.key === "F3") {
          event.preventDefault();
        }
        if (event.ctrlKey && event.key === "p") {
          event.preventDefault();
        }
        if (event.ctrlKey && event.key === "Add") {
          event.preventDefault();
        }
        if (event.ctrlKey && event.key === "Subtract") {
          event.preventDefault();
        }
      });
      registerShortcuts();
    }
  });

  return <></>;
}

export default GlobalShortcuts;
