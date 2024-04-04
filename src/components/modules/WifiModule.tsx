import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import { IconButton, Modal, Portal, Text, TextInput } from "react-native-paper";
import QRCode from "react-qr-code";

import WifiModuleType from "../../types/modules/WifiModuleType";
import CopyToClipboard from "../CopyToClipboard";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    width: "100%",
    flex: 1,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  textInput: {
    flex: 1,
    //backgroundColor: "fefefe",
    color: "white",
    //borderWidth: 1,
    fontSize: 15,
    //borderColor: "#444444",
    //padding: 2,
    //margin: 5,
    //width: 50,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#3a3a3a",
    //paddingHorizontal: 5,
  },
});

function WifiModule(props: WifiModuleType) {
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
    <ModuleContainer title="Wifi">
      <View style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Picker
          selectedValue={wifiType}
          onValueChange={(itemValue, itemIndex) => setWifiType(itemValue)}
        >
          <Picker.Item label="WEP" value="WEP" />
          <Picker.Item label="WPA" value="WPA" />
          <Picker.Item label="blank" value="blank" />
        </Picker>

        <View style={{ display: "flex", flexDirection: "row" }}>
          <TextInput
            outlineStyle={globalStyles.outlineStyle}
            style={globalStyles.textInputStyle}
            value={name}
            mode="outlined"
            onChangeText={(text) => setName(text)}
          />
          <IconButton icon="qrcode" size={20} onPress={showModal} />
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
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
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 6,
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <QRCode
            size={256}
            style={{ height: "auto" }}
            value="test"
            viewBox="0 0 256 256"
          />
        </Modal>
      </Portal>
    </ModuleContainer>
  );
}

export default WifiModule;
