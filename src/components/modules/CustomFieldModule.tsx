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
    <ModuleContainer
      id={props.id}
      title={props.title}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      deleteModule={props.deleteModule}
    >
      <TextInput
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        value={text}
        mode="outlined"
        onChangeText={(text) => setText(text)}
        onEndEditing={() => console.log("der bro ist fertig")}
        autoCapitalize="none"
      />
    </ModuleContainer>
  );
}

export default CustomFieldModule;
