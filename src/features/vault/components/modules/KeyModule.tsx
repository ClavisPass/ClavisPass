import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { TextInput, Text } from "react-native-paper";
import KeyModuleType from "../../model/modules/KeyModuleType";
import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";
import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import ModuleIconsEnum from "../../model/ModuleIconsEnum";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import identifyKeyType from "../../utils/regex/identifyKeyType";
import { useTranslation } from "react-i18next";

function KeyModule(props: KeyModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const [value, setValue] = useState(props.value);
  const [keyType, setKeyType] = useState(identifyKeyType(value));
  useEffect(() => {
    if (didMount.current) {
      const newModule: KeyModuleType = {
        id: props.id,
        module: props.module,
        value: value,
      };
      props.changeModule(newModule);
      setKeyType(identifyKeyType(value));
    } else {
      didMount.current = true;
    }
  }, [value]);

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:key")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.KEY}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ height: 40, flex: 1 }}>
          <TextInput
            outlineStyle={globalStyles.outlineStyle}
            style={globalStyles.textInputStyle}
            value={value}
            mode="outlined"
            onChangeText={(text) => setValue(text)}
            autoComplete="one-time-code"
            keyboardType="visible-password"
          />
        </View>
        <CopyToClipboard value={value} />
      </View>
      {keyType !== "false" && (
        <Text style={{ marginLeft: 6, color: theme.colors.primary }}>
          {keyType}
        </Text>
      )}
    </ModuleContainer>
  );
}

export default KeyModule;
