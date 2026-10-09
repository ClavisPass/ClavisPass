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
    backgroundColor: theme.colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.dark
      ? theme.colors.outlineVariant
      : "rgba(22, 28, 45, 0.18)",
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
      : "rgba(22, 28, 45, 0.075)",
    shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: theme.dark ? 0.18 : 0.09,
    shadowRadius: 7,
    elevation: 2,
    boxShadow: theme.dark
      ? ("rgba(0, 0, 0, 0.17) 0px 8px 20px -8px, rgba(0, 0, 0, 0.12) 0px 1px 6px -3px" as any)
      : ("rgba(32, 38, 58, 0.085) 0px 8px 20px -10px, rgba(32, 38, 58, 0.055) 0px 1px 6px -4px" as any),
  };
}
