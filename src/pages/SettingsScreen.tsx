import React, { useEffect, useMemo, useRef, useState } from "react";
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
import * as store from "../utils/store";

import { open } from "@tauri-apps/plugin-shell";

import * as Linking from "expo-linking";
import Header from "../components/Header";
import SettingsQuickSelect from "../components/SettingsQuickSelect";
import QuickSelectItem from "../types/QuickSelectItem";
import SettingsShortcutItem from "../components/items/SettingsShortcutItem";
import BackupImportButton from "../components/buttons/BackupImportButton";
import BackupExportButton from "../components/buttons/BackupExportButton";
import { useDevMode } from "../contexts/DevModeProvider";
import { StackScreenProps } from "@react-navigation/stack/lib/typescript/src/types";
import { RootStackParamList } from "../stacks/Stack";
import SettingsDropdownItem from "../components/items/SettingsDropdownItem";
import { formatAbsoluteDate, formatAbsoluteTime } from "../utils/expiry";
import { AppLanguage } from "../i18n/types";
import { i18n } from "../i18n";
import { useTranslation } from "react-i18next";
import { Chip } from "react-native-paper";

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

type SettingsScreenProps = StackScreenProps<RootStackParamList, "Settings">;

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } =
    useTheme();
  const { master } = useAuth();
  const { devMode } = useDevMode();
  const { t } = useTranslation();

  const [startup, setStartup] = React.useState(false);
  const { width } = useWindowDimensions();
  const [useAuthentication, setUseAuthentication] = React.useState(false);
  const [closeBehavior, setCloseBehavior] = React.useState(false);
  const [hideOnStartup, setHideOnStartup] = React.useState(false);
  const [fastAccess, setFastAccess] = React.useState(false);

  const [language, setLanguage] = useState<string>("");
  const [dateFormat, setDateFormat] = useState<string>("");
  const [timeFormat, setTimeFormat] = useState<string>("");

  const [showChangeMasterPasswordModal, setShowChangeMasterPasswordModal] =
    useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const authRef = useRef<View>(null);
  const systemRef = useRef<View>(null);
  const designRef = useRef<View>(null);
  const authSettingsRef = useRef<View>(null);
  const fastAccessRef = useRef<View>(null);
  const backupRef = useRef<View>(null);
  const importRef = useRef<View>(null);

  const quickSelectItems: QuickSelectItem[] = useMemo(
    () => [
      {
        title: t("settings:sync"),
        icon: "sync",
        ref: authRef,
        plattform: null,
      },
      {
        title: t("settings:system"),
        icon: "cogs",
        ref: systemRef,
        plattform: "web",
      },
      {
        title: t("settings:appearance"),
        icon: "theme-light-dark",
        ref: designRef,
        plattform: null,
      },
      {
        title: t("settings:authentication"),
        icon: "fingerprint",
        ref: authSettingsRef,
        plattform: null,
      },
      {
        title: t("settings:fastAccess"),
        icon: "tooltip-account",
        ref: fastAccessRef,
        plattform: null,
      },
      {
        title: t("settings:backup"),
        icon: "database",
        ref: backupRef,
        plattform: null,
      },
      {
        title: t("settings:import"),
        icon: "import",
        ref: importRef,
        plattform: null,
      }
    ],
    [language]
  );

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

  const changeStartBehavior = async (hidden: boolean) => {
    if (hidden) {
      store.set("START_BEHAVIOR", "hidden");
    } else {
      store.set("START_BEHAVIOR", "shown");
    }
    setHideOnStartup(hidden);
  };

  const changeFastAccessBehavior = async (auto: boolean) => {
    if (auto) {
      store.set("FAST_ACCESS", "auto");
    } else {
      store.set("FAST_ACCESS", "disabled");
    }
    setFastAccess(auto);
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
    store.get("START_BEHAVIOR").then((stored) => {
      setHideOnStartup(stored === "hidden");
    });
    store.get("FAST_ACCESS").then((stored) => {
      setFastAccess(stored === "auto");
    });
    store.get("LANGUAGE").then((stored) => {
      setLanguage(stored);
    });
    store.get("DATE_FORMAT").then((stored) => {
      setDateFormat(stored);
    });
    store.get("TIME_FORMAT").then((stored) => {
      setTimeFormat(stored);
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
      <Header title={t("bar:Settings")} />
      <View
        style={{
          flex: 1,
          width: "100%",
          padding: 0,
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
          <WebSpecific>
            <SettingsContainer
              ref={quickSelectItems[1].ref}
              icon={quickSelectItems[1].icon}
              title={quickSelectItems[1].title}
            >
              <SettingsSwitch
                label={t("settings:autostart")}
                value={startup}
                onValueChange={(checked) => {
                  changeAutoStart(checked);
                }}
              />
              <SettingsDivider />
              <SettingsSwitch
                label={t("settings:startMinimized")}
                value={hideOnStartup}
                onValueChange={(checked) => {
                  changeStartBehavior(checked);
                }}
              />
              <SettingsDivider />
              <SettingsSwitch
                label={t("settings:minimizeToTray")}
                value={closeBehavior}
                onValueChange={(checked) => {
                  changeCloseBehavior(checked);
                }}
              />
              <SettingsDivider />
              <SettingsShortcutItem shortcut="ALT+W">
                {t("settings:showHide")}
              </SettingsShortcutItem>
            </SettingsContainer>
          </WebSpecific>
          <SettingsContainer
            ref={quickSelectItems[2].ref}
            icon={quickSelectItems[2].icon}
            title={quickSelectItems[2].title}
          >
            <DarkModeSwitch />
            <SettingsDivider />
            <SettingsDropdownItem
              value={language}
              setValue={(language) => {
                setLanguage(language);
                i18n.changeLanguage(language);
                store.set("LANGUAGE", language as AppLanguage);
              }}
              label={t("settings:language")}
              options={[
                { label: "English", value: "en" },
                { label: "Deutsch", value: "de" },
              ]}
            />
            <SettingsDivider />
            <SettingsDropdownItem
              value={dateFormat}
              setValue={(dateFormat) => {
                setDateFormat(dateFormat);
                store.set("DATE_FORMAT", dateFormat as "de-DE" | "en-US");
              }}
              label={t("settings:dateFormat")}
              dropdownMaxWidth={120}
              options={[
                {
                  label: formatAbsoluteDate(new Date().toISOString(), "de-DE"),
                  value: "de-DE",
                },
                {
                  label: formatAbsoluteDate(new Date().toISOString(), "en-US"),
                  value: "en-US",
                },
              ]}
            />
            <SettingsDivider />
            <SettingsDropdownItem
              value={timeFormat}
              setValue={(timeFormat) => {
                setTimeFormat(timeFormat);
                store.set("TIME_FORMAT", timeFormat as "de-DE" | "en-US");
              }}
              label={t("settings:timeFormat")}
              options={[
                {
                  label: formatAbsoluteTime(new Date().toISOString(), "de-DE"),
                  value: "de-DE",
                },
                {
                  label: formatAbsoluteTime(new Date().toISOString(), "en-US"),
                  value: "en-US",
                },
              ]}
            />
          </SettingsContainer>
          <SettingsContainer
            ref={quickSelectItems[3].ref}
            icon={quickSelectItems[3].icon}
            title={quickSelectItems[3].title}
          >
            <SettingsItem
              onPress={() => {
                setShowChangeMasterPasswordModal(true);
              }}
            >
              {t("settings:changeMasterPassword")}
            </SettingsItem>
            <SettingsDivider />
            <SettingsSwitch
              label={t("settings:useSystemAuth")}
              value={useAuthentication}
              onValueChange={(checked) => {
                changeAuthentication(checked);
              }}
            />
          </SettingsContainer>
          <SettingsContainer
            ref={quickSelectItems[4].ref}
            icon={quickSelectItems[4].icon}
            title={quickSelectItems[4].title}
          >
            <SettingsSwitch
              label={t("settings:autoOpenFastAccess")}
              value={fastAccess}
              onValueChange={(checked) => {
                changeFastAccessBehavior(checked);
              }}
            />
          </SettingsContainer>
          <SettingsContainer
            ref={quickSelectItems[5].ref}
            icon={quickSelectItems[5].icon}
            title={quickSelectItems[5].title}
          >
            <BackupImportButton />
            <SettingsDivider />
            <BackupExportButton />
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
            {devMode && (
              <>
                <SettingsDivider />
                <Import
                  type={DocumentTypeEnum.PCLOUD}
                  title={"pCloud"}
                  icon={"circle-outline"}
                />
              </>
            )}
          </SettingsContainer>
          <Footer />
          <View style={{display: "flex", flexDirection: "row", gap: 8, flexWrap: "wrap", margin: 8, marginTop: 0}}>
            <Chip
              icon={"web"}
              showSelectedOverlay={true}
              onPress={() => {
                openURL("https://clavispass.github.io/ClavisPass/");
              }}
              style={{ borderRadius: 12 }}
            >
              {t("settings:website")}
            </Chip>
            <Chip
              icon={"github"}
              showSelectedOverlay={true}
              onPress={() => {
                openURL("https://github.com/ClavisPass/ClavisPass");
              }}
              style={{ borderRadius: 12 }}
            >
              Github
            </Chip>
          </View>
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
};

export default SettingsScreen;
