import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import { IconButton, Modal, Portal, Text, TextInput } from "react-native-paper";
import QRCode from "react-qr-code";

import WifiModuleType from "../../types/modules/WifiModuleType";
import CopyToClipboard from "../CopyToClipboard";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";
import theme from "../../ui/theme";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../../ui/linearGradient";
import WifiQRCodeModal from "../modals/WifiQRCodeModal";

function WifiModule(props: WifiModuleType & Props) {
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [name, setName] = React.useState(props.wifiName);
  const [value, setValue] = React.useState(props.value);

  const [wifiType, setWifiType] = React.useState("WEP");

  const [eyeIcon, setEyeIcon] = React.useState("eye");

  React.useEffect(() => {
    if (secureTextEntry) {
      setEyeIcon("eye");
    } else {
      setEyeIcon("eye-off");
    }
  }, [secureTextEntry]);
  return (
    <ModuleContainer
      id={props.id}
      title="Wifi"
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      deleteModule={props.deleteModule}
    >
      <View style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Picker
          selectedValue={wifiType}
          onValueChange={(itemValue, itemIndex) => setWifiType(itemValue)}
        >
          <Picker.Item label="WEP" value="WEP" />
          <Picker.Item label="WPA" value="WPA" />
          <Picker.Item label="blank" value="blank" />
        </Picker>

        <View style={globalStyles.moduleView}>
          <TextInput
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
      <WifiQRCodeModal visible={visible} setVisible={setVisible} wifiname={name} wifitype={wifiType} wifipassword={value}/>
    </ModuleContainer>
  );
}

export default WifiModule;
