import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Keyboard } from "react-native";
import {
  Button,
  IconButton,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import AdaptiveDropdown from "../../../../shared/components/dropdowns/AdaptiveDropdown";
import DropdownTextInputTrigger from "../../../../shared/components/dropdowns/DropdownTextInputTrigger";
import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import Modal from "../../../../shared/components/modals/Modal";
import { useExclusiveSecretReveal } from "../../../../shared/hooks/useExclusiveSecretReveal";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import Props from "../../model/ModuleProps";
import ModulesEnum from "../../model/ModulesEnum";
import WifiModuleType from "../../model/modules/WifiModuleType";
import ModuleContainer from "../ModuleContainer";
import WifiQRCodeModal from "../modals/WifiQRCodeModal";

function WifiModule(props: WifiModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const reveal = useExclusiveSecretReveal(`vault:${props.id}:wifi-password`);
  const secureTextEntry = !reveal.isRevealed;

  const OPTIONS = [
    { label: "WPA", value: "WPA" },
    { label: "WEP", value: "WEP" },
    { label: t("modules:wifiOpen"), value: "blank" },
  ];
  const HIDDEN_OPTIONS = [
    { label: t("common:none"), value: "visible" },
    { label: t("modules:wifiHidden"), value: "hidden" },
  ];

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    Keyboard.dismiss();
    setVisible(true);
  };

  const [name, setName] = useState(props.wifiName);
  const [value, setValue] = useState(props.value);
  const [hidden, setHidden] = useState(props.hidden ?? false);

  const [wifiType, setWifiType] = useState<"WPA" | "WEP" | "blank">(
    props.wifiType,
  );
  useEffect(() => {
    setName(props.wifiName);
  }, [props.wifiName]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setHidden(props.hidden ?? false);
  }, [props.hidden]);

  useEffect(() => {
    setWifiType(props.wifiType);
  }, [props.wifiType]);

  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    if (didMount.current) {
      const newModule: WifiModuleType = {
        id: props.id,
        module: props.module,
        wifiType,
        wifiName: name,
        value,
        hidden,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [wifiType, name, value, hidden]);
  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:wifi")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.WIFI]}
      fastAccess={props.fastAccess}
    >
      <View style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <View
          style={[
            globalStyles.moduleView,
            {
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingLeft: 0,
            },
          ]}
        >
          <View
            style={{
              height: 40,
              width: 136,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              style={{ borderRadius: 12, width: "100%" }}
              contentStyle={{ height: 40 }}
              mode="contained-tonal"
              textColor={theme.colors.primary}
              icon="qrcode"
              onPress={showModal}
            >
              QR Code
            </Button>
          </View>
          <View style={{ width: 8 }} />
          <IconButton
            icon="tune-variant"
            iconColor={theme.colors.primary}
            size={20}
            onPress={() => {
              Keyboard.dismiss();
              setSettingsVisible(true);
            }}
          />
        </View>

        <View style={globalStyles.moduleView}>
          <View style={{ height: 40, flex: 1 }}>
            <TextInput
              placeholder="Wifi Name"
              outlineStyle={globalStyles.outlineStyle}
              style={globalStyles.textInputStyle}
              value={name}
              mode="outlined"
              onChangeText={(text) => setName(text)}
            />
          </View>
          <CopyToClipboard value={name} />
        </View>
        <View style={globalStyles.moduleView}>
          <View style={{ height: 40, flex: 1 }}>
            <TextInput
              placeholder="Password"
              outlineStyle={globalStyles.outlineStyle}
              style={globalStyles.textInputStyle}
              value={value}
              mode="outlined"
              onChangeText={(text) => setValue(text)}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              right={
                <TextInput.Icon
                  animated
                  icon={secureTextEntry ? "eye" : "eye-off"}
                  color={theme.colors.primary}
                  onPress={() => {
                    Keyboard.dismiss();
                    reveal.toggle();
                  }}
                />
              }
            />
          </View>
          <CopyToClipboard value={value} />
        </View>
      </View>
      <WifiQRCodeModal
        visible={visible}
        setVisible={setVisible}
        wifiname={name}
        wifitype={wifiType}
        wifipassword={value}
        hidden={hidden}
      />
      <Portal>
        <Modal
          visible={settingsVisible}
          onDismiss={() => setSettingsVisible(false)}
        >
          <View
            style={{
              width: 300,
              padding: 14,
              gap: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.colors.outlineVariant,
              backgroundColor: theme.colors.background,
            }}
          >
            <Text variant="titleMedium">{t("modules:wifi")}</Text>

            <View style={{ gap: 8 }}>
              <Text variant="bodyMedium" style={{ opacity: 0.72 }}>
                {t("modules:wifiSecurity")}
              </Text>
              <AdaptiveDropdown
                options={OPTIONS}
                value={wifiType}
                setValue={(value) => {
                  if (value === "WPA" || value === "WEP" || value === "blank") {
                    setWifiType(value);
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
            </View>

            <View style={{ gap: 8 }}>
              <Text variant="bodyMedium" style={{ opacity: 0.72 }}>
                {t("modules:wifiVisibility")}
              </Text>
              <AdaptiveDropdown
                options={HIDDEN_OPTIONS}
                value={hidden ? "hidden" : "visible"}
                setValue={(next) => {
                  if (next === "hidden") {
                    setHidden(true);
                    return;
                  }
                  if (next === "visible") {
                    setHidden(false);
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
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Button
                mode="contained"
                style={{ borderRadius: 12 }}
                onPress={() => setSettingsVisible(false)}
              >
                {t("common:done")}
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </ModuleContainer>
  );
}

export default WifiModule;
