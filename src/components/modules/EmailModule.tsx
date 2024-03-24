import React from "react";
import { StyleSheet, View } from "react-native";

import { IconButton, Text, TextInput } from "react-native-paper";

import EmailModuleType from "../../types/modules/EmailModuleType";
import ModuleContainer from "../ModuleContainer";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    width: "100%",
    flex: 1,
  },
});

function EmailModule(props: EmailModuleType) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer title={"E-Mail"}>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <TextInput
          style={{ flex: 1 }}
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
