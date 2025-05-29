import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';

import { Text, Button } from "react-native-paper";

// Expo Updates für Mobile
import * as Updates from 'expo-updates';
// Tauri Updater für Desktop
//import { checkUpdate, installUpdate } from '@tauri-apps/plugin-updater'; //TODO: Ensure this is installed in your Tauri project

const UpdateManager = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('Searching for updates...');

  useEffect(() => {
    if (Platform.OS === 'web') {
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
        setUpdateMessage('Update Available');
      }
    } catch (error) {
      setUpdateMessage('Error while checking for updates');
    }
  };

  const applyExpoUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      setUpdateMessage('Error while applying update');
    }
  };

  const checkTauriUpdate = async () => {
    try {
      //const { shouldUpdate } = await checkUpdate();
      /*if (shouldUpdate) {
        setUpdateAvailable(true);
        setUpdateMessage('Update Available');
      }*/
    } catch (error) {
      setUpdateMessage('Error while checking for updates');
      console.log("error", error);
    }
  };

  const applyTauriUpdate = async () => {
    try {
      //await installUpdate();
    } catch (error) {
      console.error(error);
      setUpdateMessage('Error while applying update');
    }
  };

  const applyUpdate = async () => {
    if (Platform.OS === 'web') {
      applyTauriUpdate();
    } else {
      applyExpoUpdate();
    }
  };


  return (
    <View style={{ padding: 20, width: "50%" }}>
      <Text>{updateMessage}</Text>
      {updateAvailable && (
        <Button mode='contained' onPress={applyUpdate}>Update</Button>
      )}
    </View>
  );
};

export default UpdateManager;