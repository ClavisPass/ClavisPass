import { useEffect, useState } from "react";
import { Linking, Platform, View } from "react-native";
import * as Updates from "expo-updates";
import type { Update as UpdateProp } from "@tauri-apps/plugin-updater";
import { ActivityIndicator, Button, Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../app/providers/ThemeProvider";
import {
  publishUpdateCheck,
  subscribeUpdateCheck,
  unsubscribeUpdateCheck,
} from "../../infrastructure/events/updateBus";
import { logger } from "../../infrastructure/logging/logger";
import {
  checkForDesktopUpdate,
  installDesktopUpdate,
} from "../utils/desktopUpdater";
import {
  checkMobileBinaryUpdate,
  type MobileBinaryUpdate,
} from "../utils/mobileUpdater";

const UpdateManager = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [getContentLength, setContentlength] = useState<number | undefined>(
    undefined,
  );
  const [downloaded, setDownloaded] = useState<number | undefined>(undefined);
  const [update, setUpdate] = useState<UpdateProp | null>(null);
  const [mobileBinaryUpdate, setMobileBinaryUpdate] =
    useState<MobileBinaryUpdate | null>(null);
  const [isApplyingUpdate, setIsApplyingUpdate] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web") {
      checkTauriUpdate();
    } else {
      checkMobileUpdates();
    }
  }, []);

  useEffect(() => {
    const handler = (nextUpdate: UpdateProp | null) => {
      setUpdate(nextUpdate);

      if (nextUpdate) {
        setUpdateAvailable(true);
        setUpdateMessage(t("settings:updateAvailable"));
        return;
      }

      setUpdateAvailable(false);
      setUpdateMessage(t("settings:noUpdatesAvailable"));
    };

    subscribeUpdateCheck(handler);
    return () => unsubscribeUpdateCheck(handler);
  }, [t]);

  const checkExpoUpdate = async () => {
    try {
      const updateResult = await Updates.checkForUpdateAsync();
      if (updateResult.isAvailable) {
        setUpdateAvailable(true);
        setUpdateMessage(t("settings:updateAvailable"));
      } else {
        setUpdateMessage(t("settings:noUpdatesAvailable"));
      }
    } catch (error) {
      setUpdateMessage(t("settings:updateCheckFailed"));
    }
  };

  const checkMobileUpdates = async () => {
    try {
      const nextMobileBinaryUpdate = await checkMobileBinaryUpdate(
        i18n.language,
      );

      if (nextMobileBinaryUpdate) {
        setMobileBinaryUpdate(nextMobileBinaryUpdate);
        setUpdateAvailable(true);
        setUpdateMessage(
          nextMobileBinaryUpdate.required
            ? t("settings:mobileUpdateRequiredTitle")
            : t("settings:mobileUpdateAvailable"),
        );

        return;
      }
    } catch (error) {
      logger.warn("Mobile binary update check failed:", error);
    }

    await checkExpoUpdate();
  };

  const applyExpoUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      setUpdateMessage(t("settings:updateInstallFailed"));
    }
  };

  const applyMobileBinaryUpdate = async () => {
    if (!mobileBinaryUpdate) return;

    try {
      await Linking.openURL(mobileBinaryUpdate.downloadUrl);
    } catch (error) {
      logger.error("Error while opening mobile update URL:", error);
      setUpdateMessage(t("settings:updateInstallFailed"));
    }
  };

  const checkTauriUpdate = async () => {
    try {
      const nextUpdate = await checkForDesktopUpdate();
      setUpdate(nextUpdate);
      publishUpdateCheck(nextUpdate);
      if (nextUpdate) {
        setUpdateAvailable(true);
        setUpdateMessage(t("settings:updateAvailable"));
      } else {
        setUpdateMessage(t("settings:noUpdatesAvailable"));
      }
    } catch (error) {
      setUpdateMessage(t("settings:updateCheckFailed"));
      logger.error("Error while checking for updates:", error);
    }
  };

  const applyTauriUpdate = async () => {
    try {
      if (!update) {
        return;
      }

      logger.info(
        `found update ${update.version} from ${update.date} with notes ${update.body}`,
      );
      let downloadedBytes = 0;
      await installDesktopUpdate(update, (event) => {
        switch (event.event) {
          case "Started":
            setContentlength(event.data.contentLength);
            logger.info(
              `started downloading ${event.data.contentLength} bytes`,
            );
            break;
          case "Progress":
            downloadedBytes += event.data.chunkLength;
            setDownloaded(downloadedBytes);
            logger.info(
              `downloaded ${downloadedBytes} from ${getContentLength}`,
            );
            break;
          case "Finished":
            logger.info("download finished");
            break;
        }
      });

      logger.info("update installed");
    } catch (error) {
      logger.error("Error while applying update:", error);
      setUpdateMessage(t("settings:updateInstallFailed"));
    }
  };

  const applyUpdate = async () => {
    if (isApplyingUpdate) return;

    setIsApplyingUpdate(true);
    setUpdateMessage(t("settings:installingUpdate"));

    try {
      if (mobileBinaryUpdate) {
        await applyMobileBinaryUpdate();
        return;
      }

      if (Platform.OS === "web") {
        await applyTauriUpdate();
      } else {
        await applyExpoUpdate();
      }
    } finally {
      setIsApplyingUpdate(false);
    }
  };

  useEffect(() => {
    if (update) {
      setUpdateAvailable(true);
      setUpdateMessage(t("settings:updateAvailable"));
    }
  }, [t, update]);

  if (!updateAvailable) return null;

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: theme.colors.secondaryContainer,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {isApplyingUpdate ? (
            <ActivityIndicator animating color={theme.colors.primary} />
          ) : (
            <Icon
              source={
                mobileBinaryUpdate?.required
                  ? "alert-circle"
                  : "tray-arrow-down"
              }
              size={24}
              color={
                mobileBinaryUpdate?.required
                  ? theme.colors.error
                  : theme.colors.primary
              }
            />
          )}
          <Text
            ellipsizeMode="clip"
            style={{
              color: mobileBinaryUpdate?.required
                ? theme.colors.error
                : theme.colors.primary,
            }}
          >
            {updateMessage}
          </Text>
        </View>
        <Button
          mode="contained-tonal"
          labelStyle={{ color: theme.colors.primary }}
          style={{
            borderRadius: 12,
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            minWidth: 150,
          }}
          onPress={applyUpdate}
          disabled={isApplyingUpdate}
          loading={isApplyingUpdate}
        >
          {mobileBinaryUpdate
            ? t("settings:mobileUpdateDownload")
            : t("settings:updateNow")}
        </Button>
      </View>
    </View>
  );
};

export default UpdateManager;
