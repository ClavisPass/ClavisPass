import TokenQRCodeModal from "../modals/TokenQRCodeModal";
import { useState } from "react";
import SettingsItem from "../SettingsItem";
import { useToken } from "../../../../app/providers/CloudProvider";
import { useTranslation } from "react-i18next";
import SettingsDivider from "../SettingsDivider";
import { useDevMode } from "../../../../app/providers/DevModeProvider";

function ShowQRCodeButton() {
  const { refreshToken } = useToken();
  const { devMode } = useDevMode();
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const {t} = useTranslation();

  if (!devMode) return null;

  return (
    <>
      {refreshToken && (
        <>
        <SettingsDivider />
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
