import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { TextInput } from "react-native-paper";

import CustomFieldModuleType from "../../types/modules/CustomFieldModuleType";
import Props from "../../types/ModuleProps";
import EditCustomFieldModal from "../modals/EditCustomFieldModal";
import CopyToClipboard from "../buttons/CopyToClipboard";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";
import ModuleContainer from "../container/ModuleContainer";

function CustomFieldModule(props: CustomFieldModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles } = useTheme();
  const [visible, setVisible] = useState(false);

  const [value, setValue] = useState(props.value);
  const [title, setTitle] = useState(props.title);
  useEffect(() => {
    if (didMount.current) {
      const newModule: CustomFieldModuleType = {
        id: props.id,
        module: props.module,
        title: title,
        value: value,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
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
        <View style={{ height: 40, flexGrow: 1 }}>
          <TextInput
            outlineStyle={globalStyles.outlineStyle}
            style={globalStyles.textInputStyle}
            value={value}
            mode="outlined"
            onChangeText={(text) => setValue(text)}
            autoCapitalize="none"
          />
        </View>
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
