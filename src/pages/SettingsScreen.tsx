import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Surface, Text } from "react-native-paper";
import globalStyles from "../ui/globalStyles";
import SettingsItem from "../components/SettingsItem";
import { TitlebarHeight } from "../components/CustomTitlebar";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

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

function SettingsScreen() {
  return (
    <View
      style={[globalStyles.container, { marginTop: Constants.statusBarHeight }]}
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
        <SettingsItem>
          <Text>Surface</Text>
        </SettingsItem>
      </ScrollView>
    </View>
  );
}

export default SettingsScreen;
