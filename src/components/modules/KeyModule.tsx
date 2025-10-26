import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { TextInput, Text } from "react-native-paper";
import KeyModuleType from "../../types/modules/KeyModuleType";
import ModuleContainer from "../container/ModuleContainer";
import Props from "../../types/ModuleProps";
import CopyToClipboard from "../buttons/CopyToClipboard";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";
import identifyKeyType from "../../utils/regex/identifyKeyType";

function KeyModule(props: KeyModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
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
      title={"Key"}
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
