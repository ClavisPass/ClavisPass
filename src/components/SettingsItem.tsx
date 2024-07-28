import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";
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

function SettingsItem(props: Props) {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: theme.colors?.background}]}>
      <Text variant="titleMedium">{props.title}</Text>
      <Divider />
      {props.children}
    </View>
  );
}

export default SettingsItem;
