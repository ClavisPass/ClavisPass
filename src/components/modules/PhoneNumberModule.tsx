import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { TextInput, IconButton } from "react-native-paper";
import ModuleContainer from "../container/ModuleContainer";
import Props from "../../types/ModuleProps";
import CopyToClipboard from "../buttons/CopyToClipboard";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";
import PhoneNumberModuleType from "../../types/modules/PhoneNumberModuleType";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import * as Linking from "expo-linking";
import { useTranslation } from "react-i18next";

function PhoneNumberModule(props: PhoneNumberModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const [value, setValue] = useState(props.value);

  const [formattedNumber, setFormattedNumber] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (didMount.current) {
      const newModule: PhoneNumberModuleType = {
        id: props.id,
        module: props.module,
        value: value,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [value]);

  const handleChange = (input: string) => {
    setValue(input);

    if (input === "") {
      setIsValid(true);
      return;
    }
    const parsed = parsePhoneNumberFromString(input, "DE");
    if (parsed && parsed.isValid()) {
      setFormattedNumber(parsed.formatInternational());
      setIsValid(true);
    } else {
      setFormattedNumber("");
      setIsValid(false);
    }
  };

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:phoneNumber")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.PHONE_NUMBER}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ height: 40, flex: 1 }}>
          <TextInput
            outlineStyle={[
              globalStyles.outlineStyle,
              !isValid ? { borderColor: theme.colors.error } : null,
            ]}
            style={globalStyles.textInputStyle}
            value={value}
            mode="outlined"
            onChangeText={handleChange}
            autoComplete="tel"
            keyboardType="phone-pad"
            onBlur={() => {
              if (isValid) {
                setValue(formattedNumber);
              }
            }}
          />
        </View>
        <CopyToClipboard value={value} />
        <View style={{ width: 48 }}>
          <IconButton
            icon={"phone"}
            iconColor={theme.colors.primary}
            size={20}
            onPress={() => {
              const number = formattedNumber.replace(/\s/g, "");
              Linking.openURL(`tel:${number}`);
            }}
            disabled={isValid === false}
          />
        </View>
      </View>
    </ModuleContainer>
  );
}

export default PhoneNumberModule;
