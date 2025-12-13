import { useEffect, useRef, useState } from "react";
import CryptoType, { CryptoTypeSchema } from "../../../infrastructure/crypto/CryptoType";
import { ActivityIndicator, Icon, Text } from "react-native-paper";
import { View } from "react-native";
import PasswordTextbox from "../../../shared/components/PasswordTextbox";
import Button from "../../../shared/components/buttons/Button";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { useData } from "../../../app/providers/DataProvider";
import { useAuth } from "../../../app/providers/AuthProvider";
import { DataTypeSchema } from "../../vault/model/DataType";
import { decrypt } from "../../../infrastructure/crypto/CryptoLayer";
import { logger } from "../../../infrastructure/logging/logger";

import * as DeviceStorageClient from "../../../infrastructure/clients/DeviceStorageClient";
import { useTranslation } from "react-i18next";
import { formatAbsoluteLocal } from "../../vault/utils/expiry";
import { useSetting } from "../../../app/providers/SettingsProvider";

function Backup() {
  const { t } = useTranslation();

  const { value: dateFormat } = useSetting("DATE_FORMAT");
  const { value: timeFormat } = useSetting("TIME_FORMAT");

  const [parsedCryptoData, setParsedCryptoData] = useState<CryptoType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  const auth = useAuth();
  const { theme } = useTheme();
  const { setData, setLastUpdated } = useData();

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
      if (!cryptoData) {
        return;
      }

      const lastUpdated = cryptoData.lastUpdated;
      const decryptedData = decrypt(cryptoData, masterPassword);
      const jsonData = JSON.parse(decryptedData);

      const parsedData = DataTypeSchema.parse(jsonData);
      setData(parsedData);
      setLastUpdated(lastUpdated);
      auth.login(masterPassword);
    } catch (error) {
      logger.error("[Backup] Error decrypting backup data:", error);
      textInputRef.current?.focus?.();
      setValue("");
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1000);
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
        <>
          <Text>{t("login:noBackupFound")}</Text>
        </>
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
      ></View>
    </View>
  );
}

export default Backup;
