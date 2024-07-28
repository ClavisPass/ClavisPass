import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import KeyModuleType from "../../types/modules/KeyModuleType";
import ModuleContainer from "../ModuleContainer";
import Props from "../../types/ModuleProps";
import CopyToClipboard from "../CopyToClipboard";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";

function KeyModule(props: KeyModuleType & Props) {
  const { globalStyles } = useTheme();
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    const newModule: KeyModuleType = {
      id: props.id,
      module: props.module,
      value: value,
    };
    props.changeModule(newModule);
  }, [value]);
  return (
    <ModuleContainer
      id={props.id}
      title={"Key"}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.KEY}
    >
      <View style={globalStyles.moduleView}>
        <TextInput
          outlineStyle={globalStyles.outlineStyle}
          style={globalStyles.textInputStyle}
          value={value}
          mode="outlined"
          onChangeText={(text) => setValue(text)}
          autoComplete="one-time-code"
          keyboardType="visible-password"
        />
        <CopyToClipboard value={value} />
      </View>
    </ModuleContainer>
  );
}

export default KeyModule;
