import React, { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import ModulesEnum from "../../model/ModulesEnum";
import DocumentModuleType from "../../model/modules/DocumentModuleType";
import ExpiryPickerModal from "../modals/ExpiryPickerModal";

type DocumentState = Pick<
  DocumentModuleType,
  "documentType" | "number" | "issuer" | "expiryDate"
>;

function DocumentModule(props: DocumentModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles } = useTheme();
  const { t } = useTranslation();
  const hasAdditionalValues = Boolean(props.issuer || props.expiryDate);
  const [expanded, setExpanded] = useState(hasAdditionalValues);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [document, setDocument] = useState<DocumentState>({
    documentType: props.documentType ?? "",
    number: props.number ?? "",
    issuer: props.issuer ?? "",
    expiryDate: props.expiryDate ?? "",
  });

  useEffect(() => {
    setDocument({
      documentType: props.documentType ?? "",
      number: props.number ?? "",
      issuer: props.issuer ?? "",
      expiryDate: props.expiryDate ?? "",
    });
  }, [props.documentType, props.number, props.issuer, props.expiryDate]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: DocumentModuleType = {
        id: props.id,
        module: props.module,
        ...document,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [document]);

  const copyValue = useMemo(
    () =>
      [document.documentType, document.number, document.issuer, document.expiryDate]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join("\n"),
    [document],
  );

  const changeField =
    (field: keyof DocumentState) =>
    (value: string) => {
      setDocument((current) => ({ ...current, [field]: value }));
    };

  const input = (
    field: keyof DocumentState,
    label: string,
    autoFocus = false,
    right?: React.ReactNode,
  ) => (
    <View style={{ height: 40, flex: 1 }}>
      <TextInput
        autoFocus={autoFocus}
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        contentStyle={{ textAlignVertical: "center", paddingVertical: 0 }}
        value={document[field] ?? ""}
        placeholder={label}
        mode="outlined"
        onChangeText={changeField(field)}
        autoCapitalize="words"
        right={right}
      />
    </View>
  );

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:document")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.DOCUMENT]}
      fastAccess={props.fastAccess}
    >
      <View style={{ gap: 8 }}>
        <View style={[globalStyles.moduleView, { gap: 8 }]}>
          {input(
            "documentType",
            t("modules:documentType"),
            Object.values(document).every((value) => !value),
          )}
          {input("number", t("modules:documentNumber"))}
          <CopyToClipboard
            value={document.number ?? ""}
            disabled={!document.number}
            sensitive
          />
        </View>

        {expanded ? (
          <View style={[globalStyles.moduleView, { gap: 8 }]}>
            {input("issuer", t("modules:documentIssuer"))}
            {input(
              "expiryDate",
              t("modules:documentExpiryDate"),
              false,
              <TextInput.Icon
                icon="calendar"
                onPress={() => {
                  Keyboard.dismiss();
                  setPickerVisible(true);
                }}
              />,
            )}
          </View>
        ) : null}

        <View style={{ alignItems: "center" }}>
          <Button
            compact
            icon={expanded ? "chevron-up" : "chevron-down"}
            mode="text"
            onPress={() => setExpanded((current) => !current)}
            style={{ borderRadius: 12 }}
            labelStyle={{ fontSize: 12 }}
          >
            {expanded
              ? t("modules:documentShowLess")
              : t("modules:documentShowMore")}
          </Button>
        </View>

        <ExpiryPickerModal
          visible={pickerVisible}
          setVisible={setPickerVisible}
          initialIso={document.expiryDate || null}
          onConfirm={(iso) =>
            setDocument((current) => ({ ...current, expiryDate: iso }))
          }
        />
      </View>
    </ModuleContainer>
  );
}

export default DocumentModule;
