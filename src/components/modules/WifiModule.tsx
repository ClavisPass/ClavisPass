import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useRef, useState } from "react";
import { View, Keyboard } from "react-native";
import { IconButton, TextInput } from "react-native-paper";

import WifiModuleType from "../../types/modules/WifiModuleType";
import CopyToClipboard from "../buttons/CopyToClipboard";
import ModuleContainer from "../container/ModuleContainer";
import Props from "../../types/ModuleProps";
import theme from "../../ui/theme";
import WifiQRCodeModal from "../modals/WifiQRCodeModal";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";

function WifiModule(props: WifiModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles } = useTheme();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);

  const [name, setName] = useState(props.wifiName);
  const [value, setValue] = useState(props.value);

  const [wifiType, setWifiType] = useState<"WEP" | "WPA" | "blank">(
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
      delete={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.WIFI}
    >
      <View style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Picker
          selectedValue={wifiType}
          onValueChange={(itemValue, itemIndex) => setWifiType(itemValue)}
          style={[globalStyles.outlineStyle, { padding: 10 }]}
        >
          <Picker.Item label="WEP" value="WEP" />
          <Picker.Item label="WPA" value="WPA" />
          <Picker.Item label="blank" value="blank" />
        </Picker>

        <View style={globalStyles.moduleView}>
          <TextInput
            placeholder="Wifi Name"
            outlineStyle={globalStyles.outlineStyle}
            style={globalStyles.textInputStyle}
            value={name}
            mode="outlined"
            onChangeText={(text) => setName(text)}
          />
          <IconButton
            iconColor={theme.colors.primary}
            icon="qrcode"
            size={20}
            onPress={showModal}
          />
        </View>
        <View style={globalStyles.moduleView}>
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
