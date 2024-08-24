import React from "react";

import { TextInput } from "react-native-paper";
import ValuesType from "../../types/ValuesType";
import { useTheme } from "../../contexts/ThemeProvider";

type Props = {
  value: ValuesType;
  setValue: (value: ValuesType) => void;
  disabled: boolean;
};

function TitleModule(props: Props) {
  const { globalStyles } = useTheme();
  const changeTitle = (text: string) => {
    const newValue = { ...props.value };
    newValue.title = text;
    props.setValue(newValue);
  };
  return (
    <TextInput
      placeholder={"Title..."}
      placeholderTextColor="lightgrey"
      outlineStyle={[
        globalStyles.outlineStyle,
        {
          borderWidth: 0,
          padding: 0,
          margin: 0,
          flex: 1,
          width: "100%",
        },
      ]}
      underlineStyle={{ margin: 0, padding: 0 }}
      style={[{ margin: 0, padding: 0, flex: 1, width: "100%" }]}
      value={props.value.title}
      mode="outlined"
      onChangeText={(text) => changeTitle(text)}
    />
  );
}

export default TitleModule;
