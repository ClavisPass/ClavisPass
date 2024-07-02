import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Menu, Modal, Portal } from "react-native-paper";
import ModulesEnum from "../../enums/ModulesEnum";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../../ui/linearGradient";
import QRCode from "react-qr-code";
import { BlurView } from "expo-blur";

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
  },
});

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  wifitype: string;
  wifiname: string;
  wifipassword: string;
};

function WifiQRCodeModal(props: Props) {
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
    <>
      <Portal>
        {props.visible ? (
          <BlurView
            intensity={20}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          ></BlurView>
        ) : null}
        <Modal
          visible={props.visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: "transparent",
            margin: 26,
            borderRadius: 20,
            display: "flex",
            alignSelf: "center",
            justifyContent: "center",
            width: 300,
            height: 300,
          }}
        >
          <LinearGradient
            colors={getColors()}
            style={{ padding: 6, borderRadius: 20 }}
            end={{ x: 0.1, y: 0.2 }}
            dither={true}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 20,
              }}
            >
              <QRCode
                size={256}
                style={{ height: "auto", width: "auto" }}
                value={value}
                viewBox="0 0 256 256"
              />
            </View>
          </LinearGradient>
        </Modal>
      </Portal>
    </>
  );
}

export default WifiQRCodeModal;
