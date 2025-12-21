import React from "react";
import { View } from "react-native";

import { Text } from "react-native-paper";

import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import ModulesEnum from "../../model/ModulesEnum";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";

function UnknownModule(props: { module: any; id: string } & Props) {
  const { globalStyles } = useTheme();
  const { t } = useTranslation();
  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:unknownModule")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.UNKNOWN]}
      fastAccess={props.fastAccess}
    >
      <View style={[globalStyles.moduleView, {display: 'flex', flexDirection: 'column', gap: 4}]}>
        {Object.entries(props.module ?? {})
          .filter(([key]) => key !== "id")
          .map(([key, val]) => (
            <Text key={key} selectable style={{ fontSize: 14, lineHeight: 20 }}>
              <Text style={{ fontWeight: "600" }}>{key}: </Text>
              <Text>
                {typeof val === "object" && val !== null
                  ? JSON.stringify(val, null, 2)
                  : String(val)}
              </Text>
            </Text>
          ))}
      </View>
    </ModuleContainer>
  );
}

export default UnknownModule;
