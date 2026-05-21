import React from "react";

const AnimatedView = React.forwardRef<any, any>(({ children, ...props }, ref) =>
  React.createElement("AnimatedView", { ...props, ref }, children),
);

const Animated = {
  View: AnimatedView,
};

export const FadeInDown = {
  delay() {
    return this;
  },
  duration() {
    return this;
  },
};

export const Easing = {
  out: (value: any) => value,
  exp: "exp",
};

export function useSharedValue<T>(value: T) {
  return { value };
}

export function useAnimatedStyle(callback: () => any) {
  return callback();
}

export function withTiming(value: any) {
  return value;
}

export default Animated;
