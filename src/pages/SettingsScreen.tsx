import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Button, Platform } from "react-native";
import { Switch, Text } from "react-native-paper";
import { TitlebarHeight } from "../components/CustomTitlebar";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AnimatedContainer from "../components/container/AnimatedContainer";
import { useFocusEffect } from "@react-navigation/native";
import WebSpecific from "../components/platformSpecific/WebSpecific";

import { enable, isEnabled, disable } from "@tauri-apps/plugin-autostart";
import Import, { DocumentTypeEnum } from "../utils/documentPicker/Import";
import DarkModeSwitch from "../components/DarkModeSwitch";

import Auth from "../components/Auth";
import EditTokenModal from "../components/modals/EditTokenModal";
import { useTheme } from "../contexts/ThemeProvider";
import {
  authenticateUser,
  isUsingAuthentication,
  removeAuthentication,
  saveAuthentication,
} from "../utils/authenticateUser";
import { useAuth } from "../contexts/AuthProvider";
import ChangeMasterPasswordModal from "../components/modals/ChangeMasterPasswordModal";
import SettingsDivider from "../components/SettingsDivider";
import SettingsContainer from "../components/container/SettingsContainer";
import SettingsItem from "../components/items/SettingsItem";
import SettingsSwitch from "../components/SettingsSwitch";
import Footer from "../components/Footer";
import UpdateManager from "../components/UpdateManager";
import * as store from "../utils/store";

import { open } from "@tauri-apps/plugin-shell";

import * as Linking from "expo-linking";

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
    width: 250,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    margin: 6,
  },
});

function SettingsScreen({ navigation }: { navigation: any }) {
  const { headerWhite, setHeaderWhite, darkmode } = useTheme();
  const { master } = useAuth();
  const [startup, setStartup] = React.useState(false);

  const [useAuthentication, setUseAuthentication] = React.useState(false);
  const [closeBehavior, setCloseBehavior] = React.useState(false);

  const [showChangeMasterPasswordModal, setShowChangeMasterPasswordModal] =
    useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderWhite(false);
    }, [])
  );

  const changeAuthentication = async (authentication: boolean) => {
    if (authentication) {
      authenticateUser().then((isAuthenticated) => {
        if (isAuthenticated && master !== null) {
          saveAuthentication(master);
          setUseAuthentication(true);
        }
      });
    } else {
      removeAuthentication();
      setUseAuthentication(false);
    }
  };

  const changeCloseBehavior = async (hide: boolean) => {
    if (hide) {
      store.set("CLOSE_BEHAVIOR", "hide");
    } else {
      store.set("CLOSE_BEHAVIOR", "exit");
    }
    setCloseBehavior(hide);
  };

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
    isUsingAuthentication().then((isAuthenticated) => {
      setUseAuthentication(isAuthenticated);
    });
    store.get("CLOSE_BEHAVIOR").then((stored) => {
      setCloseBehavior(stored === "hide");
    });
  }, []);

  const openURL = async (value: string) => {
    if (Platform.OS === "web") {
      await open(value);
    } else {
      Linking.openURL(value);
    }
  };

  return (
    <>
      <AnimatedContainer
        style={{ marginTop: Constants.statusBarHeight }}
        useFocusEffect={useFocusEffect}
      >
        <StatusBar
          animated={true}
          style={headerWhite ? "light" : darkmode ? "light" : "dark"}
          translucent={true}
        />
        <TitlebarHeight />
        <ScrollView style={styles.scrollView}>
          <SettingsContainer icon="cloud-outline" title={"Cloud"}>
            <Auth
              navigation={navigation}
              changeEditTokenVisibility={setEditTokenVisibility}
            />
          </SettingsContainer>
          <SettingsContainer icon="tray-arrow-down" title={"Update"}>
            <UpdateManager />
          </SettingsContainer>
          <WebSpecific>
            <SettingsContainer icon={"cogs"} title={"System"}>
              <SettingsSwitch
                label={"Autostart"}
                value={startup}
                onValueChange={(checked) => {
                  changeAutoStart(checked);
                }}
              />
              <SettingsDivider />
              <SettingsSwitch
                label={"Minimize to Tray"}
                value={closeBehavior}
                onValueChange={(checked) => {
                  changeCloseBehavior(checked);
                }}
              />
              <SettingsDivider />
            </SettingsContainer>
          </WebSpecific>
          <SettingsContainer icon={"theme-light-dark"} title={"Design"}>
            <DarkModeSwitch />
          </SettingsContainer>
          <SettingsContainer icon={"fingerprint"} title={"Authentication"}>
            <SettingsItem
              onPress={() => {
                console.log("Button pressed");
                setShowChangeMasterPasswordModal(true);
              }}
            >
              Change Master Password
            </SettingsItem>
            <SettingsDivider />
            <SettingsSwitch
              label={"Use System Authentication"}
              value={useAuthentication}
              onValueChange={(checked) => {
                changeAuthentication(checked);
              }}
            />
            <SettingsDivider />
          </SettingsContainer>
          <SettingsContainer icon={"database"} title={"Backup"}>
            <SettingsItem
              leadingIcon="database-import"
              onPress={() => {
                
              }}
            >
              Import Backup
            </SettingsItem>
            <SettingsDivider />
            <SettingsItem
              leadingIcon="database-export"
              onPress={() => {
                
              }}
            >
              Export Backup
            </SettingsItem>
            <SettingsDivider />
          </SettingsContainer>
          <SettingsContainer icon={"import"} title={"Import Passwords"}>
            <Import
              type={DocumentTypeEnum.FIREFOX}
              title={"Firefox"}
              icon={"firefox"}
            />
            <SettingsDivider />
            <Import
              type={DocumentTypeEnum.CHROME}
              title={"Chrome"}
              icon={"google-chrome"}
            />
            <SettingsDivider />
            <Import
              type={DocumentTypeEnum.PCLOUD}
              title={"pCloud"}
              icon={"circle-outline"}
            />
            <SettingsDivider />
          </SettingsContainer>
          <SettingsContainer icon={"link-variant"} title={"Links"}>
            <SettingsItem
              leadingIcon="web"
              onPress={() => {
                openURL("https://clavispass.github.io/ClavisPass/");
              }}
            >
              Website
            </SettingsItem>
            <SettingsDivider />
            <SettingsItem
              leadingIcon="github"
              onPress={() => {
                openURL("https://github.com/ClavisPass/ClavisPass");
              }}
            >
              Github
            </SettingsItem>
            <SettingsDivider />
          </SettingsContainer>
          <Footer />
        </ScrollView>
        <EditTokenModal
          visible={editTokenVisibility}
          setVisible={setEditTokenVisibility}
        />
        <ChangeMasterPasswordModal
          visible={showChangeMasterPasswordModal}
          setVisible={setShowChangeMasterPasswordModal}
        />
      </AnimatedContainer>
    </>
  );
}

export default SettingsScreen;
