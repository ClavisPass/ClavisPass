import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../../ui/linearGradient";
import QRCode from "react-qr-code";
import Modal from "./Modal";
import { Portal } from "react-native-paper";
import { useToken } from "../../contexts/TokenProvider";
import { useEffect, useState } from "react";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

function TokenQRCodeModal(props: Props) {
  const { refreshToken } = useToken();
  const [value, setValue] = useState("");
  const hideModal = () => props.setVisible(false);
  useEffect(() => {
    if (refreshToken) {
      hideModal();
      setValue(refreshToken)
    }
    else{
      hideModal();
      setValue("")
    }
  }, [refreshToken]);
  return (
    <Portal>
      <Modal visible={props.visible} onDismiss={hideModal}>
        <LinearGradient
          colors={getColors()}
          style={{ padding: 6, borderRadius: 12 }}
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

export default TokenQRCodeModal;
