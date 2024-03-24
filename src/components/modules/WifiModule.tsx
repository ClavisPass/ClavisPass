import React from "react";
import { StyleSheet, View } from "react-native";

import { IconButton, Text, TextInput } from "react-native-paper";

import WifiModuleType from "../../types/modules/WifiModuleType";
import ModuleContainer from "../ModuleContainer";
import { Picker } from "@react-native-picker/picker";

import { Keyboard } from "react-native";

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
});

function WifiModule(props: WifiModuleType) {
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

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
    <ModuleContainer title={"Wifi"}>
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
            style={{ flex: 1 }}
            value={name}
            mode="outlined"
            onChangeText={(text) => setName(text)}
          />
          <IconButton
            icon="qrcode"
            size={20}
            onPress={() => console.log("Pressed")}
          />
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <TextInput
            style={{ flex: 1 }}
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
          <IconButton
            icon="content-copy"
            size={20}
            onPress={() => console.log("Pressed")}
          />
        </View>
      </View>
    </ModuleContainer>
  );
}

export default WifiModule;
