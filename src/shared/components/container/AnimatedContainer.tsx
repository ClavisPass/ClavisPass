import React, { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "../../../app/providers/ThemeProvider";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function AnimatedContainer({ children, style }: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        { flex: 1, backgroundColor: theme.colors?.elevation.level2 },
        style,
      ]}
    >
      {children}
    </View>
  );
}
