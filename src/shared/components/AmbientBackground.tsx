import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../../app/providers/ThemeProvider";

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
  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;

  if (Platform.OS !== "web") {
    return (
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            overflow: "hidden",
            backgroundColor: darkmode ? theme.colors.background : "#F7FAFF",
          },
        ]}
      >
        <AmbientWash
          style={styles.mobileBlueTop}
          backgroundColor={withAlpha(secondary, darkmode ? 0.04 : 0.075)}
        />
        <AmbientWash
          style={styles.mobileBlueBottom}
          backgroundColor={withAlpha(secondary, darkmode ? 0.025 : 0.045)}
        />
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
          backgroundColor: darkmode ? theme.colors.background : "#F7FAFF",
        },
      ]}
    >
      <AmbientWash
        style={styles.topRight}
        backgroundColor={withAlpha(
          primary,
          darkmode ? 0.05 : 0.055,
        )}
      />
      <AmbientWash
        style={styles.left}
        backgroundColor={withAlpha(
          secondary,
          darkmode ? 0.045 : 0.07,
        )}
      />
      <AmbientWash
        style={styles.bottom}
        backgroundColor={withAlpha(
          primary,
          darkmode ? 0.03 : 0.032,
        )}
      />
      <AmbientWash
        style={styles.lowerLeft}
        backgroundColor={withAlpha(
          secondary,
          darkmode ? 0.028 : 0.038,
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
    width: "120%",
    height: "48%",
    top: -190,
    left: -150,
    borderBottomRightRadius: 520,
  },
  mobileBlueBottom: {
    width: "110%",
    height: "36%",
    right: -170,
    bottom: -190,
    borderTopLeftRadius: 520,
  },
});

export default AmbientBackground;
