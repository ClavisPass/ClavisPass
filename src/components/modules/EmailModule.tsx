import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { TextInput } from "react-native-paper";

import EmailModuleType from "../../types/modules/EmailModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";
import CopyToClipboard from "../CopyToClipboard";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";

function EmailModule(props: EmailModuleType & Props) {
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    const newModule: EmailModuleType = {
      id: props.id,
      module: props.module,
      value: value,
    };
    props.changeModule(newModule);
  }, [value]);
  return (
    <ModuleContainer
      id={props.id}
      title={"E-Mail"}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.E_MAIL}
    >
      <View style={globalStyles.moduleView}>
        <TextInput
          outlineStyle={globalStyles.outlineStyle}
          style={globalStyles.textInputStyle}
          value={value}
          mode="outlined"
          onChangeText={(text) => setValue(text)}
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <CopyToClipboard value={value}/>
      </View>
    </ModuleContainer>
  );
}

export default EmailModule;
