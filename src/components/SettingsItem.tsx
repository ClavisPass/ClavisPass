import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Divider, Text } from "react-native-paper";
import { useTheme } from "../contexts/ThemeProvider";

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
    padding: 16,
  },
});

type Props = { children: ReactNode; title: string };

export function SubItem(props: Props) {
  const { theme } = useTheme();
  return (
    <>
      <Text style={{ color: theme.colors?.tertiary }} variant="titleMedium">
        {props.title}
      </Text>
      <Divider style={{ marginBottom: 6 }} />
      {props.children}
    </>
  );
}

function SettingsItem(props: Props) {
  const { theme } = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors?.background }]}
    >
      <SubItem title={props.title}>{props.children}</SubItem>
    </View>
  );
}

export default SettingsItem;
