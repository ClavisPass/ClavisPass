import { InteractionManager, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Modal from "../../../../shared/components/modals/Modal";
import ModalSurface, {
  ModalActions,
} from "../../../../shared/components/modals/ModalSurface";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import type CustomFieldModuleType from "../../model/modules/CustomFieldModuleType";
import AdaptiveDropdown from "../../../../shared/components/dropdowns/AdaptiveDropdown";
import DropdownTextInputTrigger from "../../../../shared/components/dropdowns/DropdownTextInputTrigger";

type CustomFieldInputType = NonNullable<CustomFieldModuleType["inputType"]>;

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  value: string;
  inputType: CustomFieldInputType;
  setInputType: (inputType: CustomFieldInputType) => void;
};

function EditCustomFieldModal(props: Props) {
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const inputRef = useRef<any>(null);
  const [typeError, setTypeError] = useState<string | null>(null);

  const options = [
    { label: t("modules:customFieldTypeText"), value: "text" },
    { label: t("modules:customFieldTypeSecret"), value: "secret" },
    { label: t("modules:customFieldTypeNumber"), value: "number" },
    { label: t("modules:customFieldTypeDate"), value: "date" },
  ];

  useEffect(() => {
    if (!props.visible) return;

    setTypeError(null);

    const focusInput = () => {
      inputRef.current?.focus?.();
    };

    const frame = requestAnimationFrame(focusInput);
    const interactionTask = InteractionManager.runAfterInteractions(focusInput);
    const timer = setTimeout(focusInput, 180);

    return () => {
      cancelAnimationFrame(frame);
      interactionTask?.cancel?.();
      clearTimeout(timer);
    };
  }, [props.visible]);
  return (
    <Modal
      top={-6}
      visible={props.visible}
      onDismiss={() => {
        props.setVisible(false);
      }}
    >
      <ModalSurface
        width={300}
        title={t("modules:customField")}
        contentStyle={{ gap: 12 }}
        footer={
          <ModalActions>
            <Button
              mode="contained"
              style={{ borderRadius: 12 }}
              onPress={() => props.setVisible(false)}
            >
              {t("common:done")}
            </Button>
          </ModalActions>
        }
      >
        <View style={{ gap: 8 }}>
          <Text variant="bodyMedium" style={{ opacity: 0.72 }}>
            {t("modules:customFieldTitle")}
          </Text>
          <TextInput
            ref={inputRef}
            autoFocus={props.visible}
            outlineStyle={[globalStyles.outlineStyle]}
            style={globalStyles.textInputStyle}
            value={props.title}
            mode="outlined"
            onChangeText={(text) => props.setTitle(text)}
            autoCapitalize="none"
            selectTextOnFocus
          />
        </View>

        <View style={{ gap: 8 }}>
          <Text variant="bodyMedium" style={{ opacity: 0.72 }}>
            {t("modules:customFieldType")}
          </Text>
          <AdaptiveDropdown
            options={options}
            value={props.inputType}
            setValue={(next) => {
              if (
                next === "text" ||
                next === "secret" ||
                next === "number" ||
                next === "date"
              ) {
                if (next === "number" && !/^\d*$/.test(props.value)) {
                  setTypeError(t("modules:customFieldNumberOnly"));
                  return false;
                }
                setTypeError(null);
                props.setInputType(next);
              }
            }}
            dropdownMaxWidth={300}
            renderTrigger={({ selectedLabel, open }) => (
              <DropdownTextInputTrigger
                value={selectedLabel}
                onPress={open}
                outlineStyle={[globalStyles.outlineStyle]}
                inputStyle={globalStyles.textInputStyle}
              />
            )}
          />
          {typeError ? (
            <Text variant="bodySmall" style={{ color: theme.colors.error }}>
              {typeError}
            </Text>
          ) : null}
        </View>
      </ModalSurface>
    </Modal>
  );
}

export default EditCustomFieldModal;
