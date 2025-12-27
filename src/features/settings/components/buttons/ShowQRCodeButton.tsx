import TokenQRCodeModal from "../modals/TokenQRCodeModal";
import { useState } from "react";
import SettingsItem from "../SettingsItem";
import { useToken } from "../../../../app/providers/CloudProvider";
import { useTranslation } from "react-i18next";

function ShowQRCodeButton() {
  const { refreshToken } = useToken();
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const {t} = useTranslation();
  return (
    <>
      {refreshToken && (
        <>
          <SettingsItem
            leadingIcon={"qrcode"}
            onPress={() => setQrCodeVisible(true)}
          >
            {t("settings:showqrcode")}
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
