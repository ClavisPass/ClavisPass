import { useEffect, useRef, useState, useCallback } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button as RNPButton, Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import CryptoType, {
  CryptoTypeSchema,
} from "../../../infrastructure/crypto/CryptoType";
import { decrypt } from "../../../infrastructure/crypto/CryptoLayer";
import { VaultDataTypeSchema } from "../../vault/model/VaultDataType";
import { logger } from "../../../infrastructure/logging/logger";

import PasswordTextbox from "../../../shared/components/PasswordTextbox";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { useAuth } from "../../../app/providers/AuthProvider";

import * as DeviceStorageClient from "../../../infrastructure/cloud/clients/DeviceStorageClient";
import { useSetting } from "../../../app/providers/SettingsProvider";
import { useVault } from "../../../app/providers/VaultProvider";
import { formatAbsoluteLocal } from "../../../shared/utils/Timestamp";
import Button from "../../../shared/components/buttons/Button";
import BackupStateType from "../model/BackupStateType";

function Backup() {
  const { t } = useTranslation();

  const { value: dateFormat } = useSetting("DATE_FORMAT");
  const { value: timeFormat } = useSetting("TIME_FORMAT");

  const auth = useAuth();
  const vault = useVault();
  const { theme } = useTheme();

  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState(false);
  const textInputRef = useRef<any>(null);
  const [value, setValue] = useState("");

  const [state, setState] = useState<BackupStateType>({ status: "loading" });

  const fetchBackup = useCallback(async () => {
    try {
      setState({ status: "loading" });

      const result = await DeviceStorageClient.fetchFile();

      if (result.status === "not_found") {
        setState({ status: "empty" });
        return;
      }

      if (result.status === "error") {
        logger.warn("[Backup] Local backup fetch error:", result.message, result.cause);
        setState({
          status: "error",
          message: t("login:backupLoadFailed") ?? "Could not load backup.",
        });
        return;
      }

      const parsed = CryptoTypeSchema.parse(JSON.parse(result.content));
      setState({ status: "ready", crypto: parsed });
    } catch (err) {
      logger.error("[Backup] Error loading local backup:", err);
      setState({
        status: "error",
        message: t("login:backupLoadFailed") ?? "Could not load backup.",
      });
    }
  }, [t]);

  useEffect(() => {
    fetchBackup();
  }, [fetchBackup]);

  const login = async (masterPassword: string, cryptoData: CryptoType) => {
    try {
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

  const renderContent = () => {
    if (state.status === "loading") {
      return <ActivityIndicator size={"large"} animating={true} />;
    }

    if (state.status === "error") {
      return (
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text style={{ textAlign: "center" }}>{state.message}</Text>
          <RNPButton mode="outlined" onPress={fetchBackup}>{t("common:retry")}</RNPButton>
        </View>
      );
    }

    if (state.status === "empty") {
      return <Text>{t("login:noBackupFound")}</Text>;
    }

    const crypto = state.crypto;

    return (
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
          {formatAbsoluteLocal(crypto.lastUpdated, dateFormat, timeFormat)}
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
            onSubmitEditing={() => login(value, crypto)}
          />
        </View>

        <Button text={t("login:login")} onPress={() => login(value, crypto)} />

        {capsLock && (
          <Text style={{ color: theme.colors.primary, marginTop: 10 }}>
            {t("common:capsLockOn")}
          </Text>
        )}
      </View>
    );
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
          source="cloud-off"
          color={theme.colors.primary}
          size={50}
        />
      </View>

      {renderContent()}

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
