import React from "react";
import { StyleSheet } from "react-native";

import { Text, TextInput } from "react-native-paper";

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
      <TextInput
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
      />
    </ModuleContainer>
  );
}

export default EmailModule;
