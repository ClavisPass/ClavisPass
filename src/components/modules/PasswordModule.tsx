import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { IconButton, TextInput } from "react-native-paper";

import PasswordModuleType from "../../types/modules/PasswordModuleType";
import ModuleContainer from "../container/ModuleContainer";
import Props from "../../types/ModuleProps";

import passwordEntropy from "../../utils/Entropy";
import PasswordGeneratorModal from "../modals/PasswordGeneratorModal";
import CopyToClipboard from "../buttons/CopyToClipboard";
import * as Progress from "react-native-progress";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";
import PasswordTextbox from "../PasswordTextbox";
import PasswordStrengthLevel from "../../enums/PasswordStrengthLevel";
import getPasswordStrengthColor from "../../utils/getPasswordStrengthColor";

function PasswordModule(props: PasswordModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const [value, setValue] = useState(props.value);

  const [entropyPercentage, setEntropyPercentage] = useState(0);
  const [progressbarColor, setProgressbarColor] = useState(
    getPasswordStrengthColor(PasswordStrengthLevel.STRONG)
  );

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const percentage = passwordEntropy(value) / 200;
    setProgressbarColor(getPasswordStrengthColor(PasswordStrengthLevel.STRONG));
    if (percentage < 0.55) {
      setProgressbarColor(
        getPasswordStrengthColor(PasswordStrengthLevel.MEDIUM)
      );
    }
    if (percentage < 0.4) {
      setProgressbarColor(getPasswordStrengthColor(PasswordStrengthLevel.WEAK));
    }

    if (percentage > 1) {
      setEntropyPercentage(1);
    } else {
      setEntropyPercentage(percentage);
    }
  }, [value]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: PasswordModuleType = {
        id: props.id,
        module: props.module,
        value: value,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [value]);

  return (
    <ModuleContainer
      id={props.id}
      title={"Password"}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.PASSWORD}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ height: 40, flex: 1 }}>
          <PasswordTextbox setValue={setValue} value={value} placeholder="" />
        </View>
        <CopyToClipboard value={value} />
      </View>
      <View style={globalStyles.moduleView}>
        <View style={{ flexGrow: 1, padding: 6 }}>
          <Progress.Bar
            progress={entropyPercentage}
            color={progressbarColor}
            width={null}
            borderWidth={0}
            unfilledColor={"lightgray"}
            height={4}
          />
        </View>
        <IconButton
          style={{ margin: 0, marginLeft: 8, marginRight: 8 }}
          iconColor={theme.colors.primary}
          icon="lock-check-outline"
          size={16}
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
    </ModuleContainer>
  );
}

export default PasswordModule;
