import React from "react";
import {
  Platform,
  StyleSheet,
  View,
} from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useTheme } from "../../app/providers/ThemeProvider";
import { useIsTauriEnvironment } from "../../infrastructure/platform/isTauri";

function withAlpha(color: string, alpha: number) {
  const hex = color.trim().replace("#", "");

  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
}

type Props = {
  intensity?: "soft" | "medium";
};

function AmbientWash({
  backgroundColor,
  style,
}: {
  backgroundColor: string;
  style: StyleProp<ViewStyle>;
}) {
  if (Platform.OS === "web") {
    return (
      <View style={[styles.wash, styles.webBlur, style, { backgroundColor }]} />
    );
  }

  return (
    <>
      <View
        style={[
          styles.wash,
          style,
          { backgroundColor, opacity: 0.16, transform: [{ scale: 1.85 }] },
        ]}
      />
      <View
        style={[
          styles.wash,
          style,
          { backgroundColor, opacity: 0.24, transform: [{ scale: 1.48 }] },
        ]}
      />
      <View
        style={[
          styles.wash,
          style,
          { backgroundColor, opacity: 0.34, transform: [{ scale: 1.2 }] },
        ]}
      />
      <View
        style={[
          styles.wash,
          style,
          { backgroundColor, opacity: 0.42, transform: [{ scale: 1 }] },
        ]}
      />
    </>
  );
}

function AmbientBackground({}: Props) {
  const { darkmode, theme } = useTheme();
  const isTauri = useIsTauriEnvironment();
  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;
  const appBackground = isTauri
    ? withAlpha(darkmode ? theme.colors.background : "#FFFFFF", darkmode ? 0.24 : 0.34)
    : darkmode
      ? theme.colors.background
      : "#F7F7F7";
  const mobileBackground = darkmode ? theme.colors.background : "#F6F6F6";

  if (Platform.OS !== "web") {
    return (
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            overflow: "hidden",
            backgroundColor: mobileBackground,
          },
        ]}
      >
        {darkmode ? (
          <>
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "rgba(255, 255, 255, 0.02)" },
              ]}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: withAlpha(primary, 0.035) },
              ]}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: withAlpha(secondary, 0.025) },
              ]}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "rgba(12, 12, 16, 0.18)" },
              ]}
            />
          </>
        ) : null}
      </View>
    );
  }

  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          overflow: "hidden",
          backgroundColor: appBackground,
        },
      ]}
    >
      <AmbientWash
        style={styles.topRight}
        backgroundColor={withAlpha(
          primary,
          darkmode ? 0.05 : 0.01,
        )}
      />
      <AmbientWash
        style={styles.left}
        backgroundColor={withAlpha(
          secondary,
          darkmode ? 0.045 : 0.012,
        )}
      />
      <AmbientWash
        style={styles.bottom}
        backgroundColor={withAlpha(
          primary,
          darkmode ? 0.03 : 0.008,
        )}
      />
      <AmbientWash
        style={styles.lowerLeft}
        backgroundColor={withAlpha(
          secondary,
          darkmode ? 0.028 : 0.01,
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wash: {
    position: "absolute",
  },
  webBlur: {
    ...(Platform.OS === "web"
      ? ({
          filter: "blur(128px)",
          transform: "translateZ(0)",
          willChange: "transform",
        } as any)
      : null),
  },
  topRight: {
    width: "74%",
    height: "34%",
    top: -140,
    right: -170,
    borderBottomLeftRadius: 420,
  },
  left: {
    width: "52%",
    height: "46%",
    top: "5%",
    left: -210,
    borderTopRightRadius: 420,
    borderBottomRightRadius: 420,
  },
  bottom: {
    width: "82%",
    height: "24%",
    bottom: -150,
    left: "20%",
    borderTopLeftRadius: 460,
    borderTopRightRadius: 460,
  },
  lowerLeft: {
    width: "58%",
    height: "24%",
    bottom: -130,
    left: -170,
    borderTopRightRadius: 380,
  },
  mobileBlueTop: {
    width: "124%",
    height: "50%",
    top: -210,
    left: -160,
    borderBottomRightRadius: 520,
  },
  mobilePinkLeft: {
    width: "78%",
    height: "72%",
    top: "10%",
    left: -190,
    borderTopRightRadius: 520,
    borderBottomRightRadius: 520,
  },
  mobileVioletRight: {
    width: "72%",
    height: "58%",
    top: "2%",
    right: -190,
    borderTopLeftRadius: 520,
    borderBottomLeftRadius: 520,
  },
  mobileBlueBottom: {
    width: "118%",
    height: "40%",
    right: -190,
    bottom: -210,
    borderTopLeftRadius: 520,
  },
});

export default AmbientBackground;
