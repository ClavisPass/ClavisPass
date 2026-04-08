import React, { useEffect, useRef, useState } from "react";
import { Keyboard, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";

import Props from "../../model/ModuleProps";
import ModulesEnum from "../../model/ModulesEnum";
import PinModuleType from "../../model/modules/PinModuleType";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import ModuleContainer from "../ModuleContainer";
import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import { useTheme } from "../../../../app/providers/ThemeProvider";

function PinModule(props: PinModuleType & Props) {
  const didMount = useRef(false);
  const { t } = useTranslation();
  const { globalStyles, theme } = useTheme();
  const [value, setValue] = useState(props.value);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [eyeIcon, setEyeIcon] = useState("eye");

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setEyeIcon(secureTextEntry ? "eye" : "eye-off");
  }, [secureTextEntry]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: PinModuleType = {
        id: props.id,
        module: props.module,
        value,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [value]);

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:pin")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.PIN]}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ height: 40, flex: 1 }}>
          <TextInput
            autoFocus={value === "" ? true : false}
            placeholder="0000"
            outlineStyle={globalStyles.outlineStyle}
            style={globalStyles.textInputStyle}
            value={value}
            mode="outlined"
            onChangeText={(text) => setValue(text.replace(/\D+/g, ""))}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            textContentType="password"
            autoComplete="off"
            right={
              <TextInput.Icon
                animated
                icon={eyeIcon}
                color={theme.colors.primary}
                onPress={() => {
                  Keyboard.dismiss();
                  setSecureTextEntry(!secureTextEntry);
                }}
              />
            }
          />
        </View>
        <CopyToClipboard value={value} />
      </View>
    </ModuleContainer>
  );
}

export default PinModule;
