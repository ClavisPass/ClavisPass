import React from "react";
import { StyleSheet } from "react-native";

import { Text, TextInput } from "react-native-paper";

import URLModuleType from "../../types/modules/URLModuleType";
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

function URLModule(props: URLModuleType) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer title={"URL"}>
      <TextInput
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
        autoCapitalize="none"
        autoComplete="url"
        textContentType="URL"
        keyboardType="url"
      />
    </ModuleContainer>
  );
}

export default URLModule;
