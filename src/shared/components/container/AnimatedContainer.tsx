import React, { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "../../../app/providers/ThemeProvider";
import AmbientBackground from "../AmbientBackground";
import { useIsTauriEnvironment } from "../../../infrastructure/platform/isTauri";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function AnimatedContainer({ children, style }: Props) {
  const { theme } = useTheme();
  const isTauri = useIsTauriEnvironment();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: isTauri
            ? "transparent"
            : theme.colors?.elevation.level2,
        },
        style,
      ]}
    >
      <AmbientBackground />
      {children}
    </View>
  );
}
