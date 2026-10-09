import React, { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function AnimatedContainer({ children, style }: Props) {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: "transparent",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
