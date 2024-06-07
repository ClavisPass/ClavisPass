import React from "react";
import { StyleSheet } from "react-native";

import { Text, TextInput } from "react-native-paper";

import TitleModuleType from "../../types/modules/TitleModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";

function TitleModule(props: TitleModuleType & Props) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer
      title={"Title"}
      edit={props.edit}
      delete={false}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
    >
      <TextInput
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
      />
    </ModuleContainer>
  );
}

export default TitleModule;
