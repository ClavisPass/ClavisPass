import { StyleSheet } from "react-native";
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
    backgroundColor: theme.dark ? theme.colors.background : "#F7F9FF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.dark
      ? theme.colors.outlineVariant
      : "rgba(76, 95, 142, 0.13)",
    borderRadius: 8,
    overflow: "hidden",
  };
}

export function getItemSurfaceStyle(theme: AppTheme): ViewStyle {
  const shadowColor = theme.dark ? "#000000" : "#20263A";

  return {
    backgroundColor: theme.dark
      ? "rgba(255, 255, 255, 0.075)"
      : "#FFFFFF",
    borderColor: theme.dark
      ? "rgba(255, 255, 255, 0.075)"
      : "rgba(54, 72, 116, 0.06)",
    shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.dark ? 0.16 : 0.055,
    shadowRadius: 5,
    elevation: 1,
    boxShadow: theme.dark
      ? ("rgba(0, 0, 0, 0.15) 0px 7px 18px -9px, rgba(0, 0, 0, 0.10) 0px 1px 5px -3px" as any)
      : ("rgba(37, 55, 96, 0.055) 0px 7px 18px -12px, rgba(37, 55, 96, 0.04) 0px 1px 5px -4px" as any),
  };
}
