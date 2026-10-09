import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { MenuItem } from "../../../../shared/components/menus/MenuItem";

import { useTranslation } from "react-i18next";
import { useSetting } from "../../../../app/providers/SettingsProvider";
import { formatAbsoluteLocal } from "../../../../shared/utils/Timestamp";
import { getItemSurfaceStyle } from "../../../../shared/ui/glass";

type MetaInformationModuleType = {
  lastUpdated: string;
  created: string;
};

function MetaInformationModule(props: MetaInformationModuleType) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const itemSurfaceStyle = getItemSurfaceStyle(theme);

  const { value: dateFormat } = useSetting("DATE_FORMAT");
  const { value: timeFormat } = useSetting("TIME_FORMAT");

  return (
    <View
      style={{
        ...itemSurfaceStyle,
        flexDirection: "row",
        alignItems: "center",
        padding: 4,
        borderRadius: 12,
        width: "100%",
        borderWidth: StyleSheet.hairlineWidth,
      }}
    >
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <MenuItem label={t("modules:created")}>
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
        <MenuItem label={t("modules:lastUpdated")}>
          {formatAbsoluteLocal(props.lastUpdated, dateFormat, timeFormat)}
        </MenuItem>
      </View>
    </View>
  );
}

export default MetaInformationModule;
