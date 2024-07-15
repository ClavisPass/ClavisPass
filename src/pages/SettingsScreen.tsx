import React, { useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Switch, Text } from "react-native-paper";
import SettingsItem from "../components/SettingsItem";
import { TitlebarHeight } from "../components/CustomTitlebar";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AnimatedContainer from "../components/AnimatedContainer";
import { useFocusEffect } from "@react-navigation/native";
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";
import WebSpecific from "../components/platformSpecific/WebSpecific";

const styles = StyleSheet.create({
  surface: {
    padding: 8,
    height: 80,
    width: "100%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  scrollView: {
    width: "100%",
  },
});

function SettingsScreen({ navigation }: { navigation: any }) {
  const [startup, setStartup] = React.useState(false);

  const changeAutoStart = async (startup: boolean) => {
    if (startup) {
      await enable();
      setStartup(true);
    } else {
      await disable();
      setStartup(false);
    }
  };

  const getAutoStart = async () => {
    const value = await isEnabled();
    setStartup(value);
  };

  useEffect(() => {
    getAutoStart();
  }, []);

  return (
    <AnimatedContainer
      style={{ marginTop: Constants.statusBarHeight }}
      useFocusEffect={useFocusEffect}
    >
      <StatusBar
        animated={true}
        style="dark"
        backgroundColor="transparent"
        translucent={true}
      />
      <TitlebarHeight />
      <ScrollView style={styles.scrollView}>
        <WebSpecific>
          <SettingsItem>
            <Text>Autostart</Text>
            <Switch
              value={startup}
              onValueChange={(checked) => {
                console.log(checked)
                changeAutoStart(checked);
              }}
            />
          </SettingsItem>
        </WebSpecific>
        <SettingsItem>
          <Text>Surface</Text>
        </SettingsItem>
        <SettingsItem>
          <Text>Surface</Text>
        </SettingsItem>
        <SettingsItem>
          <Text>Surface</Text>
        </SettingsItem>
        <SettingsItem>
          <Text>Surface</Text>
        </SettingsItem>
        <SettingsItem>
          <Text>Surface</Text>
        </SettingsItem>
        <SettingsItem>
          <Text>Surface</Text>
        </SettingsItem>
      </ScrollView>
    </AnimatedContainer>
  );
}

export default SettingsScreen;
