import React from "react";
import { TouchableRipple } from "react-native-paper";
import type { ComponentProps } from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

type TouchableRippleProps = ComponentProps<typeof TouchableRipple>;
const DEFAULT_HOVER_BACKGROUND_COLOR = "rgba(120, 127, 246, 0.12)";
const DEFAULT_RIPPLE_COLOR = "rgba(120, 127, 246, 0.22)";

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
      rippleColor = DEFAULT_RIPPLE_COLOR,
      borderless = true,
      hoverBackgroundColor = DEFAULT_HOVER_BACKGROUND_COLOR,
      onHoverIn,
      onHoverOut,
      ...rest
    },
    ref
  ) => {
    const [hovered, setHovered] = React.useState(false);

    return (
      <TouchableRipple
        ref={ref}
        style={[
          style,
          hovered && hoverBackgroundColor
            ? { backgroundColor: hoverBackgroundColor }
            : undefined,
        ]}
        rippleColor={rippleColor}
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
