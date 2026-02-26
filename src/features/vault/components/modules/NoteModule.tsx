import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native-paper";
import NoteModuleType from "../../model/modules/NoteModuleType";
import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import ModulesEnum from "../../model/ModulesEnum";

function NoteModule(props: NoteModuleType & Props) {
  const didMount = useRef(false);
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    if (didMount.current) {
      const newModule: NoteModuleType = {
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
      title={t("modules:note")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.NOTE]}
      fastAccess={props.fastAccess}
    >
      <TextInput
        autoFocus
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputNoteStyle}
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
        autoCapitalize="none"
        multiline={true}
        numberOfLines={8}
      />
    </ModuleContainer>
  );
}

export default NoteModule;
