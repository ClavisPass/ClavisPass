import React from "react";
import { StyleSheet } from "react-native";

import { Snackbar, Text, TextInput } from "react-native-paper";

import UsernameModuleType from "../../types/modules/UsernameModuleType";
import ModuleContainer from "../ModuleContainer";
import CopyToClipboard from "../CopyToClipboard";

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

function UsernameModule(props: UsernameModuleType) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer title={"Username"}>
      <TextInput
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
        autoCapitalize="none"
        autoComplete="username"
        textContentType="username"
      />
      <CopyToClipboard value={value} />
    </ModuleContainer>
  );
}

export default UsernameModule;
