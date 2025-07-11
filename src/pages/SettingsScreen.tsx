import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Platform,
  useWindowDimensions,
} from "react-native";
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
import Header from "../components/Header";
import SettingsQuickSelect from "../components/SettingsQuickSelect";
import QuickSelectItem from "../types/QuickSelectItem";

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
  const { headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } =
    useTheme();
  const { master } = useAuth();
  const [startup, setStartup] = React.useState(false);
  const { width } = useWindowDimensions();
  const [useAuthentication, setUseAuthentication] = React.useState(false);
  const [closeBehavior, setCloseBehavior] = React.useState(false);

  const [showChangeMasterPasswordModal, setShowChangeMasterPasswordModal] =
    useState(false);

  const scrollRef = useRef<ScrollView>(null);

  // Refs für Container
  const authRef = useRef<View>(null);
  const updateRef = useRef<View>(null);
  const systemRef = useRef<View>(null);
  const designRef = useRef<View>(null);
  const authSettingsRef = useRef<View>(null);
  const backupRef = useRef<View>(null);
  const importRef = useRef<View>(null);
  const linksRef = useRef<View>(null);

  const quickSelectItems: QuickSelectItem[] = [
    { title: "Cloud", icon: "cloud", ref: authRef },
    { title: "Update", icon: "tray-arrow-down", ref: updateRef },
    { title: "System", icon: "cogs", ref: systemRef },
    { title: "Design", icon: "theme-light-dark", ref: designRef },
    { title: "Authentication", icon: "fingerprint", ref: authSettingsRef },
    { title: "Backup", icon: "database", ref: backupRef },
    { title: "Import", icon: "import", ref: importRef },
    { title: "Links", icon: "link-variant", ref: linksRef },
  ];

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
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
    <AnimatedContainer useFocusEffect={useFocusEffect}>
      <StatusBar
        animated={true}
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent={true}
      />
      <Header title="Settings" />

      <View
        style={{
          flex: 1,
          width: "100%",
          padding: 4,
          flexDirection: width > 600 ? "row" : "column",
        }}
      >
        <SettingsQuickSelect scrollRef={scrollRef} items={quickSelectItems} />
        <ScrollView ref={scrollRef} style={styles.scrollView}>
          <SettingsContainer
            ref={quickSelectItems[0].ref}
            icon={quickSelectItems[0].icon}
            title={quickSelectItems[0].title}
          >
            <Auth
              navigation={navigation}
              changeEditTokenVisibility={setEditTokenVisibility}
            />
          </SettingsContainer>
          <SettingsContainer
            ref={quickSelectItems[1].ref}
            icon={quickSelectItems[1].icon}
            title={quickSelectItems[1].title}
          >
            <UpdateManager />
          </SettingsContainer>
          <WebSpecific>
            <SettingsContainer
              ref={quickSelectItems[2].ref}
              icon={quickSelectItems[2].icon}
              title={quickSelectItems[2].title}
            >
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
              <SettingsItem leadingIcon="keyboard">
                Show/Hide ALT+W
              </SettingsItem>
              <SettingsDivider />
            </SettingsContainer>
          </WebSpecific>
          <SettingsContainer
            ref={quickSelectItems[3].ref}
            icon={quickSelectItems[3].icon}
            title={quickSelectItems[3].title}
          >
            <DarkModeSwitch />
          </SettingsContainer>
          <SettingsContainer
            ref={quickSelectItems[4].ref}
            icon={quickSelectItems[4].icon}
            title={quickSelectItems[4].title}
          >
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
          <SettingsContainer
            ref={quickSelectItems[5].ref}
            icon={quickSelectItems[5].icon}
            title={quickSelectItems[5].title}
          >
            <SettingsItem leadingIcon="database-import" onPress={() => {}}>
              Import Backup
            </SettingsItem>
            <SettingsDivider />
            <SettingsItem leadingIcon="database-export" onPress={() => {}}>
              Export Backup
            </SettingsItem>
            <SettingsDivider />
          </SettingsContainer>
          <SettingsContainer
            ref={quickSelectItems[6].ref}
            icon={quickSelectItems[6].icon}
            title={quickSelectItems[6].title}
          >
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
          <SettingsContainer
            ref={quickSelectItems[7].ref}
            icon={quickSelectItems[7].icon}
            title={quickSelectItems[7].title}
          >
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
      </View>
      <EditTokenModal
        visible={editTokenVisibility}
        setVisible={setEditTokenVisibility}
      />
      <ChangeMasterPasswordModal
        visible={showChangeMasterPasswordModal}
        setVisible={setShowChangeMasterPasswordModal}
      />
    </AnimatedContainer>
  );
}

export default SettingsScreen;
