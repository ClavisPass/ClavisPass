import React, { ReactNode, useEffect, useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useTheme } from "../../../contexts/ThemeProvider";

type Props = {
  children: ReactNode;
  visible: boolean;
  onDismiss: () => void;
  /** Y-Position relativ zum Fenster/Parent (wo der Container absolut positioniert ist) */
  positionY: number;
  /** Optional: X-Position; wenn nicht gesetzt, wird right: 4 verwendet */
  positionX?: number;
  /** Optional: Menübreite */
  width?: number;
  /** Abstand unter dem Button */
  offsetY?: number;
};

function MenuContainerWeb({
  children,
  visible,
  onDismiss,
  positionY,
  positionX,
  width,
  offsetY = 6,
}: Props) {
  const { theme } = useTheme();

  // Ein progress steuert alles → smooth & synchron
  const progress = useSharedValue(0);

  // Für Exit-Animation auch bei visible=false noch rendern
  const [mounted, setMounted] = useState(visible);
  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, {
        duration: 180,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      });
    } else {
      progress.value = withTiming(
        0,
        { duration: 140, easing: Easing.bezier(0.2, 0.8, 0.2, 1) },
        (finished) => {
          if (finished) runOnJS(setMounted)(false);
        }
      );
    }
  }, [visible]);

  const menuStyle = useAnimatedStyle(() => {
    // sanftes Grow & Drop
    const scale = interpolate(
      progress.value,
      [0, 1],
      [0.92, 1],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [-8, 0],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      progress.value,
      [0, 1],
      [0.9, 1],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });

  if (!mounted) return null;

  return (
    <>
      <View style={StyleSheet.absoluteFill} pointerEvents="auto">
        <Pressable style={{ flex: 1 }} onPress={onDismiss} />
      </View>

      <Animated.View
        style={[
          {
            position: "absolute",
            top: positionY + offsetY,
            ...(typeof positionX === "number"
              ? { left: positionX }
              : { right: 4 }),
            zIndex: 1,
          },
          menuStyle,
        ]}
        pointerEvents="box-none"
      >
        <View
          style={{
            overflow: "hidden",
            backgroundColor: theme.colors?.elevation?.level3 ?? "white",
            borderTopLeftRadius: 22,
            borderTopRightRadius: 6,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            minWidth: 180,
            ...(width ? { width } : null),
            boxShadow: theme.colors?.shadow ?? "0px 6px 18px rgba(0,0,0,0.15)",
            elevation: 6,
            display: "flex",
            flexDirection: "column",
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.outlineVariant,
          }}
        >
          {children}
        </View>
      </Animated.View>
    </>
  );
}

export default MenuContainerWeb;
