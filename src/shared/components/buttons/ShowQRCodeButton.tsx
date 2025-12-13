import TokenQRCodeModal from "../modals/TokenQRCodeModal";
import { useState } from "react";
import SettingsItem from "../../../features/vault/components/items/SettingsItem";
import { useToken } from "../../../app/providers/CloudProvider";

function ShowQRCodeButton() {
  const { refreshToken } = useToken();
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  return (
    <>
      {refreshToken && (
        <>
          <SettingsItem
            leadingIcon={"qrcode"}
            onPress={() => setQrCodeVisible(true)}
          >
            Show QR-Code
          </SettingsItem>
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
