import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useTheme } from "../../app/providers/ThemeProvider";

type Props = {
  hintLine: string;
};

export default function HintCard(props: Props) {
  const { theme, darkmode } = useTheme();

  return (
    <View
      style={{
        borderRadius: 12,
        overflow: "hidden" as const,
        backgroundColor: theme.colors.background,
        boxShadow: theme.colors.shadow as any,
        borderColor: darkmode ? theme.colors.outlineVariant : "white",
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "stretch",
        paddingVertical: 8,
        paddingHorizontal: 8,
        gap: 8,
      }}
    >
      <View
        style={{
          alignSelf: "stretch",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 2,
        }}
      >
        <Icon color={theme.colors.primary} source="information-outline" size={20} />
      </View>
      <View
        style={{
          alignSelf: "stretch",
          width: 1,
          backgroundColor: theme.colors.outlineVariant,
          opacity: darkmode ? 0.9 : 0.35,
        }}
      />

      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text
            variant="labelSmall"
          style={{
            opacity: 0.8,
            userSelect: "none" as any,
            flexShrink: 1,
          }}
        >
          {props.hintLine}
        </Text>
      </View>
    </View>
  );
}
