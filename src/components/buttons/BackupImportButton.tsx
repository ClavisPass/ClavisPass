import SettingsItem from "../items/SettingsItem";
import { decrypt } from "../../utils/CryptoLayer";
import { useData } from "../../contexts/DataProvider";
import { CryptoTypeSchema } from "../../types/CryptoType";
import { DataTypeSchema } from "../../types/DataType";

import * as DocumentPicker from "expo-document-picker";

function BackupImportButton() {
  const data = useData();

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
      console.error("Fehler beim Importieren des Backups:", error);
    }
  };

  return (
    <SettingsItem leadingIcon="database-import" onPress={importBackup}>
      Import Backup
    </SettingsItem>
  );
}

export default BackupImportButton;
