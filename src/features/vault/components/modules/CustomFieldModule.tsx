import React, { useCallback, useState } from "react";
import { Keyboard, View } from "react-native";

import { TextInput } from "react-native-paper";

import CustomFieldModuleType from "../../model/modules/CustomFieldModuleType";
import Props from "../../model/ModuleProps";
import EditCustomFieldModal from "../modals/EditCustomFieldModal";
import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import ModuleContainer from "../ModuleContainer";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import ModulesEnum from "../../model/ModulesEnum";
import PasswordTextbox from "../../../../shared/components/PasswordTextbox";
import ExpiryPickerModal from "../modals/ExpiryPickerModal";

type CustomFieldInputType = NonNullable<CustomFieldModuleType["inputType"]>;

function CustomFieldModule(props: CustomFieldModuleType & Props) {
  const { globalStyles } = useTheme();
  const [visible, setVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const inputType = props.inputType ?? "text";

  const changeCustomField = useCallback(
    (
      next: Partial<
        Pick<CustomFieldModuleType, "title" | "value" | "inputType">
      >,
    ) => {
      props.changeModule({
        id: props.id,
        module: props.module,
        title: props.title,
        value: props.value,
        inputType,
        ...next,
      });
    },
    [
      inputType,
      props.changeModule,
      props.id,
      props.module,
      props.title,
      props.value,
    ],
  );

  const copyKind = inputType === "secret" ? "password" : undefined;

  return (
    <ModuleContainer
      id={props.id}
      title={props.title}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.CUSTOM_FIELD]}
      titlePress={() => {
        Keyboard.dismiss();
        setVisible(true);
      }}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ height: 40, flex: 1 }}>
          {inputType === "secret" ? (
            <PasswordTextbox
              autofocus={props.value === ""}
              setValue={(nextValue) => changeCustomField({ value: nextValue })}
              value={props.value}
              placeholder=""
            />
          ) : (
            <TextInput
              autoFocus={props.value === ""}
              outlineStyle={globalStyles.outlineStyle}
              style={globalStyles.textInputStyle}
              value={props.value}
              mode="outlined"
              onChangeText={(text) => changeCustomField({ value: text })}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={inputType === "number" ? "number-pad" : "default"}
              right={
                inputType === "date" ? (
                  <TextInput.Icon
                    icon="calendar"
                    onPress={() => {
                      Keyboard.dismiss();
                      setDatePickerVisible(true);
                    }}
                  />
                ) : undefined
              }
            />
          )}
        </View>
        <CopyToClipboard value={props.value} kind={copyKind} />
      </View>
      <ExpiryPickerModal
        visible={datePickerVisible}
        setVisible={setDatePickerVisible}
        initialIso={props.value || null}
        onConfirm={(iso) => changeCustomField({ value: iso })}
      />
      <EditCustomFieldModal
        visible={visible}
        setVisible={setVisible}
        title={props.title}
        setTitle={(nextTitle) => changeCustomField({ title: nextTitle })}
        value={props.value}
        inputType={inputType}
        setInputType={(nextInputType) =>
          changeCustomField({ inputType: nextInputType })
        }
      />
    </ModuleContainer>
  );
}

export default CustomFieldModule;
