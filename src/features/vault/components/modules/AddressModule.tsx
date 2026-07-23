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
import AddressModuleType from "../../model/modules/AddressModuleType";

type AddressState = Pick<
  AddressModuleType,
  "street1" | "street2" | "postalCode" | "city" | "state" | "country"
>;

function AddressModule(props: AddressModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles } = useTheme();
  const { t } = useTranslation();
  const hasAdditionalValues = Boolean(
    props.street2 || props.state || props.country,
  );
  const [expanded, setExpanded] = useState(hasAdditionalValues);
  const [address, setAddress] = useState<AddressState>({
    street1: props.street1 ?? "",
    street2: props.street2 ?? "",
    postalCode: props.postalCode ?? "",
    city: props.city ?? "",
    state: props.state ?? "",
    country: props.country ?? "",
  });

  useEffect(() => {
    setAddress({
      street1: props.street1 ?? "",
      street2: props.street2 ?? "",
      postalCode: props.postalCode ?? "",
      city: props.city ?? "",
      state: props.state ?? "",
      country: props.country ?? "",
    });
  }, [
    props.street1,
    props.street2,
    props.postalCode,
    props.city,
    props.state,
    props.country,
  ]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: AddressModuleType = {
        id: props.id,
        module: props.module,
        ...address,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [address]);

  const copyValue = useMemo(() => {
    const line1 = [address.street1, address.street2]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(" ");
    const line2 = [address.postalCode, address.city]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(" ");
    return [line1, line2, address.state, address.country]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join("\n");
  }, [address]);

  const changeField =
    (field: keyof AddressState) =>
    (value: string) => {
      setAddress((current) => ({ ...current, [field]: value }));
    };

  const input = (
    field: keyof AddressState,
    label: string,
    autoFocus = false,
  ) => (
    <View style={{ height: 40, flex: 1 }}>
      <TextInput
        autoFocus={autoFocus}
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        contentStyle={{ textAlignVertical: "center", paddingVertical: 0 }}
        value={address[field] ?? ""}
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
      title={t("modules:address")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.ADDRESS]}
      fastAccess={props.fastAccess}
    >
      <View style={{ gap: 8 }}>
        <View style={globalStyles.moduleView}>
          {input(
            "street1",
            t("modules:addressStreet1"),
            Object.values(address).every((value) => !value),
          )}
          <CopyToClipboard value={copyValue} disabled={!copyValue} />
        </View>

        <View style={[globalStyles.moduleView, { gap: 8 }]}>
          {input("postalCode", t("modules:addressPostalCode"))}
          {input("city", t("modules:addressCity"))}
        </View>

        {expanded ? (
          <>
            <View style={globalStyles.moduleView}>
              {input("street2", t("modules:addressStreet2"))}
            </View>

            <View style={[globalStyles.moduleView, { gap: 8 }]}>
              {input("state", t("modules:addressState"))}
              {input("country", t("modules:addressCountry"))}
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
              ? t("modules:addressShowLess")
              : t("modules:addressShowMore")}
          </Button>
        </View>
      </View>
    </ModuleContainer>
  );
}

export default AddressModule;
