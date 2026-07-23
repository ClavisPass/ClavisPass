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
import CompanyModuleType from "../../model/modules/CompanyModuleType";
import moduleFormStyles from "./moduleFormStyles";

type CompanyState = Pick<CompanyModuleType, "name" | "department" | "jobTitle">;

function CompanyModule(props: CompanyModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles } = useTheme();
  const { t } = useTranslation();
  const hasAdditionalValues = Boolean(props.department || props.jobTitle);
  const [expanded, setExpanded] = useState(hasAdditionalValues);
  const [company, setCompany] = useState<CompanyState>({
    name: props.name ?? "",
    department: props.department ?? "",
    jobTitle: props.jobTitle ?? "",
  });

  useEffect(() => {
    setCompany({
      name: props.name ?? "",
      department: props.department ?? "",
      jobTitle: props.jobTitle ?? "",
    });
    didMount.current = false;
  }, [props.id]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: CompanyModuleType = {
        id: props.id,
        module: props.module,
        ...company,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [company]);

  const copyValue = useMemo(
    () =>
      [company.name, company.department, company.jobTitle]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join("\n"),
    [company],
  );

  const changeField =
    (field: keyof CompanyState) =>
    (value: string) => {
      setCompany((current) => ({ ...current, [field]: value }));
    };

  const input = (
    field: keyof CompanyState,
    label: string,
    autoFocus = false,
  ) => (
    <View style={moduleFormStyles.inputShell}>
      <TextInput
        autoFocus={autoFocus}
        outlineStyle={globalStyles.outlineStyle}
        style={[globalStyles.textInputStyle, moduleFormStyles.input]}
        contentStyle={{ textAlignVertical: "center", paddingVertical: 0 }}
        value={company[field] ?? ""}
        placeholder={label}
        mode="outlined"
        onChangeText={changeField(field)}
        autoCapitalize="words"
      />
    </View>
  );

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:company")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.COMPANY]}
      fastAccess={props.fastAccess}
    >
      <View style={{ gap: 8 }}>
        <View style={globalStyles.moduleView}>
          {input(
            "name",
            t("modules:companyName"),
            Object.values(company).every((value) => !value),
          )}
          <CopyToClipboard value={copyValue} disabled={!copyValue} />
        </View>

        {expanded ? (
          <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
            {input("department", t("modules:companyDepartment"))}
            {input("jobTitle", t("modules:companyJobTitle"))}
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
              ? t("modules:companyShowLess")
              : t("modules:companyShowMore")}
          </Button>
        </View>
      </View>
    </ModuleContainer>
  );
}

export default CompanyModule;
