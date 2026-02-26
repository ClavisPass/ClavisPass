import { Animated, View } from "react-native";
import { useEffect, useRef } from "react";
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
import { getOrCreateDeviceId } from "../../../infrastructure/device/deviceId";
import {
  getDeviceDisplayName,
  getPlatformString,
} from "../../vault/utils/deviceInfo";

import { getCryptoProvider } from "../../../infrastructure/crypto/provider";
import { encryptVaultContent } from "../../../infrastructure/crypto/encryptVaultContent";

type Props = {
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  refreshData: () => void;
};

const Sync = (props: Props) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const auth = useAuth();
  const vault = useVault();

  const { isOnline } = useOnline();
  const { accessToken, provider } = useToken();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showSync = vault.dirty || props.refreshing;

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

  const save = async () => {
    if (!vault.isUnlocked) return;

    props.setRefreshing(true);

    try {
      if (!provider) throw new Error("[Sync] No provider configured");
      if (provider !== "device" && !accessToken)
        throw new Error("[Sync] Missing access token");

      const deviceId = await getOrCreateDeviceId();
      const platform = await getPlatformString();
      const name = await getDeviceDisplayName();
      const iso = getDateTime();

      // 1) Metadaten updaten
      vault.update((draft) => {
        draft.devices = upsertVaultDevice(
          draft.devices,
          { id: deviceId, name, platform },
          iso,
        );
      });

      // 2) Payload exportieren
      const payload = vault.exportFullData();

      // 3) Encrypt über deinen Layer
      const master = auth.getMaster();
      if (!master)
        throw new Error("[Sync] Missing master password in auth context");

      const result = await encryptVaultContent(
        payload,
        master,
        {
          mode: "legacy",
          lastUpdated: iso,
        },
      );

      if (!result.ok) {
        throw result.error;
      }

      const encryptedJson = result.content;

      // 4) Upload
      await uploadRemoteVaultFile({
        provider,
        accessToken: accessToken ?? "",
        remotePath: "clavispass.lock",
        content: encryptedJson,
        onCompleted: () => {
          logger.info("[Sync] Remote vault upload completed.");
          vault.markSaved();
          props.setRefreshing(false);
        },
      });
    } catch (err) {
      logger.error("[Sync] Save failed:", err);
      props.setRefreshing(false);
    }
  };

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
            {props.refreshing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                {isOnline ? (
                  <>
                    <View style={{ backgroundColor: "#00000017" }}>
                      <AnimatedPressable
                        onPress={save}
                        style={{
                          height: 40,
                          width: 130,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          variant="bodyLarge"
                          style={{ color: "white", userSelect: "none" }}
                        >
                          {t("common:save")}
                        </Text>
                      </AnimatedPressable>
                    </View>

                    <AnimatedPressable
                      onPress={props.refreshData}
                      style={{
                        height: 40,
                        width: 130,
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
