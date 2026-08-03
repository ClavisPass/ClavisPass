import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Button, Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../app/providers/AuthProvider";
import { useToken } from "../../app/providers/CloudProvider";
import { useTheme } from "../../app/providers/ThemeProvider";
import { useVault } from "../../app/providers/VaultProvider";
import { uploadRemoteVaultFile } from "../../infrastructure/cloud/clients/CloudStorageClient";
import { encryptVaultContent } from "../../infrastructure/crypto/encryptVaultContent";
import { logger } from "../../infrastructure/logging/logger";
import { getDateTime } from "../utils/Timestamp";
import {
  createVaultDeviceId,
  getDeviceDisplayName,
  getPlatformString,
} from "../../features/vault/utils/deviceInfo";
import { upsertVaultDevice } from "../../features/vault/utils/vaultDevices";
import Modal from "./modals/Modal";

const styles = StyleSheet.create({
  modal: {
    width: 340,
    maxWidth: "100%",
    padding: 16,
    gap: 12,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 4,
  },
  button: {
    borderRadius: 12,
  },
  pathBox: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});

const getFileName = (path: string) => {
  const normalized = path.replace(/\\/g, "/");
  return normalized.split("/").filter(Boolean).pop() ?? path;
};

function VaultFileOpenHandler() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const auth = useAuth();
  const vault = useVault();
  const { accessToken, ensureFreshAccessToken, provider, setSession } =
    useToken();
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const ignoredDuplicateRef = useRef<{ path: string; until: number } | null>(
    null,
  );

  const pendingFileName = useMemo(
    () => (pendingPath ? getFileName(pendingPath) : ""),
    [pendingPath],
  );

  useEffect(() => {
    if (Platform.OS !== "web") return;

    let unlisten: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      try {
        const { listen } = await import("@tauri-apps/api/event");
        unlisten = await listen<string>(
          "vault-file-open-requested",
          (event) => {
            const path = event.payload;
            if (!path || typeof path !== "string") return;

            const ignoredDuplicate = ignoredDuplicateRef.current;
            if (
              ignoredDuplicate?.path === path &&
              ignoredDuplicate.until > Date.now()
            ) {
              return;
            }

            setPendingPath((current) => (current === path ? current : path));
          },
        );

        if (cancelled) {
          unlisten?.();
        }
      } catch (error) {
        logger.warn(
          "[VaultFileOpenHandler] Failed to listen for file opens:",
          error,
        );
      }
    })();

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, []);

  const close = useCallback(() => {
    if (pendingPath) {
      ignoredDuplicateRef.current = {
        path: pendingPath,
        until: Date.now() + 5000,
      };
    }
    setPendingPath(null);
    setSaving(false);
  }, [pendingPath]);

  const switchToPendingVaultFile = useCallback(async () => {
    if (!pendingPath) return;

    await setSession({
      provider: "localFile",
      accessToken: pendingPath,
      refreshToken: pendingPath,
    });
    vault.lock();
    auth.logout();
    close();
  }, [auth, close, pendingPath, setSession, vault]);

  const saveCurrentVault = useCallback(async () => {
    if (!vault.isUnlocked) return;
    if (!provider)
      throw new Error("[VaultFileOpenHandler] No provider configured");

    const master = auth.getMaster();
    if (!master)
      throw new Error("[VaultFileOpenHandler] Missing master password");

    let tokenToUse = accessToken ?? "";
    if (provider !== "device") {
      tokenToUse = accessToken ?? (await ensureFreshAccessToken()) ?? "";
      if (!tokenToUse) {
        throw new Error("[VaultFileOpenHandler] Missing access token");
      }
    }

    const platform = await getPlatformString();
    const name = await getDeviceDisplayName();
    const deviceId = await createVaultDeviceId(name, platform);
    const iso = getDateTime();

    vault.update((draft) => {
      draft.devices = upsertVaultDevice(
        draft.devices,
        { id: deviceId, name, platform },
        iso,
      );
    });

    const payload = vault.exportFullData();
    const encrypted = await encryptVaultContent(payload, master, {
      lastUpdated: iso,
    });

    if (!encrypted.ok) {
      throw encrypted.error;
    }

    await uploadRemoteVaultFile({
      provider,
      accessToken: tokenToUse,
      remotePath: "clavispass.lock",
      content: encrypted.content,
    });

    vault.markSaved();
  }, [accessToken, auth, ensureFreshAccessToken, provider, vault]);

  const confirm = useCallback(async () => {
    if (!pendingPath) return;

    try {
      if (provider === "localFile" && accessToken === pendingPath) {
        close();
        return;
      }

      await switchToPendingVaultFile();
    } catch (error) {
      logger.error(
        "[VaultFileOpenHandler] Failed to switch vault file:",
        error,
      );
    }
  }, [accessToken, close, pendingPath, provider, switchToPendingVaultFile]);

  const saveAndConfirm = useCallback(async () => {
    if (!pendingPath) return;

    setSaving(true);
    try {
      await saveCurrentVault();
      await switchToPendingVaultFile();
    } catch (error) {
      logger.error(
        "[VaultFileOpenHandler] Failed to save before switching vault file:",
        error,
      );
      setSaving(false);
    }
  }, [pendingPath, saveCurrentVault, switchToPendingVaultFile]);

  if (!pendingPath) return null;

  return (
    <Modal visible={pendingPath !== null} onDismiss={close}>
      <View
        style={[
          styles.modal,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.outlineVariant,
            borderWidth: StyleSheet.hairlineWidth,
          },
        ]}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.icon,
              { backgroundColor: theme.colors.secondaryContainer },
            ]}
          >
            <Icon source="folder" size={22} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text variant="titleMedium">{t("login:openVaultFileTitle")}</Text>
            <Text variant="bodySmall" numberOfLines={1}>
              {pendingFileName}
            </Text>
          </View>
        </View>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {vault.dirty
            ? t("login:openVaultFileDirtyText")
            : t("login:openVaultFileText")}
        </Text>
        <View
          style={[
            styles.pathBox,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <Text
            variant="bodySmall"
            selectable
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {pendingPath}
          </Text>
        </View>
        <View style={styles.actions}>
          <Button disabled={saving} style={styles.button} onPress={close}>
            {t("common:cancel")}
          </Button>
          {vault.dirty && vault.isUnlocked && auth.getMaster() ? (
            <Button
              disabled={saving}
              loading={saving}
              mode="contained-tonal"
              style={styles.button}
              onPress={saveAndConfirm}
            >
              {t("login:openVaultFileSaveAction")}
            </Button>
          ) : null}
          <Button
            disabled={saving}
            mode="contained"
            style={styles.button}
            onPress={confirm}
          >
            {t("login:openVaultFileAction")}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

export default VaultFileOpenHandler;
