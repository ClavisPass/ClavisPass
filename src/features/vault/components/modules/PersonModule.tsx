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
import PersonModuleType from "../../model/modules/PersonModuleType";

type PersonState = Pick<
  PersonModuleType,
  "firstName" | "middleName" | "lastName" | "displayName" | "username" | "title"
>;

function PersonModule(props: PersonModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles } = useTheme();
  const { t } = useTranslation();
  const hasAdditionalValues = Boolean(
    props.middleName || props.username || props.title,
  );
  const [expanded, setExpanded] = useState(hasAdditionalValues);
  const [person, setPerson] = useState<PersonState>({
    firstName: props.firstName ?? "",
    middleName: props.middleName ?? "",
    lastName: props.lastName ?? "",
    displayName: props.displayName ?? "",
    username: props.username ?? "",
    title: props.title ?? "",
  });

  useEffect(() => {
    setPerson({
      firstName: props.firstName ?? "",
      middleName: props.middleName ?? "",
      lastName: props.lastName ?? "",
      displayName: props.displayName ?? "",
      username: props.username ?? "",
      title: props.title ?? "",
    });
  }, [
    props.firstName,
    props.middleName,
    props.lastName,
    props.displayName,
    props.username,
    props.title,
  ]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: PersonModuleType = {
        id: props.id,
        module: props.module,
        ...person,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [person]);

  const copyValue = useMemo(() => {
    const displayName = person.displayName?.trim() ?? "";
    if (displayName) return displayName;
    return [person.title, person.firstName, person.middleName, person.lastName]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(" ");
  }, [person]);

  const changeField =
    (field: keyof PersonState) =>
    (value: string) => {
      setPerson((current) => ({ ...current, [field]: value }));
    };

  const input = (
    field: keyof PersonState,
    label: string,
    autoFocus = false,
  ) => (
    <View style={{ height: 40, flex: 1 }}>
      <TextInput
        autoFocus={autoFocus}
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        contentStyle={{ textAlignVertical: "center", paddingVertical: 0 }}
        value={person[field] ?? ""}
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
      title={t("modules:person")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.PERSON]}
      fastAccess={props.fastAccess}
    >
      <View style={{ gap: 8 }}>
        <View style={globalStyles.moduleView}>
          {input("displayName", t("modules:personDisplayName"), false)}
          <CopyToClipboard value={copyValue} disabled={!copyValue} />
        </View>

        <View style={[globalStyles.moduleView, { gap: 8 }]}>
          {input(
            "firstName",
            t("modules:personFirstName"),
            Object.values(person).every((value) => !value),
          )}
          {input("lastName", t("modules:personLastName"))}
        </View>

        {expanded ? (
          <>
            <View style={[globalStyles.moduleView, { gap: 8 }]}>
              {input("middleName", t("modules:personMiddleName"))}
              {input("title", t("modules:personTitle"))}
            </View>

            <View style={globalStyles.moduleView}>
              {input("username", t("modules:personUsername"))}
            </View>
          </>
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
              ? t("modules:personShowLess")
              : t("modules:personShowMore")}
          </Button>
        </View>
      </View>
    </ModuleContainer>
  );
}

export default PersonModule;
