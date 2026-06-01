import { Animated, View } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Icon, Text } from "react-native-paper";

import { useTheme } from "../../../app/providers/ThemeProvider";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useOnline } from "../../../app/providers/OnlineProvider";
import { useToken } from "../../../app/providers/CloudProvider";

import { getDateTime } from "../../../shared/utils/Timestamp";
import { uploadRemoteVaultFile } from "../../../infrastructure/cloud/clients/CloudStorageClient";
import { logger } from "../../../infrastructure/logging/logger";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";
import { useVault } from "../../../app/providers/VaultProvider";
import { upsertVaultDevice } from "../../vault/utils/vaultDevices";
import {
  createVaultDeviceId,
  getDeviceDisplayName,
  getPlatformString,
} from "../../vault/utils/deviceInfo";
import { encryptVaultContent } from "../../../infrastructure/crypto/encryptVaultContent";
import { useSetting } from "../../../app/providers/SettingsProvider";

type Props = {
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  refreshData: () => void;
};

const Sync = (props: Props) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { refreshing, setRefreshing, refreshData } = props;

  const auth = useAuth();
  const vault = useVault();

  const { isOnline } = useOnline();
  const { accessToken, provider, ensureFreshAccessToken } = useToken();
  const { value: autosaveDelaySeconds } = useSetting("AUTOSAVE_DELAY");

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const saveInFlightRef = useRef(false);
  const saveAgainAfterCurrentRef = useRef(false);
  const requestSaveRef = useRef<() => Promise<void>>(async () => {});
  const autosaveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const [autosaveRemaining, setAutosaveRemaining] = useState<number | null>(
    null,
  );

  const showSync = vault.dirty || refreshing;

  useEffect(() => {
    if (showSync) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 48,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [showSync, fadeAnim, slideAnim]);

  const cancelAutosaveCountdown = useCallback(() => {
    if (autosaveIntervalRef.current) {
      clearInterval(autosaveIntervalRef.current);
      autosaveIntervalRef.current = null;
    }
    setAutosaveRemaining(null);
  }, []);

  const saveOnce = useCallback(async () => {
    if (!vault.isUnlocked) return;

    if (!provider) throw new Error("[Sync] No provider configured");

    let tokenToUse = accessToken ?? "";
    if (provider !== "device") {
      tokenToUse = accessToken ?? (await ensureFreshAccessToken()) ?? "";
      if (!tokenToUse) {
        throw new Error("[Sync] Missing access token");
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

    const payloadRevision = vault.getRevision();
    const payload = vault.exportFullData();
    const master = auth.getMaster();
    if (!master)
      throw new Error("[Sync] Missing master password in auth context");

    const result = await encryptVaultContent(payload, master, {
      lastUpdated: iso,
    });

    if (!result.ok) {
      const failure = result;
      throw failure.error;
    }

    await uploadRemoteVaultFile({
      provider,
      accessToken: tokenToUse,
      remotePath: "clavispass.lock",
      content: result.content,
    });

    logger.info("[Sync] Remote vault upload completed.");

    return payloadRevision;
  }, [accessToken, auth, ensureFreshAccessToken, provider, vault]);

  const requestSave = useCallback(async () => {
    if (!vault.isUnlocked) return;

    if (saveInFlightRef.current) {
      saveAgainAfterCurrentRef.current = true;
      return;
    }

    saveInFlightRef.current = true;
    setRefreshing(true);
    cancelAutosaveCountdown();

    try {
      do {
        saveAgainAfterCurrentRef.current = false;

        const savedRevision = await saveOnce();
        const changedDuringSave = vault.getRevision() !== savedRevision;

        if (changedDuringSave) {
          saveAgainAfterCurrentRef.current = true;
        } else {
          vault.markSaved();
        }
      } while (saveAgainAfterCurrentRef.current);
    } catch (err) {
      logger.error("[Sync] Save failed:", err);
    } finally {
      saveInFlightRef.current = false;
      setRefreshing(false);
    }
  }, [cancelAutosaveCountdown, saveOnce, setRefreshing, vault]);

  useEffect(() => {
    requestSaveRef.current = requestSave;
  }, [requestSave]);

  useEffect(() => {
    const delay = Number(autosaveDelaySeconds ?? 0);

    if (!vault.dirty || delay <= 0 || refreshing) {
      cancelAutosaveCountdown();
      return;
    }

    cancelAutosaveCountdown();
    setAutosaveRemaining(delay);
    const interval = setInterval(() => {
      setAutosaveRemaining((current) => {
        if (current === null) return current;
        if (current <= 1) {
          clearInterval(interval);
          autosaveIntervalRef.current = null;
          void requestSaveRef.current();
          return null;
        }

        return current - 1;
      });
    }, 1000);
    autosaveIntervalRef.current = interval;

    return () => {
      clearInterval(interval);
      if (autosaveIntervalRef.current === interval) {
        autosaveIntervalRef.current = null;
      }
    };
  }, [
    autosaveDelaySeconds,
    cancelAutosaveCountdown,
    refreshing,
    vault.dirty,
    vault.revision,
  ]);

  const handleRefreshData = useCallback(() => {
    cancelAutosaveCountdown();
    refreshData();
  }, [cancelAutosaveCountdown, refreshData]);

  const shouldShowAutosaveCountdown =
    autosaveRemaining !== null && autosaveRemaining <= 5;
  const saveLabel =
    shouldShowAutosaveCountdown
      ? `${t("common:save")} (${autosaveRemaining}s)`
      : t("common:save");

  return (
    <Animated.View
      style={{
        height: slideAnim,
        opacity: fadeAnim,
        width: "100%",
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    >
      {showSync && (
        <View
          style={{
            height: 48,
            width: "100%",
            padding: 4,
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            {refreshing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                {isOnline ? (
                  <>
                    <View style={{ backgroundColor: "#00000017" }}>
                      <AnimatedPressable
                        onPress={() => {
                          void requestSave();
                        }}
                        style={{
                          height: 40,
                          width: 150,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          variant="bodyLarge"
                          style={{ color: "white", userSelect: "none" }}
                        >
                          {saveLabel}
                        </Text>
                      </AnimatedPressable>
                    </View>

                    <AnimatedPressable
                      onPress={handleRefreshData}
                      style={{
                        height: 40,
                        width: 110,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Text
                        variant="bodyLarge"
                        style={{ color: "white", userSelect: "none" }}
                      >
                        {t("common:reload")}
                      </Text>
                    </AnimatedPressable>
                  </>
                ) : (
                  <Icon source="cloud-off" color="white" size={20} />
                )}
              </>
            )}
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default Sync;
