import React from "react";
import { TouchableRipple } from "react-native-paper";
import type { ComponentProps } from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useTheme } from "../../app/providers/ThemeProvider";

type TouchableRippleProps = ComponentProps<typeof TouchableRipple>;
const DEFAULT_HOVER_BACKGROUND_COLOR_LIGHT = "rgba(17, 24, 39, 0.06)";
const DEFAULT_HOVER_BACKGROUND_COLOR_DARK = "rgba(255, 255, 255, 0.08)";
const DEFAULT_RIPPLE_COLOR_LIGHT = "rgba(17, 24, 39, 0.12)";
const DEFAULT_RIPPLE_COLOR_DARK = "rgba(255, 255, 255, 0.16)";

export type AnimatedPressableProps = Omit<
  TouchableRippleProps,
  "style" | "children"
> & {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  hoverBackgroundColor?: string | null;
};

const AnimatedPressable = React.forwardRef<any, AnimatedPressableProps>(
  (
    {
      children,
      style,
      rippleColor,
      borderless = true,
      hoverBackgroundColor,
      onHoverIn,
      onHoverOut,
      ...rest
    },
    ref
  ) => {
    const { darkmode } = useTheme();
    const [hovered, setHovered] = React.useState(false);
    const effectiveHoverBackgroundColor =
      hoverBackgroundColor === undefined
        ? darkmode
          ? DEFAULT_HOVER_BACKGROUND_COLOR_DARK
          : DEFAULT_HOVER_BACKGROUND_COLOR_LIGHT
        : hoverBackgroundColor;
    const effectiveRippleColor =
      rippleColor ??
      (darkmode ? DEFAULT_RIPPLE_COLOR_DARK : DEFAULT_RIPPLE_COLOR_LIGHT);

    return (
      <TouchableRipple
        ref={ref}
        style={[
          style,
          hovered && effectiveHoverBackgroundColor
            ? { backgroundColor: effectiveHoverBackgroundColor }
            : undefined,
        ]}
        rippleColor={effectiveRippleColor}
        borderless={borderless}
        onHoverIn={(event) => {
          setHovered(true);
          onHoverIn?.(event);
        }}
        onHoverOut={(event) => {
          setHovered(false);
          onHoverOut?.(event);
        }}
        {...rest}
      >
        {React.isValidElement(children) && React.Children.count(children) === 1 ? (
          children
        ) : (
          <View>{children}</View>
        )}
      </TouchableRipple>
    );
  }
);

AnimatedPressable.displayName = "AnimatedPressable";

export default AnimatedPressable;
