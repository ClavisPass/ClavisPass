import { Button } from "react-native-paper";
import TokenQRCodeModal from "../modals/TokenQRCodeModal";
import { useState } from "react";
import { useToken } from "../../contexts/TokenProvider";
import SettingsItem from "../items/SettingsItem";
import SettingsDivider from "../SettingsDivider";

function ShowQRCodeButton() {
  const { refreshToken } = useToken();
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  return (
    <>
      {refreshToken && (
        <>
          <SettingsItem leadingIcon={"qrcode"} onPress={() => setQrCodeVisible(true)}>Show QR-Code</SettingsItem>
          <TokenQRCodeModal
            visible={qrCodeVisible}
            setVisible={setQrCodeVisible}
          />
          <SettingsDivider />
        </>
      )}
    </>
  );
}

export default ShowQRCodeButton;
