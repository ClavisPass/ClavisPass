import React from "react";
import { StyleSheet } from "react-native";

import { Text, TextInput } from "react-native-paper";

import TitleModuleType from "../../types/modules/TitleModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import ValuesType from "../../types/ValuesType";

type Props = {
  value: ValuesType;
  setValue: (value: ValuesType) => void;
  disabled: boolean;
};

function TitleModule(props: Props) {
  const changeTitle = (text: string) => {
    const newValue = { ...props.value };
    newValue.title = text;
    props.setValue(newValue);
  };
  return (
    <ModuleContainer id={""} title={"Title"} edit={false} delete={false}>
      <TextInput
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        value={props.value.title}
        mode="outlined"
        onChangeText={(text) => changeTitle(text)}
        disabled={props.disabled}
      />
    </ModuleContainer>
  );
}

export default TitleModule;
