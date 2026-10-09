import { Platform, StyleSheet } from "react-native";
import type { ViewStyle } from "react-native";
import type { AppTheme } from "./appTheme";

export function getGlassChromeStyle(_darkmode: boolean): ViewStyle {
  return {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    boxShadow: "none" as any,
  };
}

export function getScreenContentStyle(theme: AppTheme): ViewStyle {
  return {
    backgroundColor: theme.dark
      ? theme.colors.background
      : "rgba(248, 248, 248, 0.78)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.dark
      ? theme.colors.outlineVariant
      : "rgba(118, 118, 118, 0.13)",
    borderRadius: 8,
    overflow: "hidden",
    ...(Platform.OS === "web" && !theme.dark
      ? ({
          backdropFilter: "blur(18px) saturate(1.08)",
          WebkitBackdropFilter: "blur(18px) saturate(1.08)",
        } as any)
      : null),
  };
}

export function getItemSurfaceStyle(theme: AppTheme): ViewStyle {
  const shadowColor = theme.dark ? "#000000" : "#20263A";

  return {
    backgroundColor: theme.dark
      ? "rgba(255, 255, 255, 0.075)"
      : "rgba(255, 255, 255, 0.98)",
    borderColor: theme.dark
      ? "rgba(255, 255, 255, 0.075)"
      : "rgba(118, 118, 118, 0.1)",
    shadowColor,
    shadowOffset: { width: 0, height: theme.dark ? 2 : 3 },
    shadowOpacity: theme.dark ? 0.16 : 0.055,
    shadowRadius: theme.dark ? 5 : 7,
    elevation: 1,
    boxShadow: theme.dark
      ? ("rgba(0, 0, 0, 0.15) 0px 7px 18px -9px, rgba(0, 0, 0, 0.10) 0px 1px 5px -3px" as any)
      : ("rgba(48, 48, 48, 0.055) 0px 10px 24px -17px, rgba(48, 48, 48, 0.04) 0px 2px 7px -6px" as any),
  };
}
