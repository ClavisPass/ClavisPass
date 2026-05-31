import { View, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Dropdown, DropdownInputProps } from "react-native-paper-dropdown";
import Modal from "../../../../shared/components/modals/Modal";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import type CustomFieldModuleType from "../../model/modules/CustomFieldModuleType";

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
  ];

  const CustomDropdownInput = ({
    selectedLabel,
    rightIcon,
  }: DropdownInputProps) => (
    <TextInput
      outlineStyle={[globalStyles.outlineStyle]}
      style={[globalStyles.textInputStyle, { minWidth: 0, width: "100%" }]}
      mode="outlined"
      value={selectedLabel}
      right={rightIcon}
    />
  );

  useEffect(() => {
    if (props.visible) {
      setTypeError(null);
      requestAnimationFrame(() => {
        inputRef.current?.focus?.();
      });
    }
  }, [props.visible]);
  return (
    <Modal
      top={-6}
      visible={props.visible}
      onDismiss={() => {
        props.setVisible(false);
      }}
    >
      <View
        style={{
          backgroundColor: "transparent",
          padding: 14,
          display: "flex",
          width: 300,
          gap: 12,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.outlineVariant,
        }}
      >
        <Text variant="titleMedium">{t("modules:customField")}</Text>

        <View style={{ gap: 8 }}>
          <Text variant="bodyMedium" style={{ opacity: 0.72 }}>
            {t("modules:customFieldTitle")}
          </Text>
          <TextInput
            ref={inputRef}
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
          <Dropdown
            CustomDropdownInput={CustomDropdownInput}
            menuContentStyle={{
              borderRadius: 12,
              backgroundColor: theme.colors.background,
              boxShadow: theme.colors.shadow,
              overflow: "hidden",
            }}
            mode="flat"
            hideMenuHeader
            options={options}
            value={props.inputType}
            onSelect={(next?: string) => {
              if (next === "text" || next === "secret" || next === "number") {
                if (next === "number" && !/^\d*$/.test(props.value)) {
                  setTypeError(t("modules:customFieldNumberOnly"));
                  return;
                }
                setTypeError(null);
                props.setInputType(next);
              }
            }}
          />
          {typeError ? (
            <Text variant="bodySmall" style={{ color: theme.colors.error }}>
              {typeError}
            </Text>
          ) : null}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Button
            mode="contained"
            style={{ borderRadius: 12 }}
            onPress={() => props.setVisible(false)}
          >
            {t("common:done")}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

export default EditCustomFieldModal;
