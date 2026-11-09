import { useEffect, useId, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AccessibilityInfo, AppState, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Text } from "react-native-paper";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

import { useTheme } from "../../../app/providers/ThemeProvider";
import Logo from "../../../shared/ui/Logo";

type Props = {
  compact?: boolean;
  active: boolean;
  caption?: string;
};

export default function AnimatedLoginVisual({
  compact = false,
  active,
  caption,
}: Props) {
  const { darkmode, theme } = useTheme();
  const glowId = `login-glow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const initialReducedMotion = useReducedMotion();
  const [reducedMotion, setReducedMotion] = useState(initialReducedMotion);
  const [appActive, setAppActive] = useState(
    AppState.currentState !== "background" &&
      AppState.currentState !== "inactive",
  );
  const [panelSize, setPanelSize] = useState(0);
  const entry = useSharedValue(initialReducedMotion ? 1 : 0);
  const float = useSharedValue(0);
  const shouldAnimate = active && appActive && !reducedMotion;
  const logoSize = compact ? 48 : Math.round(panelSize * 0.43);
  const travel = compact ? 3 : 6;

  useEffect(() => {
    let subscribed = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (subscribed) setReducedMotion(enabled);
      })
      .catch(() => {});
    const motion = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReducedMotion,
    );
    const lifecycle = AppState.addEventListener("change", (state) =>
      setAppActive(state === "active"),
    );
    return () => {
      subscribed = false;
      motion?.remove();
      lifecycle.remove();
    };
  }, []);

  useEffect(() => {
    if (shouldAnimate) {
      entry.value = withTiming(1, {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      });
      float.value = withRepeat(
        withTiming(1, { duration: 2250, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
    } else {
      entry.value = 1;
      float.value = 0;
    }

    return () => {
      cancelAnimation(entry);
      cancelAnimation(float);
    };
  }, [entry, float, shouldAnimate]);

  const brandStyle = useAnimatedStyle(() => ({
    opacity: entry.value,
    transform: [
      { translateY: -travel * float.value },
      { scale: 0.94 + 0.06 * entry.value },
    ],
  }));

  return (
    <View
      accessible={false}
      accessibilityElementsHidden={!caption}
      importantForAccessibility={caption ? "no" : "no-hide-descendants"}
      aria-hidden={!caption}
      pointerEvents="none"
      style={
        compact
          ? styles.compact
          : [
              styles.panel,
              {
                borderRightColor: theme.colors.outlineVariant,
              },
            ]
      }
      onLayout={
        compact
          ? undefined
          : ({ nativeEvent: { layout } }) => {
              setPanelSize(
                Math.max(
                  0,
                  Math.min(
                    440,
                    Math.floor(Math.min(layout.width, layout.height) - 32),
                  ),
                ),
              );
            }
      }
    >
      {!compact ? (
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={
            darkmode
              ? ["#131A28", "#242B44", "#1C2033"]
              : ["#F3F7FD", "#E5ECFB", "#EAE7F8"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      ) : null}
      {!compact && panelSize > 0 ? (
        <View style={styles.glow}>
          <Svg width={panelSize} height={panelSize} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id={glowId}>
                <Stop
                  offset="0%"
                  stopColor={darkmode ? "#8F9EF5" : "#A9C4F6"}
                  stopOpacity={darkmode ? 0.26 : 0.44}
                />
                <Stop
                  offset="100%"
                  stopColor={darkmode ? "#9B86F8" : "#A292EA"}
                  stopOpacity={0}
                />
              </RadialGradient>
            </Defs>
            <Circle cx={50} cy={50} r={50} fill={`url(#${glowId})`} />
          </Svg>
        </View>
      ) : null}
      {compact || logoSize > 0 ? (
        <Animated.View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          aria-hidden
          style={brandStyle}
        >
          <Logo width={logoSize} height={logoSize} />
        </Animated.View>
      ) : null}
      {caption ? (
        <Text
          variant="bodyMedium"
          style={[styles.caption, { color: theme.colors.onSurface }]}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flexGrow: 40,
    flexBasis: 0,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  compact: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 72,
    height: 72,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  caption: {
    maxWidth: 340,
    paddingHorizontal: 24,
    marginTop: 16,
    textAlign: "center",
  },
});
