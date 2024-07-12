import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import NoteModuleType from "../../types/modules/NoteModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";

function NoteModule(props: NoteModuleType & Props) {
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    const newModule: NoteModuleType = {
      id: props.id,
      module: props.module,
      value: value,
    };
    props.changeModule(newModule);
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
