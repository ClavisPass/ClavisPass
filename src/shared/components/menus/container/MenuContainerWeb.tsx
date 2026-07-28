import React, { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
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
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const opensUpward = offsetY < 0;
  const viewportPadding = 8;
  const [menuSize, setMenuSize] = useState({ width: width ?? 180, height: 0 });
  const resolvedWidth = width ?? menuSize.width;
  const resolvedLeft = useMemo(() => {
    if (typeof positionX !== "number") return undefined;

    return Math.min(
      Math.max(viewportPadding, positionX),
      Math.max(viewportPadding, windowWidth - resolvedWidth - viewportPadding),
    );
  }, [positionX, resolvedWidth, windowWidth]);
  const resolvedTop = useMemo(() => {
    const desiredTop = positionY + offsetY;
    if (menuSize.height <= 0) return Math.max(viewportPadding, desiredTop);

    return Math.min(
      Math.max(viewportPadding, desiredTop),
      Math.max(viewportPadding, windowHeight - menuSize.height - viewportPadding),
    );
  }, [menuSize.height, offsetY, positionY, windowHeight]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height, width: measuredWidth } = event.nativeEvent.layout;
    setMenuSize((current) => {
      if (
        Math.abs(current.width - measuredWidth) < 1 &&
        Math.abs(current.height - height) < 1
      ) {
        return current;
      }
      return { width: measuredWidth, height };
    });
  };

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
            top: resolvedTop,
            ...(typeof positionX === "number"
              ? { left: resolvedLeft }
              : { right: 4 }),
            zIndex: 1,
          },
          menuStyle,
        ]}
        pointerEvents="box-none"
      >
        <View
          onLayout={handleLayout}
          style={{
            overflow: "hidden",
            backgroundColor: theme.colors?.elevation?.level3 ?? "white",
            borderRadius: 20,
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
