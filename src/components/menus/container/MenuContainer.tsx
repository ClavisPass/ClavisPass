// MenuContainer.tsx
import React, { ReactNode, useEffect, useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Portal } from "react-native-paper";
import Animated, {
  Easing as ReEasing,
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
  /** Y-Position in Fenstereinhalt-Koordinaten (z.B. via measureInWindow gemessen) */
  positionY: number;
  /** Optional: linke Kante; wenn undefined, wird right: 4 genutzt */
  positionX?: number;
  /** Optional: Breite */
  width?: number;
  /** Optional: Distanz unter dem Button */
  offsetY?: number;
};

export default function MenuContainer({
  children,
  visible,
  onDismiss,
  positionY,
  positionX,
  width,
  offsetY = 6,
}: Props) {
  const { theme } = useTheme();
  const progress = useSharedValue(0);
  const [mounted, setMounted] = useState(visible);
  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, {
        duration: 180,
        easing: ReEasing.bezier(0.2, 0.8, 0.2, 1),
      });
    } else {
      progress.value = withTiming(
        0,
        { duration: 160, easing: ReEasing.bezier(0.2, 0.8, 0.2, 1) },
        (finished) => {
          if (finished) runOnJS(setMounted)(false);
        }
      );
    }
  }, [visible]);

  const menuAnimStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.92, 1], Extrapolate.CLAMP);
    const translateY = interpolate(progress.value, [0, 1], [-8, 0], Extrapolate.CLAMP);
    return {
      transform: [{ scale }, { translateY }],
      opacity: interpolate(progress.value, [0, 1], [0.9, 1]),
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
            ...(typeof positionX === "number" ? { left: positionX } : { right: 4 }),
          },
          menuAnimStyle,
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
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          {children}
        </View>
      </Animated.View>
    </Portal>
  );
}
