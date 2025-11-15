import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../../ui/linearGradient";
import QRCode from "react-qr-code";
import Modal from "./Modal";
import { Portal } from "react-native-paper";

import { useTheme } from "../../contexts/ThemeProvider";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  wifitype: string;
  wifiname: string;
  wifipassword: string;
};

function WifiQRCodeModal(props: Props) {
  const { theme } = useTheme();
  const [value, setValue] = useState("");
  const hideModal = () => props.setVisible(false);

  useEffect(() => {
    const wifiString =
      "WIFI:S:" +
      props.wifiname +
      ";T:" +
      props.wifitype +
      ";P:" +
      props.wifipassword +
      ";;";
    setValue(wifiString);
  }, [props.wifitype, props.wifiname, props.wifipassword]);
  return (
    <Portal>
      <Modal visible={props.visible} onDismiss={hideModal}>
        <LinearGradient
          colors={getColors()}
          style={{
            padding: 6,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.outlineVariant,
          }}
          end={{ x: 0.1, y: 0.2 }}
          dither={true}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 12,
            }}
          >
            <QRCode
              size={200}
              style={{ height: "auto", width: "auto" }}
              value={value}
              viewBox="0 0 200 200"
            />
          </View>
        </LinearGradient>
      </Modal>
    </Portal>
  );
}

export default WifiQRCodeModal;
