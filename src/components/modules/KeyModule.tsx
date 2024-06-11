import React from "react";
import { StyleSheet } from "react-native";

import { Text, TextInput } from "react-native-paper";

import KeyModuleType from "../../types/modules/KeyModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";

function KeyModule(props: KeyModuleType & Props) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer
      id={props.id}
      title={"Key"}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      deleteModule={props.deleteModule}
    >
      <TextInput
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
        autoComplete="one-time-code"
        keyboardType="visible-password"
      />
    </ModuleContainer>
  );
}

export default KeyModule;
