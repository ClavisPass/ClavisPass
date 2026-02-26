import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { TextInput } from "react-native-paper";

import UsernameModuleType from "../../model/modules/UsernameModuleType";
import ModuleContainer from "../ModuleContainer";
import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import Props from "../../model/ModuleProps";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import ModulesEnum from "../../model/ModulesEnum";

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
      icon={MODULE_ICON[ModulesEnum.USERNAME]}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ height: 40, flex: 1 }}>
          <TextInput
            autoFocus
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
