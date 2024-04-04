import React from "react";
import { StyleSheet } from "react-native";

import { TextInput } from "react-native-paper";

import PasswordModuleType from "../../types/modules/PasswordModuleType";
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

function PasswordModule(props: PasswordModuleType) {
  const [value, setValue] = React.useState(props.value);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const [eyeIcon, setEyeIcon] = React.useState("eye");

  React.useEffect(() => {
    if (secureTextEntry) {
      setEyeIcon("eye");
    } else {
      setEyeIcon("eye-off");
    }
  }, [secureTextEntry]);
  return (
    <ModuleContainer title={"Password"}>
      <TextInput
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        right={
          <TextInput.Icon
            icon={eyeIcon}
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          />
        }
      />
    </ModuleContainer>
  );
}

export default PasswordModule;
