import * as DocumentPicker from "expo-document-picker";
import { useTranslation } from "react-i18next";

import { logger } from "../../../../infrastructure/logging/logger";
import SettingsItem from "../SettingsItem";
import { useVault } from "../../../../app/providers/VaultProvider";
import { decryptVaultContent } from "../../../../infrastructure/crypto/decryptVaultContent";

function BackupImportButton() {
  const vault = useVault();
  const { t } = useTranslation();

  const importBackup = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
    });

    if (result.canceled || result.assets.length === 0) return;

    const fileData = await fetch(result.assets[0].uri).then((res) => res.text());

    // TODO bleibt: echtes Master-PW abfragen
    const masterPassword = "test";

    const decrypted = await decryptVaultContent(fileData, masterPassword);

    if (!decrypted.ok) {
      logger.error(
        "[BackupImport] Decryption failed:",
        decrypted.reason,
        decrypted.error
      );
      return;
    }

    vault.unlockWithDecryptedVault(decrypted.payload);
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
