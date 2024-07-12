import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { TextInput } from "react-native-paper";

import UsernameModuleType from "../../types/modules/UsernameModuleType";
import ModuleContainer from "../ModuleContainer";
import CopyToClipboard from "../CopyToClipboard";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";

function UsernameModule(props: UsernameModuleType & Props) {
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    const newModule: UsernameModuleType = {
      id: props.id,
      module: props.module,
      value: value,
    };
    props.changeModule(newModule);
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
        <CopyToClipboard value={value} />
      </View>
    </ModuleContainer>
  );
}

export default UsernameModule;
