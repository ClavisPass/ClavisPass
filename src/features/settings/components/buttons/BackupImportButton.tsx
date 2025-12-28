import * as DocumentPicker from "expo-document-picker";
import { useTranslation } from "react-i18next";

import { CryptoTypeSchema } from "../../../../infrastructure/crypto/CryptoType";
import { VaultDataTypeSchema } from "../../../vault/model/VaultDataType";
import { decrypt } from "../../../../infrastructure/crypto/CryptoLayer";
import { logger } from "../../../../infrastructure/logging/logger";
import SettingsItem from "../SettingsItem";
import { useVault } from "../../../../app/providers/VaultProvider";

function BackupImportButton() {
  const vault = useVault();
  const { t } = useTranslation();

  const importBackup = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });

      if (result.canceled || result.assets.length === 0) return;

      const fileData = await fetch(result.assets[0].uri).then((res) =>
        res.text()
      );

      const parsedCryptoData = CryptoTypeSchema.parse(JSON.parse(fileData));

      // TODO: replace "test" with real master password prompt if this is production logic
      const decryptedData = decrypt(parsedCryptoData, "test");
      const jsonData = JSON.parse(decryptedData);

      const parsedData = VaultDataTypeSchema.parse(jsonData);
      if (!parsedData) {
        logger.error("[BackupImport] Parsed vault is null.");
        return;
      }

      vault.unlockWithDecryptedVault(parsedData);

      vault.update((draft) => {
        draft.version = draft.version;
      });
    } catch (error) {
      logger.error("Fehler beim Importieren des Backups:", error);
    }
  };

  return (
    <SettingsItem onPress={importBackup}>
      {t("settings:importBackup")}
    </SettingsItem>
  );
}

export default BackupImportButton;
