import React, { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import ModulesEnum from "../../model/ModulesEnum";
import DocumentModuleType from "../../model/modules/DocumentModuleType";
import moduleFormStyles from "./moduleFormStyles";

type DocumentState = Pick<
  DocumentModuleType,
  "documentType" | "number" | "issuer"
>;

function DocumentModule(props: DocumentModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles } = useTheme();
  const { t } = useTranslation();
  const hasAdditionalValues = Boolean(props.issuer);
  const [expanded, setExpanded] = useState(hasAdditionalValues);
  const [document, setDocument] = useState<DocumentState>({
    documentType: props.documentType ?? "",
    number: props.number ?? "",
    issuer: props.issuer ?? "",
  });

  useEffect(() => {
    setDocument({
      documentType: props.documentType ?? "",
      number: props.number ?? "",
      issuer: props.issuer ?? "",
    });
    didMount.current = false;
  }, [props.id]);

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
      [document.documentType, document.number, document.issuer]
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
    numeric = false,
  ) => (
    <View style={moduleFormStyles.inputShell}>
      <TextInput
        autoFocus={autoFocus}
        outlineStyle={globalStyles.outlineStyle}
        style={[globalStyles.textInputStyle, moduleFormStyles.input]}
        contentStyle={{ textAlignVertical: "center", paddingVertical: 0 }}
        value={document[field] ?? ""}
        placeholder={label}
        mode="outlined"
        onChangeText={(text) =>
          changeField(field)(numeric ? text.replace(/\D/g, "") : text)
        }
        autoCapitalize="words"
        keyboardType={numeric ? "number-pad" : "default"}
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
        <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
          {input(
            "documentType",
            t("modules:documentType"),
            Object.values(document).every((value) => !value),
          )}
          {input("number", t("modules:documentNumber"), false, true)}
          <CopyToClipboard
            value={document.number ?? ""}
            disabled={!document.number}
            sensitive
          />
        </View>

        {expanded ? (
          <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
            {input("issuer", t("modules:documentIssuer"))}
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

      </View>
    </ModuleContainer>
  );
}

export default DocumentModule;
