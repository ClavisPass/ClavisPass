import React from "react";
import { StyleSheet } from "react-native";

import { Text, TextInput } from "react-native-paper";

import CustomFieldModuleType from "../../types/modules/CustomFieldModuleType";
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

function CustomFieldModule(props: CustomFieldModuleType) {
  const [text, setText] = React.useState(props.value);
  return (
    <ModuleContainer title={props.title}>
      <TextInput
        value={text}
        mode="outlined"
        onChangeText={(text) => setText(text)}
        autoCapitalize="none"
      />
    </ModuleContainer>
  );
}

export default CustomFieldModule;
