import { useEffect, useState } from "react";
import { Platform, View } from "react-native";

// Expo Updates für Mobile
import * as Updates from "expo-updates";
// Tauri Updater für Desktop
import { check, Update as UpdateProp } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import SettingsItem from "./items/SettingsItem";
import SettingsDivider from "./SettingsDivider";
import Button from "./buttons/Button";

const UpdateManager = () => {
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
      }
    } catch (error) {
      setUpdateMessage("Error while checking for updates");
      console.log("error", error);
    }
  };

  const applyTauriUpdate = async () => {
    try {
      if (update) {
        console.log(
          `found update ${update.version} from ${update.date} with notes ${update.body}`
        );
        let downloaded = 0;
        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case "Started":
              setContentlength(event.data.contentLength);
              console.log(
                `started downloading ${event.data.contentLength} bytes`
              );
              break;
            case "Progress":
              downloaded += event.data.chunkLength;
              setDownloaded(downloaded);
              console.log(`downloaded ${downloaded} from ${getContentLength}`);
              break;
            case "Finished":
              console.log("download finished");
              break;
          }
        });

        console.log("update installed");
        await relaunch();
      }
    } catch (error) {
      console.error(error);
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

  return (
    <View >
      <SettingsItem>{updateMessage}</SettingsItem>
      {updateAvailable && (
        <Button onPress={applyUpdate} text="Update"/>
      )}
      <SettingsDivider />
    </View>
  );
};

export default UpdateManager;
