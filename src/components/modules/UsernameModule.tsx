import React from "react";
import { StyleSheet, View } from "react-native";

import { Snackbar, Text, TextInput } from "react-native-paper";

import UsernameModuleType from "../../types/modules/UsernameModuleType";
import ModuleContainer from "../ModuleContainer";
import CopyToClipboard from "../CopyToClipboard";
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

function UsernameModule(props: UsernameModuleType) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer title={"Username"}>
      <View style={{display:"flex"}}>
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
