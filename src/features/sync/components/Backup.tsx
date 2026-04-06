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

import { logger } from "../../../infrastructure/logging/logger";

import PasswordTextbox from "../../../shared/components/PasswordTextbox";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { useAuth } from "../../../app/providers/AuthProvider";

import * as DeviceStorageClient from "../../../infrastructure/cloud/clients/DeviceStorageClient";
import { useVault } from "../../../app/providers/VaultProvider";
import Button from "../../../shared/components/buttons/Button";
import BackupStateType from "../model/BackupStateType";
import { decryptVaultContent } from "../../../infrastructure/crypto/decryptVaultContent";

function Backup() {
  const { t } = useTranslation();

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

      setState({ status: "ready", content: result.content });
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

  const login = async (masterPassword: string, content: string) => {
    try {
      const decrypted = await decryptVaultContent(content, masterPassword);
      if (!decrypted.ok) {
        const failure = decrypted;
        throw failure.error ?? new Error(failure.reason);
      }

      vault.unlockWithDecryptedVault(decrypted.payload);
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

    const content = state.content;

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
          gap: 10,
          width: "100%",
        }}
      >
        <Text
          variant="headlineSmall"
          style={{ color: theme.colors.primary, textAlign: "center" }}
        >
          {t("login:backupTitle")}
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
            onSubmitEditing={() => void login(value, content)}
          />
        </Animated.View>

        <Button text={t("login:login")} onPress={() => void login(value, content)} />

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
        justifyContent: "center",
        backgroundColor: "transparent",
        width: "100%",
        paddingHorizontal: 6,
        paddingVertical: 20,
        gap: 14,
      }}
    >
      <Animated.View
        entering={FadeIn.duration(340).easing(transitionEasing)}
        layout={contentTransition}
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 320,
            gap: 7,
            alignItems: "center",
          }}
        >
          <Icon
            source="cloud-off"
            color={theme.colors.primary}
            size={44}
          />
          <Text
            variant="titleMedium"
            style={{ textAlign: "center", marginTop: 1 }}
          >
            {t("login:backupTitle")}
          </Text>
        </View>
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
        }}
      >
        <View
          style={{
            width: "92%",
            maxWidth: 380,
            alignSelf: "center",
          }}
        >
          {renderContent()}
        </View>
      </Animated.View>
    </View>
  );
}

export default Backup;
