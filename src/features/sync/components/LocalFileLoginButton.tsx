import { Platform } from "react-native";
import { useTranslation } from "react-i18next";

import { useToken } from "../../../app/providers/CloudProvider";
import SettingsItem from "../../settings/components/SettingsItem";
import { logger } from "../../../infrastructure/logging/logger";
import { pickVaultFile } from "../../../infrastructure/cloud/clients/LocalFileClient";

function LocalFileLoginButton() {
  const { t } = useTranslation();
  const { setSession } = useToken();

  if (Platform.OS !== "web") return null;

  const handleSelectVault = async () => {
    try {
      const filePath = await pickVaultFile();
      if (!filePath) return;

      await setSession({
        provider: "localFile",
        accessToken: filePath,
        refreshToken: filePath,
      });
    } catch (error) {
      logger.error("[LocalFileLoginButton] Failed to select vault file:", error);
    }
  };

  return (
    <SettingsItem leadingIcon="folder" onPress={handleSelectVault}>
      {t("login:loadVault")}
    </SettingsItem>
  );
}

export default LocalFileLoginButton;
