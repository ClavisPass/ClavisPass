import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Button, Switch, Text, TextInput } from "react-native-paper";
import SettingsItem from "../components/items/SettingsItem";
import { TitlebarHeight } from "../components/CustomTitlebar";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AnimatedContainer from "../components/container/AnimatedContainer";
import { useFocusEffect } from "@react-navigation/native";
import WebSpecific from "../components/platformSpecific/WebSpecific";

import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";
import Import, { DocumentTypeEnum } from "../utils/documentPicker/Import";
import DarkModeSwitch from "../components/DarkModeSwitch";

import Auth from "../components/Auth";
import EditTokenModal from "../components/modals/EditTokenModal";
import { useTheme } from "../contexts/ThemeProvider";

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
  container: {
    width: 200,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    margin: 6,
  },
});

function SettingsScreen({ navigation }: { navigation: any }) {
  const { globalStyles } = useTheme();
  const [startup, setStartup] = React.useState(false);

  const [value, setValue] = useState("clavispass");

  const [editTokenVisibility, setEditTokenVisibility] = useState(false);

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
    <>
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
          <SettingsItem icon="cloud-outline" title={"Cloud"}>
            <View style={styles.container}>
              <Auth
                navigation={navigation}
                changeEditTokenVisibility={setEditTokenVisibility}
              />
            </View>
          </SettingsItem>
          <WebSpecific>
            <SettingsItem icon={"cogs"} title={"System"}>
              <View style={styles.container}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Switch
                    value={startup}
                    onValueChange={(checked) => {
                      changeAutoStart(checked);
                    }}
                  />
                  <Text variant="bodyLarge">Autostart</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Switch
                    value={startup}
                    onValueChange={(checked) => {
                      changeAutoStart(checked);
                    }}
                  />
                  <Text variant="bodyLarge">Minimize to Tray</Text>
                </View>
              </View>
            </SettingsItem>
          </WebSpecific>
          <SettingsItem icon={"theme-light-dark"} title={"Design"}>
            <View style={styles.container}>
              <DarkModeSwitch />
            </View>
          </SettingsItem>
          <SettingsItem icon={"file-lock-outline"} title={"Credentials"}>
            <View style={styles.container}>
              <TextInput
                placeholder="Filename"
                outlineStyle={globalStyles.outlineStyle}
                style={globalStyles.textInputStyle}
                value={value}
                mode="outlined"
                onChangeText={(text) => setValue(text)}
                autoCapitalize="none"
              />
              <Button mode="contained-tonal">Change Password</Button>
            </View>
          </SettingsItem>
          <SettingsItem icon={"import"} title={"Import Passwords"}>
            <View style={styles.container}>
              <Import
                type={DocumentTypeEnum.FIREFOX}
                title={"Firefox"}
                icon={"firefox"}
              />
              <Import
                type={DocumentTypeEnum.CHROME}
                title={"Chrome"}
                icon={"google-chrome"}
              />
              <Import
                type={DocumentTypeEnum.PCLOUD}
                title={"pCloud"}
                icon={"circle-outline"}
              />
            </View>
          </SettingsItem>
        </ScrollView>
        <EditTokenModal
          visible={editTokenVisibility}
          setVisible={setEditTokenVisibility}
        />
      </AnimatedContainer>
    </>
  );
}

export default SettingsScreen;
