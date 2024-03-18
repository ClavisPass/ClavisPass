import React from "react";
import { StyleSheet } from "react-native";

import { TextInput } from "react-native-paper";

import PasswordModuleType from "../../types/modules/PasswordModuleType";
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

function PasswordModule(props: PasswordModuleType) {
  const [value, setValue] = React.useState(props.value);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  return (
    <ModuleContainer title={"Password"}>
      <TextInput
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
        secureTextEntry={secureTextEntry}
        right={
          <TextInput.Icon
            icon="eye"
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          />
        }
      />
    </ModuleContainer>
  );
}

export default PasswordModule;
