import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import CryptoType, {
  CryptoTypeSchema,
} from "../../../infrastructure/crypto/CryptoType";
import { decrypt } from "../../../infrastructure/crypto/CryptoLayer";
import { VaultDataTypeSchema } from "../../vault/model/VaultDataType";
import { logger } from "../../../infrastructure/logging/logger";

import PasswordTextbox from "../../../shared/components/PasswordTextbox";
import Button from "../../../shared/components/buttons/Button";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { useAuth } from "../../../app/providers/AuthProvider";

import * as DeviceStorageClient from "../../../infrastructure/cloud/clients/DeviceStorageClient";
import { formatAbsoluteLocal } from "../../vault/utils/expiry";
import { useSetting } from "../../../app/providers/SettingsProvider";
import { useVault } from "../../../app/providers/VaultProvider";

function Backup() {
  const { t } = useTranslation();

  const { value: dateFormat } = useSetting("DATE_FORMAT");
  const { value: timeFormat } = useSetting("TIME_FORMAT");

  const [parsedCryptoData, setParsedCryptoData] = useState<CryptoType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  const auth = useAuth();
  const vault = useVault();

  const { theme } = useTheme();

  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState(false);
  const textInputRef = useRef<any>(null);
  const [value, setValue] = useState("");

  const fetchBackup = async () => {
    try {
      setLoading(true);
      const result = await DeviceStorageClient.fetchFile();

      if (!result) {
        setParsedCryptoData(null);
        return;
      }

      const parsed = CryptoTypeSchema.parse(JSON.parse(result));
      setParsedCryptoData(parsed);
    } catch (err) {
      logger.error("[Backup] Error loading local backup:", err);
      setParsedCryptoData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackup();
  }, []);

  const login = async (
    masterPassword: string,
    cryptoData: CryptoType | null
  ) => {
    try {
      if (!cryptoData) return;

      const decryptedData = decrypt(cryptoData, masterPassword);
      const jsonData = JSON.parse(decryptedData);

      const parsedData = VaultDataTypeSchema.parse(jsonData);
      if (!parsedData) {
        throw new Error("[Backup] Parsed vault is null (unexpected).");
      }

      vault.unlockWithDecryptedVault(parsedData);
      vault.markSaved();
      auth.login(masterPassword);
    } catch (err) {
      logger.error("[Backup] Error decrypting backup data:", err);
      textInputRef.current?.focus?.();
      setValue("");
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        width: "100%",
      }}
    >
      <View
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon
          source="cloud-off-outline"
          color={theme.colors.primary}
          size={50}
        />
      </View>

      {loading ? (
        <ActivityIndicator size={"large"} animating={true} />
      ) : parsedCryptoData ? (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
          }}
        >
          <Text variant="bodyLarge">{t("login:backupTitle")}</Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
            {formatAbsoluteLocal(
              parsedCryptoData.lastUpdated,
              dateFormat,
              timeFormat
            )}
          </Text>

          <View style={{ width: "100%" }}>
            <PasswordTextbox
              setCapsLock={setCapsLock}
              textInputRef={textInputRef}
              errorColor={error}
              autofocus
              setValue={setValue}
              value={value}
              placeholder={t("login:masterPassword")}
              onSubmitEditing={() => login(value, parsedCryptoData)}
            />
          </View>

          <Button
            text={t("login:login")}
            onPress={() => login(value, parsedCryptoData)}
          />

          {capsLock && (
            <Text style={{ color: theme.colors.primary, marginTop: 10 }}>
              {t("common:capsLockOn")}
            </Text>
          )}
        </View>
      ) : (
        <Text>{t("login:noBackupFound")}</Text>
      )}

      <View
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          flexGrow: 1,
          justifyContent: "flex-end",
          gap: 6,
        }}
      />
    </View>
  );
}

export default Backup;
