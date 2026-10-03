import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../../app/providers/ThemeProvider";
import AppIcon from "../../../shared/components/icons/AppIcon";

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 0,
    overflow: "visible",
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
          gap: 8,
          alignItems: "center",
          paddingTop: 8,
          paddingBottom: 4,
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        {props.icon && (
          <AppIcon color={theme.colors?.primary} name={props.icon} size={24} />
        )}
        <Text variant="titleMedium" style={{ fontWeight: "600" }}>
          {props.title}
        </Text>
      </View>
      {props.children}
    </>
  );
}

function SettingsContainer(props: Props) {
  return (
    <View
      ref={props.ref}
      style={[
        styles.container,
        {
          backgroundColor: "transparent",
          borderWidth: 0,
          boxShadow: "none",
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
