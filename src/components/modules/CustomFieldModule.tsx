import React from "react";
import { StyleSheet } from "react-native";

import { Text, TextInput } from "react-native-paper";

import CustomFieldModuleType from "../../types/modules/CustomFieldModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";

function CustomFieldModule(props: CustomFieldModuleType & Props) {
  const [text, setText] = React.useState(props.value);
  return (
    <ModuleContainer title={props.title} edit={props.edit} onDragStart={props.onDragStart} onDragEnd={props.onDragEnd}>
      <TextInput
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        value={text}
        mode="outlined"
        onChangeText={(text) => setText(text)}
        autoCapitalize="none"
      />
    </ModuleContainer>
  );
}

export default CustomFieldModule;
