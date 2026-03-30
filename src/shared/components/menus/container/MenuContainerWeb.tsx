import React, { ReactNode, useEffect, useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Portal } from "react-native-paper";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useTheme } from "../../../../app/providers/ThemeProvider";

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
  const opensUpward = offsetY < 0;

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
    const hiddenTranslateY = opensUpward ? 8 : -8;
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [hiddenTranslateY, 0],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      progress.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  if (!mounted) return null;

  return (
    <Portal>
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
            borderTopLeftRadius: opensUpward ? 20 : 22,
            borderTopRightRadius: opensUpward ? 20 : 6,
            borderBottomLeftRadius: opensUpward ? 22 : 20,
            borderBottomRightRadius: opensUpward ? 6 : 20,
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
    </Portal>
  );
}

export default MenuContainerWeb;
