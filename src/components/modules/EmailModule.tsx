import React from "react";
import { StyleSheet, View } from "react-native";

import { IconButton, Text, TextInput } from "react-native-paper";

import EmailModuleType from "../../types/modules/EmailModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";

function EmailModule(props: EmailModuleType & Props) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer
      title={"E-Mail"}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
    >
      <View style={{ display: "flex", flexDirection: "row" }}>
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
        <IconButton
          icon="content-copy"
          size={20}
          onPress={() => console.log("Pressed")}
        />
      </View>
    </ModuleContainer>
  );
}

export default EmailModule;
