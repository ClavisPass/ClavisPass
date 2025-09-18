import SettingsItem from "../items/SettingsItem";
import { encrypt } from "../../utils/CryptoLayer";
import { useData } from "../../contexts/DataProvider";
import { Platform } from "react-native";

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

function BackupExportButton() {
  const data = useData();

  const exportBackup = async () => {
    try {
      const backupData = await encrypt(data.data, "test");
      const contents = JSON.stringify(backupData);
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .replace("T", "_")
        .slice(0, 19);

      const fileName = `clavispass-backup_${timestamp}.json`;

      if (Platform.OS === "web") {
        const tauriDialog = require("@tauri-apps/plugin-dialog");
        const filePath = await tauriDialog.save({
          defaultPath: fileName,
          filters: [
            {
              name: "ClavisPass Backup",
              extensions: ["json"],
            },
          ],
        });

        if (!filePath) {
          console.log("Speichern abgebrochen.");
          return;
        }
        const tauriFs = require("@tauri-apps/plugin-fs");
        await tauriFs.writeTextFile(filePath, contents);
      }
      else{
        const fileUri = FileSystem.cacheDirectory + fileName;

        await FileSystem.writeAsStringAsync(fileUri, contents, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "ClavisPass Backup exportieren",
          UTI: "public.json",
        });
      }
    } catch (error) {
      console.error("Fehler beim Erstellen des Backups:", error);
    }
  };

  return (
    <SettingsItem leadingIcon="database-export" onPress={exportBackup}>
      Export Backup
    </SettingsItem>
  );
}

export default BackupExportButton;
