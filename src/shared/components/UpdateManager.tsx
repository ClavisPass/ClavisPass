import { useEffect, useState } from "react";
import { Linking, Platform, View } from "react-native";
import * as Updates from "expo-updates";
import type { Update as UpdateProp } from "@tauri-apps/plugin-updater";
import { ActivityIndicator, Button, Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { shouldUseDesktopUpdater } from "../utils/distribution";
import {
  checkMobileBinaryUpdate,
  type MobileBinaryUpdate,
} from "../utils/mobileUpdater";

function formatUpdateErrorMessage(fallback: string, error: unknown) {
  if (error instanceof Error && error.message) {
    return `${fallback}: ${error.message}`;
  }

  if (typeof error === "string" && error.length > 0) {
    return `${fallback}: ${error}`;
  }

  return fallback;
}

const UpdateManager = () => {
  const { theme } = useTheme();
  const { t, i18n, ready } = useTranslation("settings");
  const insets = useSafeAreaInsets();
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
    if (!ready) return;

    if (Platform.OS === "web") {
      if (!shouldUseDesktopUpdater()) {
        return;
      }

      checkTauriUpdate();
    } else {
      checkMobileUpdates();
    }
  }, [ready]);

  useEffect(() => {
    if (!ready) return;

    const handler = (nextUpdate: UpdateProp | null) => {
      setUpdate(nextUpdate);

      if (nextUpdate) {
        setUpdateAvailable(true);
        setUpdateMessage(t("updateAvailable"));
        return;
      }

      setUpdateAvailable(false);
      setUpdateMessage(t("noUpdatesAvailable"));
    };

    subscribeUpdateCheck(handler);
    return () => unsubscribeUpdateCheck(handler);
  }, [ready, t]);

  const checkExpoUpdate = async () => {
    try {
      const updateResult = await Updates.checkForUpdateAsync();
      if (updateResult.isAvailable) {
        setUpdateAvailable(true);
        setUpdateMessage(t("updateAvailable"));
      } else {
        setUpdateMessage(t("noUpdatesAvailable"));
      }
    } catch (error) {
      setUpdateMessage(t("updateCheckFailed"));
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
          nextMobileBinaryUpdate.message ??
            (nextMobileBinaryUpdate.required
              ? t("mobileUpdateRequiredTitle")
              : t("mobileUpdateAvailable")),
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
      setUpdateMessage(t("updateInstallFailed"));
    }
  };

  const applyMobileBinaryUpdate = async () => {
    if (!mobileBinaryUpdate) return;

    try {
      await Linking.openURL(mobileBinaryUpdate.downloadUrl);
    } catch (error) {
      logger.error("Error while opening mobile update URL:", error);
      setUpdateMessage(t("updateInstallFailed"));
    }
  };

  const checkTauriUpdate = async () => {
    try {
      const nextUpdate = await checkForDesktopUpdate();
      setUpdate(nextUpdate);
      publishUpdateCheck(nextUpdate);
      if (nextUpdate) {
        setUpdateAvailable(true);
        setUpdateMessage(t("updateAvailable"));
      } else {
        setUpdateMessage(t("noUpdatesAvailable"));
      }
    } catch (error) {
      setUpdateMessage(t("updateCheckFailed"));
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
      setUpdateMessage(
        formatUpdateErrorMessage(t("updateInstallFailed"), error),
      );
    }
  };

  const applyUpdate = async () => {
    if (isApplyingUpdate) return;

    setIsApplyingUpdate(true);
    setUpdateMessage(t("installingUpdate"));

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
      setUpdateMessage(t("updateAvailable"));
    }
  }, [t, update]);

  if (!updateAvailable) return null;

  const bottomInset = Platform.OS === "android" ? Math.max(insets.bottom, 8) : 0;

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: theme.colors.background,
        paddingBottom: bottomInset,
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
            ? t("mobileUpdateDownload")
            : t("updateNow")}
        </Button>
      </View>
    </View>
  );
};

export default UpdateManager;
