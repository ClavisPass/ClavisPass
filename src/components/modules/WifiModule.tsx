import React, { useEffect, useRef, useState } from "react";
import { View, Keyboard } from "react-native";
import { IconButton, TextInput } from "react-native-paper";

import WifiModuleType from "../../types/modules/WifiModuleType";
import CopyToClipboard from "../buttons/CopyToClipboard";
import ModuleContainer from "../container/ModuleContainer";
import Props from "../../types/ModuleProps";
import WifiQRCodeModal from "../modals/WifiQRCodeModal";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";
import { Dropdown, DropdownInputProps } from "react-native-paper-dropdown";

function WifiModule(props: WifiModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const OPTIONS = [
    { label: "WPA", value: "WPA" },
    { label: "WEP", value: "WEP" },
    { label: "blank", value: "blank" },
  ];

  const CustomDropdownInput = ({
    selectedLabel,
    rightIcon,
  }: DropdownInputProps) => (
    <TextInput
      outlineStyle={[globalStyles.outlineStyle]}
      style={globalStyles.textInputStyle}
      mode="outlined"
      value={selectedLabel}
      right={rightIcon}
    />
  );

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);

  const [name, setName] = useState(props.wifiName);
  const [value, setValue] = useState(props.value);

  const [wifiType, setWifiType] = useState<"WPA" | "WEP" | "blank">(
    props.wifiType
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
        wifiType: wifiType,
        wifiName: name,
        value: value,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [wifiType, name, value]);
  return (
    <ModuleContainer
      id={props.id}
      title="Wifi"
      edit={props.edit}
      deletable={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.WIFI}
      fastAccess={props.fastAccess}
    >
      <View style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <View style={{ marginRight: 6, borderRadius: 12, overflow: "hidden" }}>
          <Dropdown
            CustomDropdownInput={CustomDropdownInput}
            menuContentStyle={{
              borderRadius: 12,
              backgroundColor: theme.colors.background,
              boxShadow: theme.colors.shadow,
              overflow: "hidden",
            }}
            mode={"flat"}
            hideMenuHeader={true}
            options={OPTIONS}
            value={wifiType}
            onSelect={(value?: string) => {
              if (value === "WPA" || value === "WEP" || value === "blank") {
                setWifiType(value);
              }
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
          <View style={{ width: 48 }}>
            <IconButton
              iconColor={theme.colors.primary}
              icon="qrcode"
              size={20}
              onPress={showModal}
            />
          </View>
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
      />
    </ModuleContainer>
  );
}

export default WifiModule;
