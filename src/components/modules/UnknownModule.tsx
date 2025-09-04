import React from "react";
import { View } from "react-native";

import { Text } from "react-native-paper";

import ModuleContainer from "../container/ModuleContainer";
import Props from "../../types/ModuleProps";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";

function UnknownModule(props: { module: any; id: string } & Props) {
  const { globalStyles } = useTheme();
  return (
    <ModuleContainer
      id={props.id}
      title={"Unknown Module"}
      edit={props.edit}
      deletable={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.UNKNOWN}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        {Object.entries(props.module ?? {})
          .filter(([key]) => key !== "id")
          .map(([key, val]) => (
            <Text key={key} selectable style={{ fontSize: 14, lineHeight: 20 }}>
              <Text style={{ fontWeight: "600" }}>{key}: </Text>
              <Text>
                {typeof val === "object" && val !== null
                  ? JSON.stringify(val)
                  : String(val)}
              </Text>
            </Text>
          ))}
      </View>
    </ModuleContainer>
  );
}

export default UnknownModule;
