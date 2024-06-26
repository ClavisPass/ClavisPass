import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Surface, Switch, Text } from "react-native-paper";
import globalStyles from "../ui/globalStyles";
import SettingsItem from "../components/SettingsItem";
import { TitlebarHeight } from "../components/CustomTitlebar";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { appWindow } from "@tauri-apps/api/window";
import AnimatedContainer from "../components/AnimatedContainer";
import { useFocusEffect } from "@react-navigation/native";

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
  const [isSwitchOn, setIsSwitchOn] = React.useState(true);
  useEffect(() => {
    //appWindow.setContentProtected(isSwitchOn);
  }, [isSwitchOn]);
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
        <SettingsItem>
          <Text>Contentprotection</Text>
          <Switch
            value={isSwitchOn}
            onValueChange={() => {
              setIsSwitchOn(!isSwitchOn);
            }}
          />
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
        <SettingsItem>
          <Text>Surface</Text>
        </SettingsItem>
      </ScrollView>
    </AnimatedContainer>
  );
}

export default SettingsScreen;
