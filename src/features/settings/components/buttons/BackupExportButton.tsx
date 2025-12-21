import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useTranslation } from "react-i18next";

import { encrypt } from "../../../../infrastructure/crypto/CryptoLayer";
import { logger } from "../../../../infrastructure/logging/logger";
import SettingsItem from "../SettingsItem";

import { useAuth } from "../../../../app/providers/AuthProvider";
import { useVault } from "../../../../app/providers/VaultProvider";

function BackupExportButton() {
  const { t } = useTranslation();
  const auth = useAuth();
  const vault = useVault();

  const exportBackup = async () => {
    try {
      if (!vault.isUnlocked) {
        logger.warn("[BackupExport] Vault is locked – cannot export backup.");
        return;
      }

      const master = auth.master;
      if (!master) {
        logger.warn("[BackupExport] No master password in session.");
        return;
      }

      const fullData = vault.exportFullData();
      const backupData = await encrypt(fullData, master);

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
          logger.warn("[BackupExport] Save canceled.");
          return;
        }

        const tauriFs = require("@tauri-apps/plugin-fs");
        await tauriFs.writeTextFile(filePath, contents);
      } else {
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
      logger.error("[BackupExport] Fehler beim Erstellen des Backups:", error);
    }
  };

  return (
    <SettingsItem leadingIcon="database-export" onPress={exportBackup}>
      {t("settings:exportBackup")}
    </SettingsItem>
  );
}

export default BackupExportButton;
