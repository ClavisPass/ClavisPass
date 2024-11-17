import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native-paper";
import NoteModuleType from "../../types/modules/NoteModuleType";
import ModuleContainer from "../containers/ModuleContainer";
import Props from "../../types/ModuleProps";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";

function NoteModule(props: NoteModuleType & Props) {
  const didMount = useRef(false);
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
      title={"Note"}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.NOTE}
    >
      <TextInput
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputNoteStyle}
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
        autoCapitalize="none"
        multiline={true}
        numberOfLines={4}
      />
    </ModuleContainer>
  );
}

export default NoteModule;
