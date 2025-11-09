import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { TextInput } from "react-native-paper";

import UsernameModuleType from "../../types/modules/UsernameModuleType";
import ModuleContainer from "../container/ModuleContainer";
import CopyToClipboard from "../buttons/CopyToClipboard";
import Props from "../../types/ModuleProps";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";
import { useTranslation } from "react-i18next";

function UsernameModule(props: UsernameModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles } = useTheme();
  const { t } = useTranslation();
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
      title={t("modules:username")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.USERNAME}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ height: 40, flex: 1 }}>
          <TextInput
            outlineStyle={globalStyles.outlineStyle}
            style={globalStyles.textInputStyle}
            contentStyle={{ textAlignVertical: "center", paddingVertical: 0 }}
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
