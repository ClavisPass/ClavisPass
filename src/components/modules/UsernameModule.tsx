import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { TextInput } from "react-native-paper";

import UsernameModuleType from "../../types/modules/UsernameModuleType";
import ModuleContainer from "../container/ModuleContainer";
import CopyToClipboard from "../buttons/CopyToClipboard";
import Props from "../../types/ModuleProps";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";

function UsernameModule(props: UsernameModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles } = useTheme();
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    if (didMount.current) {
      const newModule: UsernameModuleType = {
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
      title={"Username"}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.USERNAME}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ height: 40, flexGrow: 1 }}>
          <TextInput
            outlineStyle={globalStyles.outlineStyle}
            style={globalStyles.textInputStyle}
            value={value}
            mode="outlined"
            onChangeText={(text) => setValue(text)}
            autoCapitalize="none"
            autoComplete="username"
            textContentType="username"
          />
        </View>
        <CopyToClipboard value={value} />
      </View>
    </ModuleContainer>
  );
}

export default UsernameModule;
