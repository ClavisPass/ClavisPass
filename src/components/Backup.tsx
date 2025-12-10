import { useEffect, useRef, useState } from "react";
import CryptoType, { CryptoTypeSchema } from "../types/CryptoType";
import { ActivityIndicator, Icon, Text } from "react-native-paper";
import { View } from "react-native";
import PasswordTextbox from "./PasswordTextbox";
import Button from "./buttons/Button";
import { useTheme } from "../contexts/ThemeProvider";
import { useData } from "../contexts/DataProvider";
import { useAuth } from "../contexts/AuthProvider";
import { DataTypeSchema } from "../types/DataType";
import { decrypt } from "../utils/CryptoLayer";
import { formatDateTime } from "../utils/Timestamp";
import { logger } from "../utils/logger";

import * as DeviceStorageClient from "../api/DeviceStorageClient";
import { useTranslation } from "react-i18next";

function Backup() {
  const { t } = useTranslation();
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
      <Icon source="cloud-off-outline" color={theme.colors.primary} size={30} />

      {loading ? (
        <ActivityIndicator size={"large"} animating={true} />
      ) : parsedCryptoData ? (
        <>
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
            <Text>
              {t("login:backupTitle") +
                formatDateTime(parsedCryptoData.lastUpdated)}
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
        </>
      ) : (
        <>
          <Text>{t("login:noBackupFound")}</Text>
        </>
      )}
    </View>
  );
}

export default Backup;
