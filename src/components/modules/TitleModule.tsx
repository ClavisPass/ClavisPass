import React, { useEffect, useRef } from "react";

import { Icon, TextInput } from "react-native-paper";
import ValuesType from "../../types/ValuesType";
import { useTheme } from "../../contexts/ThemeProvider";
import { View } from "react-native";

type Props = {
  value: ValuesType;
  setValue: (value: ValuesType) => void;
  disabled: boolean;
  discardChanges: () => void;
};

function TitleModule(props: Props) {
  const { theme } = useTheme();

  const textInputRef = useRef<any>(null);

  const changeTitle = (text: string) => {
    const newValue = { ...props.value };
    newValue.title = text;
    props.setValue(newValue);
    props.discardChanges();
  };

  useEffect(() => {
    if (textInputRef.current && props.value.title === "") {
      textInputRef.current.focus();
    }
  }, []);

  return (
    <View
      style={{
        height: 36,
        width: 200,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextInput
        ref={textInputRef}
        placeholder={"Title..."}
        placeholderTextColor={"lightgrey"}
        outlineStyle={[
          {
            borderWidth: 0,
            height: 36,
            borderRadius: 0,
            width: "100%",
            borderColor:
              props.value.title == ""
                ? theme.colors?.error
                : theme.colors?.primary,
            borderBottomWidth: 1,
            padding: 0,
            margin: 0,
            maxWidth: 200,
          },
        ]}
        contentStyle={{ margin: 0, padding: 0, height: 36 }}
        underlineStyle={{ margin: 0, padding: 0 }}
        style={[{ flex: 1, width: "100%", margin: 0, padding: 0, height: 36 }]}
        value={props.value.title}
        mode="outlined"
        onChangeText={(text) => changeTitle(text)}
        right={
          props.value.title == "" && (
            <TextInput.Icon
              icon="alert-circle"
              size={20}
              color={theme.colors?.error}
            />
          )
        }
      />
    </View>
  );
}

export default TitleModule;
