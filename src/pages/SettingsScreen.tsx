import React, { useCallback, useEffect, useMemo, useRef, useState, startTransition } from "react";
import { StyleSheet, ScrollView, View, Platform, useWindowDimensions, InteractionManager } from "react-native";
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
import { authenticateUser, isUsingAuthentication, removeAuthentication, saveAuthentication } from "../utils/authenticateUser";
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
import SettingsShortcutItem from "../components/items/SettingsShortcutItem";
import BackupImportButton from "../components/buttons/BackupImportButton";
import BackupExportButton from "../components/buttons/BackupExportButton";
import { useDevMode } from "../contexts/DevModeProvider";
import { StackScreenProps } from "@react-navigation/stack/lib/typescript/src/types";
import { RootStackParamList } from "../stacks/Stack";

import Animated, { FadeIn } from "react-native-reanimated";

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
  const { headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } = useTheme();
  const { master } = useAuth();
  const { devMode } = useDevMode();
  const { width } = useWindowDimensions();

  // UI state
  const [startup, setStartup] = useState(false);
  const [useAuthenticationState, setUseAuthenticationState] = useState(false);
  const [closeBehavior, setCloseBehavior] = useState(false);
  const [hideOnStartup, setHideOnStartup] = useState(false);
  const [fastAccess, setFastAccess] = useState(false);

  const [showChangeMasterPasswordModal, setShowChangeMasterPasswordModal] = useState(false);
  const [editTokenVisibility, setEditTokenVisibility] = useState(false);

  // Refs
  const scrollRef = useRef<ScrollView>(null);
  const authRef = useRef<View>(null);
  const updateRef = useRef<View>(null);
  const systemRef = useRef<View>(null);
  const designRef = useRef<View>(null);
  const authSettingsRef = useRef<View>(null);
  const fastAccessRef = useRef<View>(null);
  const backupRef = useRef<View>(null);
  const importRef = useRef<View>(null);
  const linksRef = useRef<View>(null);

  // QuickSelect einmalig memoizen, damit Items stabil bleiben
  const quickSelectItems: QuickSelectItem[] = useMemo(
    () => [
      { title: "Cloud",          icon: "cloud",             ref: authRef,        plattform: null },
      { title: "Update",         icon: "tray-arrow-down",   ref: updateRef,      plattform: null },
      { title: "System",         icon: "cogs",              ref: systemRef,      plattform: "web" },
      { title: "Design",         icon: "theme-light-dark",  ref: designRef,      plattform: null },
      { title: "Authentication", icon: "fingerprint",       ref: authSettingsRef,plattform: null },
      { title: "Fast Access",    icon: "tooltip-account",   ref: fastAccessRef,  plattform: null },
      { title: "Backup",         icon: "database",          ref: backupRef,      plattform: null },
      { title: "Import",         icon: "import",            ref: importRef,      plattform: null },
      { title: "Links",          icon: "link-variant",      ref: linksRef,       plattform: null },
    ],
    []
  );

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setHeaderSpacing(0);
        setHeaderWhite(false);
      });
      return () => task?.cancel?.();
    }, [setHeaderSpacing, setHeaderWhite])
  );

  // ---------- Handlers (stabil & minimal) ----------

  const changeAuthentication = useCallback(async (authentication: boolean) => {
    if (authentication) {
      const ok = await authenticateUser();
      if (ok && master) {
        await saveAuthentication(master);
        startTransition(() => setUseAuthenticationState(true));
      }
    } else {
      await removeAuthentication();
      startTransition(() => setUseAuthenticationState(false));
    }
  }, [master]);

  const changeCloseBehavior = useCallback(async (hide: boolean) => {
    await store.set("CLOSE_BEHAVIOR", hide ? "hide" : "exit");
    startTransition(() => setCloseBehavior(hide));
  }, []);

  const changeStartBehavior = useCallback(async (hidden: boolean) => {
    await store.set("START_BEHAVIOR", hidden ? "hidden" : "shown");
    startTransition(() => setHideOnStartup(hidden));
  }, []);

  const changeFastAccessBehavior = useCallback(async (auto: boolean) => {
    await store.set("FAST_ACCESS", auto ? "auto" : "disabled");
    startTransition(() => setFastAccess(auto));
  }, []);

  const changeAutoStart = useCallback(async (on: boolean) => {
    // Autostart nur dort versuchen, wo Tauri Desktop aktiv ist
    if (Platform.OS === "web") {
      if (on) await enable(); else await disable();
      startTransition(() => setStartup(on));
    } else {
      // Mobile/Native: Autostart ggf. nicht unterstützt → state nur spiegeln
      startTransition(() => setStartup(on));
    }
  }, []);

  const openURL = useCallback(async (value: string) => {
    try {
      if (Platform.OS === "web") {
        await open(value); // Tauri Shell
      } else {
        await Linking.openURL(value);
      }
    } catch (e) {
      // no-op; optional: toast
    }
  }, []);

  // ---------- Initial-Laden gebündelt & nach First Paint ----------

  useEffect(() => {
    let cancelled = false;
    InteractionManager.runAfterInteractions(() => {
      (async () => {
        try {
          const [auto, authUsed, close, start, fast] = await Promise.all([
            Platform.OS === "web" ? isEnabled().catch(() => false) : Promise.resolve(false),
            isUsingAuthentication().catch(() => false),
            store.get("CLOSE_BEHAVIOR").catch(() => "exit" as const),
            store.get("START_BEHAVIOR").catch(() => "shown" as const),
            store.get("FAST_ACCESS").catch(() => "disabled" as const),
          ]);

          if (cancelled) return;

          // ein State-Commit
          startTransition(() => {
            setStartup(Boolean(auto));
            setUseAuthenticationState(Boolean(authUsed));
            setCloseBehavior(close === "hide");
            setHideOnStartup(start === "hidden");
            setFastAccess(fast === "auto");
          });
        } catch {
          // ignore
        }
      })();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AnimatedContainer useFocusEffect={useFocusEffect}>
      <StatusBar animated style={headerWhite ? "light" : darkmode ? "light" : "dark"} translucent />
      <Header title="Settings" />

      <View style={{ flex: 1, width: "100%", padding: 0, flexDirection: width > 600 ? "row" : "column" }}>
        <SettingsQuickSelect scrollRef={scrollRef} items={quickSelectItems} />

        {/* sanftes Einfaden der Settings-Liste */}
        <Animated.View entering={FadeIn.duration(200)} style={styles.scrollView}>
          <ScrollView ref={scrollRef} style={{ width: "100%" }}>
            <SettingsContainer ref={quickSelectItems[0].ref} icon={quickSelectItems[0].icon} title={quickSelectItems[0].title}>
              <Auth navigation={navigation} changeEditTokenVisibility={setEditTokenVisibility} />
            </SettingsContainer>

            <SettingsContainer ref={quickSelectItems[1].ref} icon={quickSelectItems[1].icon} title={quickSelectItems[1].title}>
              <UpdateManager />
            </SettingsContainer>

            <WebSpecific>
              <SettingsContainer ref={quickSelectItems[2].ref} icon={quickSelectItems[2].icon} title={quickSelectItems[2].title}>
                <SettingsSwitch label={"Autostart"} value={startup} onValueChange={changeAutoStart} />
                <SettingsDivider />
                <SettingsSwitch label={"Start minimized"} value={hideOnStartup} onValueChange={changeStartBehavior} />
                <SettingsDivider />
                <SettingsSwitch label={"Minimize to Tray"} value={closeBehavior} onValueChange={changeCloseBehavior} />
                <SettingsDivider />
                <SettingsShortcutItem shortcut="ALT+W">Show/Hide</SettingsShortcutItem>
                <SettingsDivider />
              </SettingsContainer>
            </WebSpecific>

            <SettingsContainer ref={quickSelectItems[3].ref} icon={quickSelectItems[3].icon} title={quickSelectItems[3].title}>
              <DarkModeSwitch />
            </SettingsContainer>

            <SettingsContainer ref={quickSelectItems[4].ref} icon={quickSelectItems[4].icon} title={quickSelectItems[4].title}>
              <SettingsItem onPress={() => setShowChangeMasterPasswordModal(true)}>Change Master Password</SettingsItem>
              <SettingsDivider />
              <SettingsSwitch
                label={"Use System Authentication"}
                value={useAuthenticationState}
                onValueChange={changeAuthentication}
              />
              <SettingsDivider />
            </SettingsContainer>

            <SettingsContainer ref={quickSelectItems[5].ref} icon={quickSelectItems[5].icon} title={quickSelectItems[5].title}>
              <SettingsSwitch label={"Auto Open Fast Access"} value={fastAccess} onValueChange={changeFastAccessBehavior} />
              <SettingsDivider />
            </SettingsContainer>

            <SettingsContainer ref={quickSelectItems[6].ref} icon={quickSelectItems[6].icon} title={quickSelectItems[6].title}>
              <BackupImportButton />
              <SettingsDivider />
              <BackupExportButton />
              <SettingsDivider />
            </SettingsContainer>

            <SettingsContainer ref={quickSelectItems[7].ref} icon={quickSelectItems[7].icon} title={quickSelectItems[7].title}>
              <Import type={DocumentTypeEnum.FIREFOX} title={"Firefox"} icon={"firefox"} />
              <SettingsDivider />
              <Import type={DocumentTypeEnum.CHROME} title={"Chrome"} icon={"google-chrome"} />
              <SettingsDivider />
              {devMode && (
                <>
                  <Import type={DocumentTypeEnum.PCLOUD} title={"pCloud"} icon={"circle-outline"} />
                  <SettingsDivider />
                </>
              )}
            </SettingsContainer>

            <SettingsContainer ref={quickSelectItems[8].ref} icon={quickSelectItems[8].icon} title={quickSelectItems[8].title}>
              <SettingsItem leadingIcon="web" onPress={() => openURL("https://clavispass.github.io/ClavisPass/")}>
                Website
              </SettingsItem>
              <SettingsDivider />
              <SettingsItem leadingIcon="github" onPress={() => openURL("https://github.com/ClavisPass/ClavisPass")}>
                Github
              </SettingsItem>
              <SettingsDivider />
            </SettingsContainer>

            <Footer />
          </ScrollView>
        </Animated.View>
      </View>

      <EditTokenModal visible={editTokenVisibility} setVisible={setEditTokenVisibility} />
      <ChangeMasterPasswordModal visible={showChangeMasterPasswordModal} setVisible={setShowChangeMasterPasswordModal} />
    </AnimatedContainer>
  );
};

export default SettingsScreen;
