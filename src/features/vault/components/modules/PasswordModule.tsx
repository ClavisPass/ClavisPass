import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import * as Progress from "react-native-progress";
import { useTranslation } from "react-i18next";

import PasswordModuleType from "../../model/modules/PasswordModuleType";
import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";

import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import PasswordTextbox from "../../../../shared/components/PasswordTextbox";
import PasswordGeneratorModal from "../modals/PasswordGeneratorModal";

import PasswordStrengthLevel from "../../../analysis/model/PasswordStrengthLevel";
import getPasswordStrengthColor from "../../../analysis/utils/getPasswordStrengthColor";
import {
  computeEntropyBitsForUi,
  entropyToProgress,
  entropyToStrength,
} from "../../utils/entropyUi";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import ModulesEnum from "../../model/ModulesEnum";

function PasswordModule(props: PasswordModuleType & Props) {
  const didMount = useRef(false);
  const { t } = useTranslation();
  const { globalStyles, theme } = useTheme();
  const [value, setValue] = useState(props.value);

  const [entropyPercentage, setEntropyPercentage] = useState(0);
  const [progressbarColor, setProgressbarColor] = useState(
    getPasswordStrengthColor(PasswordStrengthLevel.STRONG)
  );

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const entropyBits = computeEntropyBitsForUi(value);
    const strength = entropyToStrength(entropyBits);
    const progress = entropyToProgress(entropyBits);

    setProgressbarColor(getPasswordStrengthColor(strength));
    setEntropyPercentage(progress);
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
      title={t("modules:password")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.PASSWORD]}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ height: 40, flex: 1 }}>
          <PasswordTextbox autofocus={value === "" ? true : false} setValue={setValue} value={value} placeholder="" />
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
          icon="lock-check"
          size={16}
          onPress={() => setVisible(true)}
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
