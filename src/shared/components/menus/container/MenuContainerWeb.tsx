import React, { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { createPortal } from "react-dom";
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
import type { MenuAnchorRect } from "../Menu";

type Props = {
  children: ReactNode;
  visible: boolean;
  onDismiss: () => void;
  /** Y-Position relativ zum Fenster/Parent (wo der Container absolut positioniert ist) */
  positionY: number;
  /** Optional: X-Position; wenn nicht gesetzt, wird right: 4 verwendet */
  positionX?: number;
  anchorRect?: MenuAnchorRect | null;
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
  anchorRect,
  width,
  offsetY = 6,
}: Props) {
  const { theme } = useTheme();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const opensUpward = offsetY < 0;
  const viewportPadding = 8;
  const portalContainer =
    typeof document !== "undefined"
      ? (document.getElementById("dropdown-layer") ?? document.body)
      : null;
  const [menuSize, setMenuSize] = useState({ width: width ?? 180, height: 0 });
  const resolvedWidth = width ?? menuSize.width;
  const resolvedLeft = useMemo(() => {
    const anchorX = anchorRect?.x ?? positionX;
    if (typeof anchorX !== "number") return undefined;

    const desiredLeft = Math.max(viewportPadding, anchorX);
    const maxLeft = windowWidth - resolvedWidth - viewportPadding;
    if (desiredLeft + resolvedWidth <= windowWidth - viewportPadding) {
      return desiredLeft;
    }

    return Math.max(viewportPadding, maxLeft);
  }, [anchorRect?.x, positionX, resolvedWidth, windowWidth]);
  const resolvedTop = useMemo(() => {
    const anchorBottom =
      anchorRect && typeof anchorRect.y === "number"
        ? anchorRect.y + anchorRect.height
        : positionY;
    const desiredTop = anchorBottom + offsetY;
    if (menuSize.height <= 0) return Math.max(viewportPadding, desiredTop);

    return Math.min(
      Math.max(viewportPadding, desiredTop),
      Math.max(
        viewportPadding,
        windowHeight - menuSize.height - viewportPadding,
      ),
    );
  }, [anchorRect, menuSize.height, offsetY, positionY, windowHeight]);

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
        },
      );
    }
  }, [visible]);

  const menuStyle = useAnimatedStyle(() => {
    const hiddenTranslateY = opensUpward ? 8 : -8;
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [hiddenTranslateY, 0],
      Extrapolate.CLAMP,
    );
    const opacity = interpolate(
      progress.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  if (!mounted || !portalContainer) return null;

  return createPortal(
    <>
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
            backgroundColor: theme.colors.background,
            borderRadius: 12,
            minWidth: 180,
            maxWidth: Math.min(340, windowWidth - viewportPadding * 2),
            maxHeight: Math.max(120, windowHeight - viewportPadding * 2),
            ...(width ? { width } : null),
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            elevation: 6,
            display: "flex",
            flexDirection: "column",
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.outlineVariant,
          }}
        >
          <View style={{ maxHeight: "100%" as any, overflow: "auto" as any }}>
            {children}
          </View>
        </View>
      </Animated.View>
    </>,
    portalContainer,
  );
}

export default MenuContainerWeb;
