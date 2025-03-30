import { useEffect, useState } from 'react';
import { Platform, View, Text, Button } from 'react-native';

// Expo Updates für Mobile
import * as Updates from 'expo-updates';
// Tauri Updater für Desktop
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';

const UpdateManager = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

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
        setUpdateMessage('Ein Update ist verfügbar. Bitte aktualisieren.');
      }
    } catch (error) {
      setUpdateMessage('Fehler beim Überprüfen auf Updates');
    }
  };

  const applyExpoUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      setUpdateMessage('Fehler beim Anwenden des Updates');
    }
  };

  const checkTauriUpdate = async () => {
    try {
      const { shouldUpdate } = await checkUpdate();
      if (shouldUpdate) {
        setUpdateAvailable(true);
        setUpdateMessage('Ein Update ist verfügbar. Installiere...');
        await installUpdate();
      }
    } catch (error) {
      setUpdateMessage('Fehler beim Überprüfen auf Updates');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>{updateMessage}</Text>
      {updateAvailable && Platform.OS !== 'web' && (
        <Button title="Jetzt aktualisieren" onPress={applyExpoUpdate} />
      )}
    </View>
  );
};

export default UpdateManager;