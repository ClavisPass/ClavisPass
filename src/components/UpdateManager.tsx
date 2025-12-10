import { useEffect, useState } from "react";
import { Platform, View } from "react-native";

// Expo Updates für Mobile
import * as Updates from "expo-updates";
// Tauri Updater für Desktop
import { check, Update as UpdateProp } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { useTheme } from "../contexts/ThemeProvider";
import { Button, Icon, Text } from "react-native-paper";
import { logger } from "../utils/logger";

const UpdateManager = () => {
  const { theme } = useTheme();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(
    "Searching for updates..."
  );

  const [getContentLength, setContentlength] = useState<number | undefined>(
    undefined
  );
  const [downloaded, setDownloaded] = useState<number | undefined>(undefined);
  const [update, setUpdate] = useState<UpdateProp | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      checkTauriUpdate();
    } else {
      checkExpoUpdate();
    }
  }, []);

  const checkExpoUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setUpdateAvailable(true);
        setUpdateMessage("Update Available");
      } else {
        setUpdateMessage("No updates available");
      }
    } catch (error) {
      setUpdateMessage("Error while checking for updates");
    }
  };

  const applyExpoUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      setUpdateMessage("Error while applying update");
    }
  };

  const checkTauriUpdate = async () => {
    try {
      setUpdate(await check());
      if (update) {
        setUpdateAvailable(true);
        setUpdateMessage("Update Available");
      } else {
        setUpdateMessage("No updates available");
      }
    } catch (error) {
      setUpdateMessage("Error while checking for updates");
      logger.error("Error while checking for updates:", error);
    }
  };

  const applyTauriUpdate = async () => {
    try {
      if (update) {
        logger.info(
          `found update ${update.version} from ${update.date} with notes ${update.body}`
        );
        let downloaded = 0;
        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case "Started":
              setContentlength(event.data.contentLength);
              logger.info(
                `started downloading ${event.data.contentLength} bytes`
              );
              break;
            case "Progress":
              downloaded += event.data.chunkLength;
              setDownloaded(downloaded);
              logger.info(`downloaded ${downloaded} from ${getContentLength}`);
              break;
            case "Finished":
              logger.info("download finished");
              break;
          }
        });

        logger.info("update installed");
        await relaunch();
      }
    } catch (error) {
      logger.error("Error while applying update:", error);
      setUpdateMessage("Error while applying update");
    }
  };

  const applyUpdate = async () => {
    if (Platform.OS === "web") {
      applyTauriUpdate();
    } else {
      applyExpoUpdate();
    }
  };

  useEffect(() => {
    if (update) {
      setUpdateAvailable(true);
      setUpdateMessage("Update Available");
    }
  }, [update]);

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
          <Icon
            source={"tray-arrow-down"}
            size={24}
            color={theme.colors.primary}
          />
          <Text ellipsizeMode="clip" style={{ color: theme.colors.primary }}>
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
            paddingHorizontal: 18,
          }}
          onPress={applyUpdate}
        >
          Update
        </Button>
      </View>
    </View>
  );
};

export default UpdateManager;
