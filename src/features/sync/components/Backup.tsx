import { useEffect, useRef, useState, useCallback } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button as RNPButton, Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import CryptoType, {
  CryptoTypeSchema,
} from "../../../infrastructure/crypto/legacy/CryptoType";
import { decrypt } from "../../../infrastructure/crypto/legacy/CryptoLayer";
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
  const transitionEasing = Easing.bezier(0.22, 1, 0.36, 1);
  const contentTransition = LinearTransition.duration(320).easing(transitionEasing);

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

  const stageKey = state.status;

  const renderContent = () => {
    if (state.status === "loading") {
      return (
        <Animated.View
          key="loading"
          entering={FadeIn.duration(280).easing(transitionEasing)}
          exiting={FadeOut.duration(220).easing(transitionEasing)}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 148,
          }}
        >
          <ActivityIndicator size={"large"} animating={true} />
        </Animated.View>
      );
    }

    if (state.status === "error") {
      return (
        <Animated.View
          key="error"
          entering={FadeInDown.duration(320).easing(transitionEasing)}
          exiting={FadeOut.duration(220).easing(transitionEasing)}
          layout={contentTransition}
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
        </Animated.View>
      );
    }

    if (state.status === "empty") {
      return (
        <Animated.View
          key="empty"
          entering={FadeInDown.duration(320).easing(transitionEasing)}
          exiting={FadeOut.duration(220).easing(transitionEasing)}
          layout={contentTransition}
          style={{
            width: "100%",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text style={{ textAlign: "center", opacity: 0.78 }}>
            {t("login:noBackupFound")}
          </Text>
        </Animated.View>
      );
    }

    const crypto = state.crypto;

    return (
      <Animated.View
        key="ready"
        entering={FadeInDown.duration(320).easing(transitionEasing)}
        exiting={FadeOut.duration(220).easing(transitionEasing)}
        layout={contentTransition}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
        }}
      >
        <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
          {formatAbsoluteLocal(crypto.lastUpdated, dateFormat, timeFormat)}
        </Text>

        <Animated.View layout={contentTransition} style={{ width: "100%" }}>
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
        </Animated.View>

        <Button text={t("login:login")} onPress={() => login(value, crypto)} />

        {capsLock && (
          <Animated.View layout={contentTransition}>
            <Text style={{ color: theme.colors.primary, marginTop: 10 }}>
              {t("common:capsLockOn")}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
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
      <Animated.View
        entering={FadeIn.duration(340).easing(transitionEasing)}
        layout={contentTransition}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          width: "100%",
          flexGrow: 1,
        }}
      >
        <Icon
          source="cloud-off"
          color={theme.colors.primary}
          size={50}
        />
        <Text variant="titleMedium" style={{ textAlign: "center" }}>
          {t("login:backupTitle")}
        </Text>
      </Animated.View>

      <Animated.View
        key={stageKey}
        entering={FadeInDown.delay(60).duration(340).easing(transitionEasing)}
        exiting={FadeOut.duration(220).easing(transitionEasing)}
        layout={contentTransition}
        style={{
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          minHeight: 170,
        }}
      >
        {renderContent()}
      </Animated.View>

      <View style={{ width: "100%", flexGrow: 1 }} />
    </View>
  );
}

export default Backup;
