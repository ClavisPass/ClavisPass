import React from "react";
import { StyleSheet, View } from "react-native";

import { Snackbar, Text, TextInput } from "react-native-paper";

import UsernameModuleType from "../../types/modules/UsernameModuleType";
import ModuleContainer from "../ModuleContainer";
import CopyToClipboard from "../CopyToClipboard";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";

function UsernameModule(props: UsernameModuleType & Props) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer title={"Username"} edit={props.edit} onDragStart={props.onDragStart} onDragEnd={props.onDragEnd}>
      <View style={{ display: "flex" }}>
        <TextInput
          outlineStyle={globalStyles.outlineStyle}
          style={globalStyles.textInputStyle}
          value={value}
          mode="outlined"
          onChangeText={(text) => setValue(text)}
          autoCapitalize="none"
          autoComplete="username"
          textContentType="username"
        />
        <CopyToClipboard value={value} />
      </View>
    </ModuleContainer>
  );
}

export default UsernameModule;
