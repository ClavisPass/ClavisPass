import React from "react";
import { StyleSheet, View } from "react-native";

import {
  IconButton,
  Modal,
  Portal,
  Switch,
  TextInput,
} from "react-native-paper";

import PasswordModuleType from "../../types/modules/PasswordModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";
import theme from "../../ui/theme";

import { ProgressBar } from "react-native-paper";
import passwordEntropy from "../../utils/Entropy";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../../ui/linearGradient";

function PasswordModule(props: PasswordModuleType & Props) {
  const [value, setValue] = React.useState(props.value);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const [eyeIcon, setEyeIcon] = React.useState("eye");

  const [entropyPercentage, setEntropyPercentage] = React.useState(0);
  const [progressbarColor, setProgressbarColor] = React.useState("#238823");

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

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
    if (percentage < 0.66) {
      setProgressbarColor("#FFBF00");
    }
    if (percentage < 0.33) {
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
      title={"Password"}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
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
          onPress={showModal}
        />
      </View>
      <ProgressBar
        style={{ margin: 10 }}
        progress={entropyPercentage}
        color={progressbarColor}
      />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: "transparent",
            margin: 26,
            borderRadius: 20,
            display: "flex",
            alignSelf: "center",
            justifyContent: "center",
            width: 300,
          }}
        >
          <LinearGradient
            colors={getColors()}
            style={{ padding: 6, width: 300, borderRadius: 20 }}
            end={{ x: 0.1, y: 0.2 }}
            dither={true}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                borderRadius: 20,
                marginBottom: 6,
              }}
            >
              <TextInput
                outlineStyle={globalStyles.outlineStyle}
                style={globalStyles.textInputStyle}
                value={value}
                mode="outlined"
                onChangeText={(text) => setValue(text)}
                secureTextEntry={false}
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
              />
            </View>
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                borderRadius: 20,
              }}
            >
              <Switch
                value={isSwitchOn}
                onValueChange={() => setIsSwitchOn(!isSwitchOn)}
              />
              <Switch
                value={isSwitchOn}
                onValueChange={() => setIsSwitchOn(!isSwitchOn)}
              />
              <Switch
                value={isSwitchOn}
                onValueChange={() => setIsSwitchOn(!isSwitchOn)}
              />
            </View>
          </LinearGradient>
        </Modal>
      </Portal>
    </ModuleContainer>
  );
}

export default PasswordModule;
