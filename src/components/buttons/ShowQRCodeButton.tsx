import { Button } from "react-native-paper";
import TokenQRCodeModal from "../modals/TokenQRCodeModal";
import { useState } from "react";
import { useToken } from "../../contexts/TokenProvider";
import SettingsItem from "../items/SettingsItem";

function ShowQRCodeButton() {
  const { token, setToken } = useToken();
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  return (
    <>
      {token && (
        <>
          <SettingsItem leadingIcon={"qrcode"} onPress={() => setQrCodeVisible(true)}>Show QR-Code</SettingsItem>
          <TokenQRCodeModal
            visible={qrCodeVisible}
            setVisible={setQrCodeVisible}
          />
        </>
      )}
    </>
  );
}

export default ShowQRCodeButton;
