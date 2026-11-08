import React, { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { Button, Switch, Text, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import ModulesEnum from "../../model/ModulesEnum";
import PasskeyModuleType from "../../model/modules/PasskeyModuleType";
import moduleFormStyles from "./moduleFormStyles";

type PasskeyState = Omit<PasskeyModuleType, "id" | "module">;

function normalizeTransports(value: string): string[] {
  return value
    .split(/[\s,;]+/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function PasskeyModule(props: PasskeyModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(
    Boolean(
      props.userHandle ||
        props.credentialId ||
        props.publicKey ||
        props.privateKey ||
        props.algorithm ||
        props.transports?.length ||
        props.signCount ||
        props.source,
    ),
  );
  const [passkey, setPasskey] = useState<PasskeyState>({
    relyingPartyId: props.relyingPartyId ?? "",
    relyingPartyName: props.relyingPartyName ?? "",
    userName: props.userName ?? "",
    userDisplayName: props.userDisplayName ?? "",
    userHandle: props.userHandle ?? "",
    credentialId: props.credentialId ?? "",
    publicKey: props.publicKey ?? "",
    privateKey: props.privateKey ?? "",
    algorithm: props.algorithm ?? "",
    transports: props.transports ?? [],
    backupEligible: props.backupEligible ?? false,
    backupState: props.backupState ?? false,
    signCount: props.signCount ?? 0,
    createdAt: props.createdAt,
    lastUsedAt: props.lastUsedAt,
    source: props.source,
  });

  useEffect(() => {
    setPasskey({
      relyingPartyId: props.relyingPartyId ?? "",
      relyingPartyName: props.relyingPartyName ?? "",
      userName: props.userName ?? "",
      userDisplayName: props.userDisplayName ?? "",
      userHandle: props.userHandle ?? "",
      credentialId: props.credentialId ?? "",
      publicKey: props.publicKey ?? "",
      privateKey: props.privateKey ?? "",
      algorithm: props.algorithm ?? "",
      transports: props.transports ?? [],
      backupEligible: props.backupEligible ?? false,
      backupState: props.backupState ?? false,
      signCount: props.signCount ?? 0,
      createdAt: props.createdAt,
      lastUsedAt: props.lastUsedAt,
      source: props.source,
    });
    didMount.current = false;
  }, [props.id]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: PasskeyModuleType = {
        id: props.id,
        module: props.module,
        ...passkey,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [passkey]);

  const transportText = useMemo(
    () => passkey.transports.join(", "),
    [passkey.transports],
  );

  const changeField =
    (field: keyof PasskeyState) =>
    (value: string) => {
      setPasskey((current) => ({ ...current, [field]: value }));
    };

  const input = (
    field: keyof PasskeyState,
    label: string,
    options: { autoFocus?: boolean; multiline?: boolean; sensitive?: boolean } = {},
  ) => {
    const value = passkey[field];
    const textValue = Array.isArray(value) ? value.join(", ") : String(value ?? "");

    return (
      <View
        style={[
          moduleFormStyles.inputShell,
          options.multiline ? { height: "auto", minHeight: 88 } : null,
        ]}
      >
        <TextInput
          autoFocus={props.autoFocus !== false && options.autoFocus}
          outlineStyle={globalStyles.outlineStyle}
          style={[
            globalStyles.textInputStyle,
            moduleFormStyles.input,
            options.multiline ? { minHeight: 88 } : null,
          ]}
          contentStyle={{ textAlignVertical: options.multiline ? "top" : "center" }}
          value={textValue}
          placeholder={label}
          mode="outlined"
          multiline={options.multiline}
          secureTextEntry={options.sensitive}
          onChangeText={(text) => {
            if (field === "transports") {
              setPasskey((current) => ({
                ...current,
                transports: normalizeTransports(text),
              }));
              return;
            }
            if (field === "signCount") {
              const signCount = Math.min(0xffffffff, Math.max(0, Number.parseInt(text || "0", 10) || 0));
              setPasskey((current) => ({ ...current, signCount }));
              return;
            }
            changeField(field)(text);
          }}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    );
  };

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:passkey")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.PASSKEY]}
      fastAccess={props.fastAccess}
    >
      <View style={{ gap: 8 }}>
        <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
          {input("relyingPartyId", t("modules:passkeyRpId"), {
            autoFocus: !passkey.relyingPartyId && !passkey.relyingPartyName,
          })}
          {input("relyingPartyName", t("modules:passkeyRpName"))}
        </View>

        <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
          {input("userName", t("modules:passkeyUserName"))}
          {input("userDisplayName", t("modules:passkeyUserDisplayName"))}
        </View>

        {expanded ? (
          <>
            <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
              {input("credentialId", t("modules:passkeyCredentialId"))}
              <CopyToClipboard
                value={passkey.credentialId}
                disabled={!passkey.credentialId}
                sensitive
              />
            </View>

            <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
              {input("userHandle", t("modules:passkeyUserHandle"))}
              <CopyToClipboard
                value={passkey.userHandle}
                disabled={!passkey.userHandle}
                sensitive
              />
            </View>

            <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
              {input("algorithm", t("modules:passkeyAlgorithm"))}
              {input("transports", t("modules:passkeyTransports"))}
            </View>

            <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
              {input("signCount", t("modules:passkeySignCount"))}
            </View>

            <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
              {input("publicKey", t("modules:passkeyPublicKey"), {
                multiline: true,
              })}
              <CopyToClipboard
                value={passkey.publicKey}
                disabled={!passkey.publicKey}
                sensitive
              />
            </View>

            <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
              {input("privateKey", t("modules:passkeyPrivateKey"), {
                multiline: true,
                sensitive: true,
              })}
              <CopyToClipboard
                value={passkey.privateKey}
                disabled={!passkey.privateKey}
                sensitive
                confirmTitle={t("modules:passkeyPrivateKey")}
                confirmMessage={t("modules:passkeyCopyPrivateKeyWarning")}
              />
            </View>

            <View style={[globalStyles.moduleView, moduleFormStyles.row]}>
              {input("source", t("modules:passkeySource"))}
            </View>

            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Switch
                  value={passkey.backupEligible}
                  onValueChange={(value) =>
                    setPasskey((current) => ({
                      ...current,
                      backupEligible: value,
                    }))
                  }
                />
                <Text style={{ color: theme.colors.onSurface }}>
                  {t("modules:passkeyBackupEligible")}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Switch
                  value={passkey.backupState}
                  onValueChange={(value) =>
                    setPasskey((current) => ({
                      ...current,
                      backupState: value,
                    }))
                  }
                />
                <Text style={{ color: theme.colors.onSurface }}>
                  {t("modules:passkeyBackupState")}
                </Text>
              </View>
            </View>
          </>
        ) : null}

        <Text variant="bodySmall" style={{ opacity: 0.7 }}>
          {transportText
            ? t("modules:passkeyHelpWithTransports", { transports: transportText })
            : t("modules:passkeyHelp")}
        </Text>

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
              ? t("modules:passkeyShowLess")
              : t("modules:passkeyShowMore")}
          </Button>
        </View>
      </View>
    </ModuleContainer>
  );
}

export default PasskeyModule;
