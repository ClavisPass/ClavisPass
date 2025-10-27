import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useTheme } from "../../contexts/ThemeProvider";
import { MenuItem } from "../items/MenuItem";

import * as store from "../../utils/store";
import { formatAbsoluteLocal } from "../../utils/expiry";

type MetaInformationModuleType = {
  lastUpdated: string;
  created: string;
};

function MetaInformationModule(props: MetaInformationModuleType) {
  const { theme } = useTheme();

  const [dateFormat, setDateFormat] = useState<string>("");
  const [timeFormat, setTimeFormat] = useState<string>("");

  useEffect(() => {
    store.get("DATE_FORMAT").then((stored) => {
      setDateFormat(stored);
    });
    store.get("TIME_FORMAT").then((stored) => {
      setTimeFormat(stored);
    });
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 4,
        paddingBottom: 0,
        backgroundColor: theme.colors.background,
        boxShadow: theme.colors?.shadow,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        width: "100%",
      }}
    >
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <MenuItem label="Created">
          {formatAbsoluteLocal(props.created, dateFormat, timeFormat)}
        </MenuItem>
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
          {formatAbsoluteLocal(props.lastUpdated, dateFormat, timeFormat)}
        </MenuItem>
      </View>
    </View>
  );
}

export default MetaInformationModule;
