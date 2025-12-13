import SettingsItem from "../../vault/components/items/SettingsItem";
import { decrypt } from "../../../infrastructure/crypto/CryptoLayer";
import { useData } from "../../../app/providers/DataProvider";
import { CryptoTypeSchema } from "../../../infrastructure/crypto/CryptoType";
import { DataTypeSchema } from "../../vault/model/DataType";

import * as DocumentPicker from "expo-document-picker";
import { useTranslation } from "react-i18next";
import { logger } from "../../../infrastructure/logging/logger";

function BackupImportButton() {
  const data = useData();
  const { t } = useTranslation();

  const importBackup = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });

      if (!result.canceled && result.assets.length > 0) {
        const fileData = await fetch(result.assets[0].uri).then((res) =>
          res.text()
        );

        const parsedCryptoData = CryptoTypeSchema.parse(JSON.parse(fileData));
        const decryptedData = decrypt(parsedCryptoData, "test");
        const jsonData = JSON.parse(decryptedData);

        const parsedData = DataTypeSchema.parse(jsonData);
        data.setData(parsedData);
        data.setLastUpdated(parsedCryptoData.lastUpdated);
        data.setShowSave(true);
      }
    } catch (error) {
      logger.error("Fehler beim Importieren des Backups:", error);
    }
  };

  return (
    <SettingsItem leadingIcon="database-import" onPress={importBackup}>
      {t("settings:importBackup")}
    </SettingsItem>
  );
}

export default BackupImportButton;
