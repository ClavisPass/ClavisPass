import React from "react";
import { TouchableRipple } from "react-native-paper";
import type { ComponentProps } from "react";
import type { StyleProp, ViewStyle } from "react-native";

type TouchableRippleProps = ComponentProps<typeof TouchableRipple>;

export type AnimatedPressableProps = Omit<
  TouchableRippleProps,
  "style" | "children"
> & {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const AnimatedPressable = React.forwardRef<any, AnimatedPressableProps>(
  (
    {
      children,
      style,
      rippleColor = "rgba(0, 0, 0, .32)",
      borderless = true,
      ...rest
    },
    ref
  ) => {
    return (
      <TouchableRipple
        ref={ref}
        style={style}
        rippleColor={rippleColor}
        borderless={borderless}
        {...rest}
      >
        {children}
      </TouchableRipple>
    );
  }
);

AnimatedPressable.displayName = "AnimatedPressable";

export default AnimatedPressable;
