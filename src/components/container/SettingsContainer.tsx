import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";
import { useTheme } from "../../contexts/ThemeProvider";
import SettingsDivider from "../SettingsDivider";

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

type Props = { children: ReactNode; title: string; icon?: string };

export function SubItem(props: Props) {
  const { theme } = useTheme();
  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
        }}
      >
        {props.icon && (
          <Icon color={theme.colors?.primary} source={props.icon} size={16} />
        )}
        <Text
          style={{ color: theme.colors?.primary, userSelect: "none" }}
          variant="titleMedium"
        >
          {props.title}
        </Text>
      </View>
      <Divider style={{ marginBottom: 0 }} />
      {props.children}
    </>
  );
}

function SettingsContainer(props: Props) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors?.background,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: theme.colors?.shadow,
        },
      ]}
    >
      <SubItem icon={props.icon} title={props.title}>
        {props.children}
      </SubItem>
    </View>
  );
}

export default SettingsContainer;
