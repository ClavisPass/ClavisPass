import React from "react";
import { StyleSheet, View } from "react-native";

import { IconButton, Text, TextInput } from "react-native-paper";

import EmailModuleType from "../../types/modules/EmailModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";
import theme from "../../ui/theme";
import CopyToClipboard from "../CopyToClipboard";

function EmailModule(props: EmailModuleType & Props) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer
      id={props.id}
      title={"E-Mail"}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      deleteModule={props.deleteModule}
    >
      <View style={globalStyles.moduleView}>
        <TextInput
          outlineStyle={globalStyles.outlineStyle}
          style={globalStyles.textInputStyle}
          value={value}
          mode="outlined"
          onChangeText={(text) => setValue(text)}
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <CopyToClipboard value={value} />
      </View>
    </ModuleContainer>
  );
}

export default EmailModule;
