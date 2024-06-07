import React from "react";
import { StyleSheet } from "react-native";

import { Text, TextInput } from "react-native-paper";

import NoteModuleType from "../../types/modules/NoteModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";

function NoteModule(props: NoteModuleType & Props) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer title={"Note"} edit={props.edit} onDragStart={props.onDragStart} onDragEnd={props.onDragEnd}>
      <TextInput
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
        autoCapitalize="none"
      />
    </ModuleContainer>
  );
}

export default NoteModule;
