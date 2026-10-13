import { Platform, StyleSheet } from "react-native";
import type { ViewStyle } from "react-native";
import type { AppTheme } from "./appTheme";

export const SCROLLBAR_CONTENT_GAP = 8;

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
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 0,
    paddingBottom: 0,
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
    backgroundColor: theme.dark ? "#2B2B2B" : "#FFFFFF",
    borderColor: theme.dark
      ? "#2B2B2B"
      : "#F1F1F1",
    shadowColor,
    shadowOffset: { width: 0, height: theme.dark ? 2 : 3 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    boxShadow: theme.dark
      ? ("rgba(0, 0, 0, 0.15) 0px 7px 18px -9px, rgba(0, 0, 0, 0.10) 0px 1px 5px -3px" as any)
      : ("rgba(48, 48, 48, 0.055) 0px 10px 24px -17px, rgba(48, 48, 48, 0.04) 0px 2px 7px -6px" as any),
  };
}
