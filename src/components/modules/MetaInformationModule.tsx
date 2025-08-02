import React from "react";
import { View } from "react-native";
import { useTheme } from "../../contexts/ThemeProvider";
import { MenuItem } from "../items/MenuItem";
import { formatDateTime } from "../../utils/Timestamp";
import { Divider } from "react-native-paper";

type MetaInformationModuleType = {
  lastUpdated: string;
  created: string;
};

function MetaInformationModule(props: MetaInformationModuleType) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 4,
        backgroundColor: theme.colors.background,
        boxShadow: theme.colors?.shadow,
        borderRadius: 12,
        marginHorizontal: 8,
        marginBottom: 8,
      }}
    >
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <MenuItem label="Created">{formatDateTime(props.created)}</MenuItem>
      </View>
      <View
        style={{
          width: 1,
          height: 30,
          backgroundColor: theme.colors.outlineVariant,
          marginHorizontal: 8,
        }}
      />
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <MenuItem label="Last Updated">
          {formatDateTime(props.lastUpdated)}
        </MenuItem>
      </View>
    </View>
  );
}

export default MetaInformationModule;
