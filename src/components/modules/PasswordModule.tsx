import React from "react";
import { View } from "react-native";

import { IconButton, TextInput } from "react-native-paper";

import PasswordModuleType from "../../types/modules/PasswordModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";
import theme from "../../ui/theme";

import { ProgressBar } from "react-native-paper";
import passwordEntropy from "../../utils/Entropy";
import PasswordGeneratorModal from "../modals/PasswordGeneratorModal";

function PasswordModule(props: PasswordModuleType & Props) {
  const [value, setValue] = React.useState(props.value);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const [eyeIcon, setEyeIcon] = React.useState("eye");

  const [entropyPercentage, setEntropyPercentage] = React.useState(0);
  const [progressbarColor, setProgressbarColor] = React.useState("#238823");

  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (secureTextEntry) {
      setEyeIcon("eye");
    } else {
      setEyeIcon("eye-off");
    }
  }, [secureTextEntry]);

  React.useEffect(() => {
    const percentage = passwordEntropy(value) / 200;
    console.log("Entropy: " + percentage);
    setProgressbarColor("#238823");
    if (percentage < 0.55) {
      setProgressbarColor("#FFBF00");
    }
    if (percentage < 0.40) {
      setProgressbarColor("#D2222D");
    }

    if (percentage > 1) {
      setEntropyPercentage(1);
    } else {
      setEntropyPercentage(percentage);
    }
  }, [value]);

  return (
    <ModuleContainer
      id={props.id}
      title={"Password"}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      deleteModule={props.deleteModule}
    >
      <View style={globalStyles.moduleView}>
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
              color={theme.colors.primary}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
        />
        <IconButton
          iconColor={theme.colors.primary}
          icon="lock-check-outline"
          size={20}
          onPress={() => {
            setVisible(true);
          }}
        />
        <PasswordGeneratorModal
          visible={visible}
          setVisible={setVisible}
          changePassword={setValue}
        />
      </View>
      <ProgressBar
        style={{ margin: 10 }}
        progress={entropyPercentage}
        color={progressbarColor}
      />
    </ModuleContainer>
  );
}

export default PasswordModule;
