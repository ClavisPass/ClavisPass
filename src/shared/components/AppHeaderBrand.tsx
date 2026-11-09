import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../app/providers/ThemeProvider";
import Logo from "../ui/Logo";

export default function AppHeaderBrand({ compact }: { compact: boolean }) {
  const { theme } = useTheme();
  const iconSize = compact ? 18 : 20;

  return (
    <View
      pointerEvents="none"
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingLeft: compact ? 8 : 0,
      }}
    >
      <Logo width={iconSize} height={iconSize} />
      <Text
        style={{
          fontFamily: "LexendExa_400Regular",
          fontSize: compact ? 15 : 16,
          lineHeight: 16,
          color: theme.colors.onSurfaceVariant,
          userSelect: "none",
          includeFontPadding: false,
          paddingRight: 8,
        }}
        numberOfLines={1}
      >
        ClavisPass
      </Text>
    </View>
  );
}
