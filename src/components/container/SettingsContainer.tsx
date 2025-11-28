import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";
import { useTheme } from "../../contexts/ThemeProvider";

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
    //padding: 16,
  },
});

type Props = {
  children: ReactNode;
  title: string;
  icon?: string;
  ref?: React.RefObject<View | null>;
};

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
          padding: 8,
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        {props.icon && (
          <Icon color={theme.colors?.primary} source={props.icon} size={16} />
        )}
        <Text>{props.title}</Text>
      </View>
      <Divider style={{ marginBottom: 0 }} />
      {props.children}
    </>
  );
}

function SettingsContainer(props: Props) {
  const { theme, darkmode } = useTheme();
  return (
    <View
      ref={props.ref}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors?.background,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
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
