import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";
import theme from "../ui/theme";

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    padding: 16,
  },
});

type Props = { children: ReactNode };

function SettingsItem(props: Props) {
  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        {props.children}
      </View>
      <Icon color={theme.colors.primary} source={"chevron-right"} size={20} />
    </View>
  );
}

export default SettingsItem;
