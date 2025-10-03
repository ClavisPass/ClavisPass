import React from "react";
import { TouchableRipple } from "react-native-paper";
import { StyleProp, ViewStyle, GestureResponderEvent } from "react-native";

type ButtonWrapperProps = {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export const AnimatedPressable: React.FC<ButtonWrapperProps> = ({
  children,
  onPress,
  style,
  onPressIn,
  onPressOut,
  disabled,
}) => {
  return (
    <TouchableRipple
      rippleColor="rgba(0, 0, 0, .32)"
      style={style}
      borderless
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      {children}
    </TouchableRipple>
  );
};

export default AnimatedPressable;
