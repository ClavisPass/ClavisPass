import React from "react";

import { TextInput } from "react-native-paper";

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
    <TextInput
      placeholder={"Title"}
      outlineStyle={[
        globalStyles.outlineStyle,
        { borderWidth: 0, padding: 0, margin: 0, flex: 1, width: "100%" },
      ]}
      style={[{ margin: 0, padding: 0 }]}
      value={props.value.title}
      mode="outlined"
      onChangeText={(text) => changeTitle(text)}
    />
  );
}

export default TitleModule;
