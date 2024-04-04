import React from "react";
import { StyleSheet } from "react-native";

import { Text, TextInput } from "react-native-paper";

import KeyModuleType from "../../types/modules/KeyModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";

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

function KeyModule(props: KeyModuleType) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer title={"Key"}>
      <TextInput
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
        autoComplete="one-time-code"
        keyboardType="visible-password"
      />
    </ModuleContainer>
  );
}

export default KeyModule;
