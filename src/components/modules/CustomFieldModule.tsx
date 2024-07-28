import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { TextInput } from "react-native-paper";

import CustomFieldModuleType from "../../types/modules/CustomFieldModuleType";
import ModuleContainer from "../ModuleContainer";
import Props from "../../types/ModuleProps";
import EditCustomFieldModal from "../modals/EditCustomFieldModal";
import CopyToClipboard from "../CopyToClipboard";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";

function CustomFieldModule(props: CustomFieldModuleType & Props) {
  const { globalStyles } = useTheme();
  const [visible, setVisible] = useState(false);

  const [value, setValue] = useState(props.value);
  const [title, setTitle] = useState(props.title);
  useEffect(() => {
    const newModule: CustomFieldModuleType = {
      id: props.id,
      module: props.module,
      title: title,
      value: value,
    };
    props.changeModule(newModule);
  }, [value, title]);
  return (
    <ModuleContainer
      id={props.id}
      title={props.title}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.CUSTOM_FIELD}
      titlePress={() => {
        setVisible(true);
      }}
    >
      <View style={globalStyles.moduleView}>
        <TextInput
          outlineStyle={globalStyles.outlineStyle}
          style={globalStyles.textInputStyle}
          value={value}
          mode="outlined"
          onChangeText={(text) => setValue(text)}
          autoCapitalize="none"
        />
        <CopyToClipboard value={value} />
      </View>
      <EditCustomFieldModal
        visible={visible}
        setVisible={setVisible}
        title={title}
        setTitle={setTitle}
      />
    </ModuleContainer>
  );
}

export default CustomFieldModule;
