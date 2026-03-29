import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Keyboard } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Dropdown, DropdownInputProps } from "react-native-paper-dropdown";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
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
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const OPTIONS = [
    { label: "WPA", value: "WPA" },
    { label: "WEP", value: "WEP" },
    { label: t("modules:wifiOpen"), value: "blank" },
  ];
  const HIDDEN_OPTIONS = [
    { label: t("common:none"), value: "visible" },
    { label: t("modules:wifiHidden"), value: "hidden" },
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

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);

  const [name, setName] = useState(props.wifiName);
  const [value, setValue] = useState(props.value);
  const [hidden, setHidden] = useState(props.hidden ?? false);

  const [wifiType, setWifiType] = useState<"WPA" | "WEP" | "blank">(
    props.wifiType,
  );

  const [eyeIcon, setEyeIcon] = useState("eye");

  useEffect(() => {
    if (secureTextEntry) {
      setEyeIcon("eye");
    } else {
      setEyeIcon("eye-off");
    }
  }, [secureTextEntry]);

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
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              paddingLeft: 0,
            },
          ]}
        >
          <View
            style={{
              height: 40,
              width: 110,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
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
              options={OPTIONS}
              value={wifiType}
              onSelect={(value?: string) => {
                if (value === "WPA" || value === "WEP" || value === "blank") {
                  setWifiType(value);
                }
              }}
            />
          </View>
          <View style={{ width: 8 }} />
          <View
            style={{
              height: 40,
              width: 200,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
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
              options={HIDDEN_OPTIONS}
              value={hidden ? "hidden" : "visible"}
              onSelect={(next?: string) => {
                if (next === "hidden") {
                  setHidden(true);
                  return;
                }
                if (next === "visible") {
                  setHidden(false);
                }
              }}
            />
          </View>
          <View style={{ width: 8 }} />
          <View
            style={{
              flex: 1,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
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
                  icon={eyeIcon}
                  color={theme.colors.primary}
                  onPress={() => {
                    Keyboard.dismiss();
                    setSecureTextEntry(!secureTextEntry);
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
    </ModuleContainer>
  );
}

export default WifiModule;
