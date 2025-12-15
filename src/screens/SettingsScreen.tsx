import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Platform,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import { useFocusEffect } from "@react-navigation/native";
import WebSpecific from "../infrastructure/platform/WebSpecific";

import { enable, isEnabled, disable } from "@tauri-apps/plugin-autostart";
import Import, {
  DocumentTypeEnum,
} from "../features/settings/model/documentPicker/Import";
import DarkModeSwitch from "../features/settings/components/DarkModeSwitch";

import Auth from "../features/auth/components/Auth";
import { useTheme } from "../app/providers/ThemeProvider";
import {
  authenticateUser,
  isUsingAuthentication,
  removeAuthentication,
  saveAuthentication,
} from "../features/auth/utils/authenticateUser";
import { useAuth } from "../app/providers/AuthProvider";
import ChangeMasterPasswordModal from "../features/settings/components/modals/ChangeMasterPasswordModal";
import SettingsDivider from "../features/settings/components/SettingsDivider";
import SettingsContainer from "../features/settings/components/SettingsContainer";
import SettingsItem from "../features/settings/components/SettingsItem";
import SettingsSwitch from "../features/settings/components/SettingsSwitch";
import SettingsFooter from "../features/settings/components/SettingsFooter";

import { open } from "@tauri-apps/plugin-shell";

import * as Linking from "expo-linking";
import Header from "../shared/components/Header";
import SettingsQuickSelect from "../features/settings/components/SettingsQuickSelect";
import QuickSelectItem from "../features/settings/model/QuickSelectItem";
import SettingsShortcutItem from "../features/settings/components/SettingsShortcutItem";
import { useDevMode } from "../app/providers/DevModeProvider";
import { RootStackParamList } from "../app/navigation/stacks/Stack";
import SettingsDropdownItem from "../features/settings/components/SettingsDropdownItem";
import {
  formatAbsoluteDate,
  formatAbsoluteTime,
} from "../features/vault/utils/expiry";
import { AppLanguage } from "../shared/i18n/types";
import { i18n } from "../shared/i18n";
import { useTranslation } from "react-i18next";
import { Chip } from "react-native-paper";
import { useSetting } from "../app/providers/SettingsProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import BackupImportButton from "../features/settings/components/buttons/BackupImportButton";
import BackupExportButton from "../features/settings/components/buttons/BackupExportButton";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

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

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, "Settings">;

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } =
    useTheme();
  const { master } = useAuth();
  const { devMode } = useDevMode();
  const { t } = useTranslation();

  const [startup, setStartup] = React.useState(false);
  const { width } = useWindowDimensions();
  const [useAuthentication, setUseAuthentication] = React.useState(false);

  const { value: closeBehaviorValue, setValue: setCloseBehaviorValue } =
    useSetting("CLOSE_BEHAVIOR");
  const { value: startBehaviorValue, setValue: setStartBehaviorValue } =
    useSetting("START_BEHAVIOR");
  const { value: fastAccessValue, setValue: setFastAccessValue } =
    useSetting("FAST_ACCESS");

  const { value: language, setValue: setLanguageSetting } =
    useSetting("LANGUAGE");
  const { value: dateFormat, setValue: setDateFormatSetting } =
    useSetting("DATE_FORMAT");
  const { value: timeFormat, setValue: setTimeFormatSetting } =
    useSetting("TIME_FORMAT");

  const { value: copyDurationSeconds, setValue: setCopyDurationSeconds } =
    useSetting("COPY_DURATION");

  const closeBehavior = closeBehaviorValue === "hide";
  const hideOnStartup = startBehaviorValue === "hidden";
  const fastAccess = fastAccessValue === "auto";

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
      },
    ],
    [t, language]
  );

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setHeaderWhite(false);
    }, [setHeaderSpacing, setHeaderWhite])
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
    await setCloseBehaviorValue(hide ? "hide" : "exit");
  };

  const changeStartBehavior = async (hidden: boolean) => {
    await setStartBehaviorValue(hidden ? "hidden" : "shown");
  };

  const changeFastAccessBehavior = async (auto: boolean) => {
    await setFastAccessValue(auto ? "auto" : "disabled");
  };

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
  }, []);

  const openURL = async (value: string) => {
    if (Platform.OS === "web") {
      await open(value);
    } else {
      Linking.openURL(value);
    }
  };

  return (
    <AnimatedContainer>
      <BottomSheetModalProvider>
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
              <Auth navigation={navigation} />
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
                setValue={(lang) => {
                  i18n.changeLanguage(lang);
                  setLanguageSetting(lang as AppLanguage);
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
                setValue={(df) => {
                  setDateFormatSetting(df as "de-DE" | "en-US");
                }}
                label={t("settings:dateFormat")}
                dropdownMaxWidth={120}
                options={[
                  {
                    label: formatAbsoluteDate(
                      new Date().toISOString(),
                      "de-DE"
                    ),
                    value: "de-DE",
                  },
                  {
                    label: formatAbsoluteDate(
                      new Date().toISOString(),
                      "en-US"
                    ),
                    value: "en-US",
                  },
                ]}
              />

              <SettingsDivider />

              <SettingsDropdownItem
                value={timeFormat}
                setValue={(tf) => {
                  setTimeFormatSetting(tf as "de-DE" | "en-US");
                }}
                label={t("settings:timeFormat")}
                options={[
                  {
                    label: formatAbsoluteTime(
                      new Date().toISOString(),
                      "de-DE"
                    ),
                    value: "de-DE",
                  },
                  {
                    label: formatAbsoluteTime(
                      new Date().toISOString(),
                      "en-US"
                    ),
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
              <SettingsDivider />
              <SettingsDropdownItem
                value={String(copyDurationSeconds ?? 0)}
                setValue={(v) => setCopyDurationSeconds(Number(v))}
                label={t("settings:copyDuration")}
                leadingIcon="content-copy"
                dropdownMaxWidth={260}
                dropdownMinWidth={200}
                options={[
                  { label: t("settings:copyDurationOff"), value: "0" },
                  {
                    label: t("settings:seconds", { count: 5 }),
                    value: "5",
                  },
                  {
                    label: t("settings:seconds", { count: 10 }),
                    value: "10",
                  },
                  {
                    label: t("settings:seconds", { count: 15 }),
                    value: "15",
                  },
                  {
                    label: t("settings:seconds", { count: 20 }),
                    value: "20",
                  },
                  {
                    label: t("settings:seconds", { count: 30 }),
                    value: "30",
                  },
                  {
                    label: t("settings:minutes", { count: 1 }),
                    value: "60",
                  },
                ]}
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

            <SettingsFooter />

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
                flexWrap: "wrap",
                margin: 8,
                marginTop: 0,
              }}
            >
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

        <ChangeMasterPasswordModal
          visible={showChangeMasterPasswordModal}
          setVisible={setShowChangeMasterPasswordModal}
        />
      </BottomSheetModalProvider>
    </AnimatedContainer>
  );
};

export default SettingsScreen;
