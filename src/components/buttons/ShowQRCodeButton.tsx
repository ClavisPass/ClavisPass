import { Button } from "react-native-paper";
import TokenQRCodeModal from "../modals/TokenQRCodeModal";
import { useState } from "react";
import { useToken } from "../../contexts/TokenProvider";

function ShowQRCodeButton() {
  const { token, setToken } = useToken();
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  return (
    <>
      {token && (
        <>
          <Button icon={"qrcode"} onPress={() => setQrCodeVisible(true)}>
            Show QR-Code
          </Button>
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
