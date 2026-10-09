import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import FocusAwareStatusBar from "../shared/components/FocusAwareStatusBar";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import {
  useFocusEffect,
  useIsFocused,
  useScrollToTop,
} from "@react-navigation/native";
import Import, {
  DocumentTypeEnum,
} from "../features/settings/model/documentPicker/Import";
import Auth from "../features/auth/components/Auth";
import { useTheme } from "../app/providers/ThemeProvider";
import {
  authenticateUser,
  isSystemAuthenticationAvailable,
  isUsingAuthentication,
  removeAuthentication,
  saveAuthentication,
} from "../features/auth/utils/authenticateUser";
import { useAuth } from "../app/providers/AuthProvider";
import ChangeMasterPasswordModal from "../features/settings/components/modals/ChangeMasterPasswordModal";
import BrowserExtensionsModal from "../features/settings/components/modals/BrowserExtensionsModal";
import SettingsDivider from "../features/settings/components/SettingsDivider";
import SettingsContainer from "../features/settings/components/SettingsContainer";
import SettingsItem from "../features/settings/components/SettingsItem";
import SettingsSwitch from "../features/settings/components/SettingsSwitch";
import SettingsFooter from "../features/settings/components/SettingsFooter";

import * as Linking from "expo-linking";
import SettingsQuickSelect from "../features/settings/components/SettingsQuickSelect";
import QuickSelectItem from "../features/settings/model/QuickSelectItem";
import SettingsShortcutItem from "../features/settings/components/SettingsShortcutItem";
import { useDevMode } from "../app/providers/DevModeProvider";
import SettingsDropdownItem from "../features/settings/components/SettingsDropdownItem";
import { useTranslation } from "react-i18next";
import {
  Button as PaperButton,
  IconButton,
  Text,
} from "react-native-paper";
import Animated, {
  Easing,
  FadeInLeft,
  FadeOutLeft,
  Layout,
  withTiming,
} from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { siBitwarden, siKeepassxc } from "simple-icons";
import { useSetting } from "../app/providers/SettingsProvider";
import { useToken } from "../app/providers/CloudProvider";
import { useVault } from "../app/providers/VaultProvider";
import {
  getGlassChromeStyle,
  getScreenContentStyle,
} from "../shared/ui/glass";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import BackupImportButton from "../features/settings/components/buttons/BackupImportButton";
import BackupExportButton from "../features/settings/components/buttons/BackupExportButton";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "../app/navigation/model/types";
import { ContentProtectionSettingsToggle } from "../features/settings/components/ContentProtectionSettingsToggle";
import AppearanceSettingsSection from "../features/settings/components/AppearanceSettingsSection";
import FastAccessPositionPicker from "../features/settings/components/FastAccessPositionPicker";
import HotkeyRecorderItem from "../features/settings/components/HotkeyRecorderItem";
import { checkForDesktopUpdate } from "../shared/utils/desktopUpdater";
import {
  isDemoDistribution,
  shouldUseDesktopUpdater,
  shouldUseMobileBinaryUpdater,
} from "../shared/utils/distribution";
import { checkMobileBinaryUpdate } from "../shared/utils/mobileUpdater";
import { publishUpdateCheck } from "../infrastructure/events/updateBus";
import AppChip from "../shared/components/chips/AppChip";
import { logger } from "../infrastructure/logging/logger";
import {
  detectTauriEnvironment,
  isTauriEnvironment,
} from "../infrastructure/platform/isTauri";
import { FAST_ACCESS_POSITION_CHANGED_EVENT } from "../features/fastaccess/constants";
import { HotkeySettings } from "../infrastructure/platform/hotkeys";
import Modal from "../shared/components/modals/Modal";
import {
  resetAppSettings,
  resetDeviceSettings,
} from "../infrastructure/storage/store";
import { removeFile as removeLocalVaultFile } from "../infrastructure/cloud/clients/DeviceStorageClient";
import BrandIcon from "../shared/components/icons/BrandIcon";
import {
  TITLEBAR_CONTROLS_WIDTH,
  TITLEBAR_HEIGHT,
} from "../shared/components/titlebarMetrics";
import { resolveWindowControlsSide } from "../infrastructure/platform/windowControls";
import SearchInput from "../shared/components/SearchInput";

const settingsQuickSelectOverlayHeight = 36;
const settingsWebListTopFadeStart = 0;
const settingsWebListTopFadeEnd = settingsQuickSelectOverlayHeight + 22;
const settingsNativeListTopFadeClear = settingsQuickSelectOverlayHeight + 16;
const settingsWideListTopFadeEnd = 24;
const settingsSearchTransition = Easing.out(Easing.cubic);
const compactSearchEnter = () => {
  "worklet";
  return {
    initialValues: {
      opacity: 0,
      transform: [{ translateX: 96 }, { scaleX: 0.72 }],
    },
    animations: {
      opacity: withTiming(1, {
        duration: 190,
        easing: settingsSearchTransition,
      }),
      transform: [
        {
          translateX: withTiming(0, {
            duration: 190,
            easing: settingsSearchTransition,
          }),
        },
        {
          scaleX: withTiming(1, {
            duration: 190,
            easing: settingsSearchTransition,
          }),
        },
      ],
    },
  };
};
const compactSearchExit = () => {
  "worklet";
  return {
    initialValues: {
      opacity: 1,
      transform: [{ translateX: 0 }, { scaleX: 1 }],
    },
    animations: {
      opacity: withTiming(0, {
        duration: 140,
        easing: settingsSearchTransition,
      }),
      transform: [
        {
          translateX: withTiming(96, {
            duration: 140,
            easing: settingsSearchTransition,
          }),
        },
        {
          scaleX: withTiming(0.72, {
            duration: 140,
            easing: settingsSearchTransition,
          }),
        },
      ],
    },
  };
};
const webNoDragStyle =
  Platform.OS === "web"
    ? ({
        WebkitAppRegion: "no-drag",
        appRegion: "no-drag",
      } as any)
    : null;
const webDragStyle =
  Platform.OS === "web"
    ? ({
        WebkitAppRegion: "drag",
        appRegion: "drag",
        cursor: "default",
      } as any)
    : null;
const webDragRegionProps =
  Platform.OS === "web" ? ({ dataSet: { tauriDragRegion: "" } } as any) : null;

const normalizeSettingsSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

const styles = StyleSheet.create({
  surface: {
    padding: 8,
    height: 80,
    width: "100%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  scrollView: {
    width: "100%",
    backgroundColor: "transparent",
  },
  settingsScrollArea: {
    flex: 1,
    width: "100%",
    position: "relative",
    backgroundColor: "transparent",
  },
  quickSelectOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: settingsQuickSelectOverlayHeight,
    zIndex: 8,
  },
  quickSelectOverlaySurface: {
    position: "relative",
    zIndex: 1,
  },
  nativeListMask: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  nativeListMaskTop: {
    height: settingsNativeListTopFadeClear,
    width: "100%",
  },
  nativeListMaskMiddle: {
    flex: 1,
    width: "100%",
    backgroundColor: "black",
  },
  container: {
    width: 250,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    margin: 6,
  },
  resetModal: {
    width: 320,
    maxWidth: "100%",
    padding: 16,
  },
  resetModalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 20,
  },
  resetModalButton: {
    borderRadius: 12,
  },
  importModal: {
    borderRadius: 12,
    overflow: "hidden",
  },
  importModalHeader: {
    gap: 3,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  chip: {
    height: 30,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 12,
    lineHeight: 16,
  },
});

type SettingsScreenProps = NativeStackScreenProps<
  SettingsStackParamList,
  "Settings"
>;

const CHROME_EXTENSION_URL =
  "https://chromewebstore.google.com/detail/ojjkfbkgabdddgajcgfnppgahbfnpppm?utm_source=item-share-cb";
const FIREFOX_EXTENSION_URL =
  "https://addons.mozilla.org/de/firefox/addon/clavispass/";

type ResetAction = "settings" | "device" | "vault" | "syncDevices";

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const {
    headerWhite,
    setHeaderWhite,
    darkmode,
    setHeaderSpacing,
    setTitlebarCenterGap,
    setTitlebarOverlayDragEnabled,
    theme,
  } = useTheme();
  const { getMaster, logout } = useAuth();
  const { clearSession } = useToken();
  const vault = useVault();
  const { devMode } = useDevMode();
  const { t } = useTranslation();

  const [startup, setStartup] = React.useState(false);
  const { height, width } = useWindowDimensions();
  const isCompactSettingsLayout = width <= 600;
  const settingsScrollContentStyle = useMemo(
    () => ({
      paddingTop: isCompactSettingsLayout
        ? settingsQuickSelectOverlayHeight
        : 0,
    }),
    [isCompactSettingsLayout],
  );
  const settingsWebListFadeMaskStyle =
    Platform.OS === "web"
      ? isCompactSettingsLayout
        ? ({
            WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, transparent ${settingsWebListTopFadeStart}px, black ${settingsWebListTopFadeEnd}px, black 100%)`,
            maskImage: `linear-gradient(to bottom, transparent 0px, transparent ${settingsWebListTopFadeStart}px, black ${settingsWebListTopFadeEnd}px, black 100%)`,
          } as any)
        : ({
            WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, rgba(0, 0, 0, 0.55) 12px, black ${settingsWideListTopFadeEnd}px, black 100%)`,
            maskImage: `linear-gradient(to bottom, transparent 0px, rgba(0, 0, 0, 0.55) 12px, black ${settingsWideListTopFadeEnd}px, black 100%)`,
          } as any)
      : null;
  const SettingsScrollMask: any =
    Platform.OS !== "web" ? MaskedView : View;
  const settingsScrollMaskProps =
    Platform.OS !== "web"
      ? {
          maskElement: (
            <View style={styles.nativeListMask}>
              {isCompactSettingsLayout ? (
                <LinearGradient
                  colors={["transparent", "transparent", "black"]}
                  locations={[0, 0.42, 1]}
                  style={styles.nativeListMaskTop}
                />
              ) : (
                <LinearGradient
                  colors={["transparent", "rgba(0, 0, 0, 0.55)", "black"]}
                  locations={[0, 0.5, 1]}
                  style={{
                    height: settingsWideListTopFadeEnd,
                    width: "100%",
                  }}
                />
              )}
              <View style={styles.nativeListMaskMiddle} />
            </View>
          ),
        }
      : {};
  const isFocused = useIsFocused();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHeaderVisible, setSearchHeaderVisible] = useState(false);
  const [useAuthentication, setUseAuthentication] = React.useState(false);
  const [systemAuthenticationAvailable, setSystemAuthenticationAvailable] =
    React.useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [manualUpdateLabel, setManualUpdateLabel] = useState<string | null>(
    null,
  );
  const [manualMobileUpdateUrl, setManualMobileUpdateUrl] = useState<
    string | null
  >(null);
  const [isTauri, setIsTauri] = useState(isTauriEnvironment());

  const { value: closeBehaviorValue, setValue: setCloseBehaviorValue } =
    useSetting("CLOSE_BEHAVIOR");
  const { value: startBehaviorValue, setValue: setStartBehaviorValue } =
    useSetting("START_BEHAVIOR");
  const { value: windowControlsStyle } = useSetting("WINDOW_CONTROLS_STYLE");
  const { value: fastAccessValue, setValue: setFastAccessValue } =
    useSetting("FAST_ACCESS");
  const {
    value: fastAccessPosition,
    setValue: setFastAccessPosition,
    refresh: refreshFastAccessPosition,
  } = useSetting("FAST_ACCESS_POSITION");

  const { value: language } = useSetting("LANGUAGE");

  const { value: copyDurationSeconds, setValue: setCopyDurationSeconds } =
    useSetting("COPY_DURATION");
  const { value: autosaveDelaySeconds, setValue: setAutosaveDelaySeconds } =
    useSetting("AUTOSAVE_DELAY");

  const { value: sessionDurationSeconds, setValue: setSessionDurationSeconds } =
    useSetting("SESSION_DURATION");
  const { value: blurOnUnfocus, setValue: setBlurOnUnfocus } =
    useSetting("BLUR_ON_UNFOCUS");
  const { value: expiryReminders, setValue: setExpiryReminders } =
    useSetting("EXPIRY_REMINDERS");
  const { value: hotkeys, setValue: setHotkeys } = useSetting("HOTKEYS");

  const closeBehavior = closeBehaviorValue === "hide";
  const hideOnStartup = startBehaviorValue === "hidden";
  const fastAccess = fastAccessValue === "auto";

  const [showChangeMasterPasswordModal, setShowChangeMasterPasswordModal] =
    useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBrowserExtensionsModal, setShowBrowserExtensionsModal] =
    useState(false);
  const [resetAction, setResetAction] = useState<ResetAction | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const searchRef = useRef<any>(null);
  const suppressNextCompactSearchOpenRef = useRef(false);
  useScrollToTop(scrollRef);

  const authRef = useRef<View>(null);
  const systemRef = useRef<View>(null);
  const designRef = useRef<View>(null);
  const authSettingsRef = useRef<View>(null);
  const browserExtensionRef = useRef<View>(null);
  const cryptoRef = useRef<View>(null);
  const updatesRef = useRef<View>(null);
  const hotkeysRef = useRef<View>(null);
  const fastAccessRef = useRef<View>(null);
  const backupRef = useRef<View>(null);
  const importRef = useRef<View>(null);
  const dataResetRef = useRef<View>(null);
  const isCompactHeader = width < 600;
  const controlsLeft =
    resolveWindowControlsSide(windowControlsStyle) === "left";
  const wideSearchWidth = Math.min(340, Math.max(200, width * 0.32));
  const importModalMaxHeight = Math.max(280, Math.min(460, height - 112));
  const importListMaxHeight = Math.max(180, importModalMaxHeight - 98);
  const normalizedSettingsSearchQuery = normalizeSettingsSearch(searchQuery);

  const matchesSettingsSearch = useCallback(
    (terms: string[]) => {
      if (!normalizedSettingsSearchQuery) return true;
      return terms.some((term) =>
        normalizeSettingsSearch(term).includes(normalizedSettingsSearchQuery),
      );
    },
    [normalizedSettingsSearchQuery],
  );

  const visibleSettingsSections = useMemo(
    () => ({
      sync: matchesSettingsSearch([
        t("settings:sync"),
        "sync",
        "cloud",
        "provider",
        "dropbox",
        "google drive",
        "vault",
      ]),
      system:
        isTauri &&
        matchesSettingsSearch([
          t("settings:system"),
          t("settings:autostart"),
          t("settings:startMinimized"),
          t("settings:resetWindowSize"),
          t("settings:minimizeToTray"),
          "system",
          "window",
          "startup",
          "tray",
          "desktop",
          "mac",
          "windows",
        ]),
      hotkeys:
        isTauri &&
        matchesSettingsSearch([
          t("settings:hotkeys"),
          t("settings:hotkeyAction_toggleMainWindow"),
          t("settings:hotkeyAction_lockVault"),
          t("settings:hotkeyAction_newEntry"),
          "shortcut",
          "keyboard",
          "global",
        ]),
      updates:
        !isDemoDistribution() &&
        (isTauri
          ? shouldUseDesktopUpdater()
          : shouldUseMobileBinaryUpdater()) &&
        matchesSettingsSearch([
          t("settings:updates"),
          t("settings:checkForUpdates"),
          "update",
          "version",
          "release",
        ]),
      appearance: matchesSettingsSearch([
        t("settings:appearance"),
        "appearance",
        "design",
        "theme",
        "dark",
        "light",
        "window buttons",
        "corners",
        "mac",
      ]),
      security: matchesSettingsSearch([
        t("settings:security"),
        t("settings:changeMasterPassword"),
        t("settings:useSystemAuth"),
        t("settings:contentProtection"),
        t("settings:blurOnUnfocus"),
        t("settings:expiryReminders"),
        t("settings:manageDevices"),
        t("settings:copyDuration"),
        t("settings:autosaveDelay"),
        t("settings:sessionDuration"),
        "2fa",
        "auth",
        "biometric",
        "password",
        "clipboard",
        "device",
        "expiry",
        "reminder",
        "notification",
      ]),
      browserExtensions:
        isTauri &&
        matchesSettingsSearch([
          t("settings:browserExtensions"),
          t("settings:browserExtensionSettingsItem"),
          t("settings:browserExtensionChromeStore"),
          t("settings:browserExtensionFirefoxStore"),
          "browser",
          "extension",
          "firefox",
          "chrome",
          "edge",
        ]),
      cryptography: matchesSettingsSearch([
        t("settings:cryptography"),
        t("settings:encryption"),
        t("settings:keyDerivation"),
        "crypto",
        "encryption",
        "argon2",
        "xchacha",
        "key",
      ]),
      fastAccess: matchesSettingsSearch([
        t("settings:fastAccess"),
        t("settings:autoOpenFastAccess"),
        t("settings:fastAccessPosition"),
        "fast access",
        "popup",
        "tooltip",
      ]),
      backup: matchesSettingsSearch([
        t("settings:backup"),
        t("settings:importBackup"),
        t("settings:exportBackup"),
        "backup",
        "export",
        "import",
      ]),
      import: matchesSettingsSearch([
        t("settings:import"),
        "import",
        "keepass",
        "kdbx",
        "bitwarden",
        "firefox",
        "chrome",
        "pcloud",
        "csv",
      ]),
      dangerZone: matchesSettingsSearch([
        t("settings:dangerZone"),
        t("settings:resetSettings"),
        t("settings:resetDevice"),
        t("settings:clearVault"),
        t("settings:clearSyncDevices"),
        "reset",
        "clear",
        "delete",
        "danger",
      ]),
    }),
    [devMode, isTauri, matchesSettingsSearch, t],
  );

  const hasVisibleSettingsSections = Object.values(
    visibleSettingsSections,
  ).some(Boolean);

  const quickSelectItems: QuickSelectItem[] = useMemo(
    () => [
      ...(visibleSettingsSections.sync
        ? [
            {
              title: t("settings:sync"),
              icon: "sync",
              ref: authRef,
              plattform: null,
            } satisfies QuickSelectItem,
          ]
        : []),
      ...(visibleSettingsSections.appearance
        ? [
            {
              title: t("settings:appearance"),
              icon: "theme-light-dark",
              ref: designRef,
              plattform: null,
            } satisfies QuickSelectItem,
          ]
        : []),
      ...(visibleSettingsSections.security
        ? [
            {
              title: t("settings:security"),
              icon: "shield-outline",
              ref: authSettingsRef,
              plattform: null,
            } satisfies QuickSelectItem,
          ]
        : []),
      ...(visibleSettingsSections.fastAccess
        ? [
            {
              title: t("settings:fastAccess"),
              icon: "tooltip-account",
              ref: fastAccessRef,
              plattform: null,
            } satisfies QuickSelectItem,
          ]
        : []),
      ...(visibleSettingsSections.backup
        ? [
            {
              title: t("settings:backup"),
              icon: "database-outline",
              ref: backupRef,
              plattform: null,
            } satisfies QuickSelectItem,
          ]
        : []),
      ...(visibleSettingsSections.import
        ? [
            {
              title: t("settings:import"),
              icon: "file-import-outline",
              ref: importRef,
              plattform: null,
            } satisfies QuickSelectItem,
          ]
        : []),
      ...(visibleSettingsSections.browserExtensions
        ? ([
            {
              title: t("settings:browserExtensions"),
              icon: "puzzle-outline",
              ref: browserExtensionRef,
              plattform: "web",
            },
          ] satisfies QuickSelectItem[])
        : []),
      ...(visibleSettingsSections.updates
        ? [
            {
              title: t("settings:updates"),
              icon: "update",
              ref: updatesRef,
              plattform: null,
            } satisfies QuickSelectItem,
          ]
        : []),
      ...(visibleSettingsSections.system
        ? [
            {
              title: t("settings:system"),
              icon: "cog-outline",
              ref: systemRef,
              plattform: "web",
            } satisfies QuickSelectItem,
          ]
        : []),
      ...(visibleSettingsSections.hotkeys
        ? [
            {
              title: t("settings:hotkeys"),
              icon: "keyboard-outline",
              ref: hotkeysRef,
              plattform: "web",
            } satisfies QuickSelectItem,
          ]
        : []),
      ...(visibleSettingsSections.cryptography
        ? [
            {
              title: t("settings:cryptography"),
              icon: "key-outline",
              ref: cryptoRef,
              plattform: null,
            } satisfies QuickSelectItem,
          ]
        : []),
      ...(visibleSettingsSections.dangerZone
        ? [
            {
              title: t("settings:dangerZone"),
              icon: "alert-outline",
              ref: dataResetRef,
              plattform: null,
            } satisfies QuickSelectItem,
          ]
        : []),
    ],
    [t, language, visibleSettingsSections],
  );

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setHeaderWhite(false);
      setTitlebarCenterGap(0);
      setTitlebarOverlayDragEnabled(false);

      return () => {
        setTitlebarCenterGap(0);
      };
    }, [
      setHeaderSpacing,
      setHeaderWhite,
      setTitlebarCenterGap,
      setTitlebarOverlayDragEnabled,
    ]),
  );

  useEffect(() => {
    if (!isCompactHeader) {
      setSearchHeaderVisible(false);
      return;
    }

    if (searchQuery.trim() !== "") setSearchHeaderVisible(true);
  }, [isCompactHeader, searchQuery]);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const styleId = "clavispass-settings-search-selection-style";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      #settings-compact-search,
      #settings-compact-search *,
      #settings-wide-search,
      #settings-wide-search * {
        -webkit-user-select: none;
        user-select: none;
      }

      #settings-compact-search input,
      #settings-compact-search textarea,
      #settings-wide-search input,
      #settings-wide-search textarea {
        -webkit-user-select: text;
        user-select: text;
      }

      #settings-compact-search input::placeholder,
      #settings-compact-search textarea::placeholder,
      #settings-wide-search input::placeholder,
      #settings-wide-search textarea::placeholder {
        -webkit-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const changeAuthentication = async (authentication: boolean) => {
    if (authentication) {
      const master = getMaster();
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
    if (!(await detectTauriEnvironment())) {
      return;
    }
    try {
      const { enable, disable, isEnabled } = await import(
        "@tauri-apps/plugin-autostart"
      );
      if (startup) {
        await enable();
      } else {
        await disable();
      }
      setStartup(await isEnabled());
    } catch (error) {
      logger.warn("[Settings] Failed to change autostart:", error);
      await getAutoStart();
    }
  };

  const getAutoStart = async () => {
    if (!(await detectTauriEnvironment())) {
      setStartup(false);
      return;
    }
    try {
      const { isEnabled } = await import("@tauri-apps/plugin-autostart");
      const value = await isEnabled();
      setStartup(value);
    } catch (error) {
      logger.warn("[Settings] Failed to read autostart:", error);
      setStartup(false);
    }
  };

  const resetWindowSize = async () => {
    if (!(await detectTauriEnvironment())) {
      return;
    }

    const { invoke } = await import("@tauri-apps/api/core");
    await invoke("reset_window_size");
  };

  const checkForUpdates = async () => {
    if (checkingUpdate) {
      return;
    }

    setCheckingUpdate(true);
    setManualUpdateLabel(t("settings:checkingForUpdates"));
    setManualMobileUpdateUrl(null);

    try {
      if (await detectTauriEnvironment()) {
        if (!shouldUseDesktopUpdater()) {
          setManualUpdateLabel(t("settings:noUpdatesAvailable"));
          return;
        }

        const update = await checkForDesktopUpdate();
        publishUpdateCheck(update);
        setManualUpdateLabel(
          update
            ? t("settings:updateAvailable")
            : t("settings:noUpdatesAvailable"),
        );
        return;
      }

      if (!shouldUseMobileBinaryUpdater()) {
        setManualUpdateLabel(t("settings:noUpdatesAvailable"));
        return;
      }

      const mobileUpdate = await checkMobileBinaryUpdate(language);
      if (mobileUpdate) {
        setManualMobileUpdateUrl(mobileUpdate.downloadUrl);
        setManualUpdateLabel(
          mobileUpdate.required
            ? t("settings:mobileUpdateRequiredTitle")
            : t("settings:mobileUpdateAvailable"),
        );
        return;
      }

      const updateResult = await Updates.checkForUpdateAsync();
      setManualUpdateLabel(
        updateResult.isAvailable
          ? t("settings:updateAvailable")
          : t("settings:noUpdatesAvailable"),
      );
    } catch (error) {
      logger.error("Manual update check failed:", error);
      setManualUpdateLabel(t("settings:updateCheckFailed"));
    } finally {
      setCheckingUpdate(false);
    }
  };

  const resetModalConfig = useMemo(() => {
    if (!resetAction) return null;

    switch (resetAction) {
      case "settings":
        return {
          title: t("settings:resetSettingsTitle"),
          text: t("settings:resetSettingsText"),
          action: t("settings:resetSettingsAction"),
          destructive: false,
        };
      case "device":
        return {
          title: t("settings:resetDeviceTitle"),
          text: t("settings:resetDeviceText"),
          action: t("settings:resetDeviceAction"),
          destructive: true,
        };
      case "vault":
        return {
          title: t("settings:clearVaultTitle"),
          text: t("settings:clearVaultText"),
          action: t("settings:clearVaultAction"),
          destructive: true,
        };
      case "syncDevices":
        return {
          title: t("settings:clearSyncDevicesTitle"),
          text: t("settings:clearSyncDevicesText"),
          action: t("settings:clearSyncDevicesAction"),
          destructive: true,
        };
    }
  }, [resetAction, t]);

  const settingInfo = useMemo(
    () => ({
      systemAuth: {
        title: t("settings:infoSystemAuthTitle"),
        body: t("settings:infoSystemAuthBody"),
        bullets: [
          t("settings:infoSystemAuthBullet1"),
          t("settings:infoSystemAuthBullet2"),
        ],
      },
      contentProtection: {
        title: t("settings:infoContentProtectionTitle"),
        body: t("settings:infoContentProtectionBody"),
        bullets: [
          t("settings:infoContentProtectionBullet1"),
          t("settings:infoContentProtectionBullet2"),
        ],
      },
      blurOnUnfocus: {
        title: t("settings:infoBlurOnUnfocusTitle"),
        body: t("settings:infoBlurOnUnfocusBody"),
      },
      copyDuration: {
        title: t("settings:infoCopyDurationTitle"),
        body: t("settings:infoCopyDurationBody"),
        bullets: [
          t("settings:infoCopyDurationBullet1"),
          t("settings:infoCopyDurationBullet2"),
        ],
      },
      autosaveDelay: {
        title: t("settings:infoAutosaveDelayTitle"),
        body: t("settings:infoAutosaveDelayBody"),
        bullets: [
          t("settings:infoAutosaveDelayBullet1"),
          t("settings:infoAutosaveDelayBullet2"),
        ],
      },
      sessionDuration: {
        title: t("settings:infoSessionDurationTitle"),
        body: t("settings:infoSessionDurationBody"),
      },
      expiryReminders: {
        title: t("settings:infoExpiryRemindersTitle"),
        body: t("settings:infoExpiryRemindersBody"),
        bullets: [
          t("settings:infoExpiryRemindersBullet1"),
          t("settings:infoExpiryRemindersBullet2"),
        ],
      },
      fastAccess: {
        title: t("settings:infoFastAccessTitle"),
        body: t("settings:infoFastAccessBody"),
        bullets: [
          t("settings:infoFastAccessBullet1"),
          t("settings:infoFastAccessBullet2"),
        ],
      },
    }),
    [t],
  );

  const confirmResetAction = async () => {
    switch (resetAction) {
      case "settings":
        await resetAppSettings();
        setResetAction(null);
        return;
      case "device":
        await removeAuthentication();
        await clearSession();
        await removeLocalVaultFile();
        await resetDeviceSettings();
        vault.lock();
        logout();
        setResetAction(null);
        return;
      case "vault":
        vault.update((draft) => {
          draft.folder = [];
          draft.values = [];
        });
        setResetAction(null);
        return;
      case "syncDevices":
        vault.update((draft) => {
          draft.devices = [];
        });
        setResetAction(null);
        return;
    }
  };

  useEffect(() => {
    void (async () => {
      setIsTauri(await detectTauriEnvironment());
    })();
    getAutoStart();
    void (async () => {
      const available = await isSystemAuthenticationAvailable();
      setSystemAuthenticationAvailable(available);
      if (!available) return;

      const isAuthenticated = await isUsingAuthentication();
      setUseAuthentication(isAuthenticated);
    })();
  }, []);

  useEffect(() => {
    let unlisten: null | (() => void) = null;

    const setup = async () => {
      if (!(await detectTauriEnvironment())) {
        return;
      }

      const { listen } = await import("@tauri-apps/api/event");
      unlisten = await listen(FAST_ACCESS_POSITION_CHANGED_EVENT, () => {
        void refreshFastAccessPosition();
      });
    };

    void setup();

    return () => {
      unlisten?.();
    };
  }, [refreshFastAccessPosition]);

  const openURL = async (value: string) => {
    if (await detectTauriEnvironment()) {
      const { open } = await import("@tauri-apps/plugin-shell");
      await open(value);
    } else {
      await Linking.openURL(value);
    }
  };

  const closeCompactSearchIfEmpty = useCallback(() => {
    if (!isCompactHeader) return;
    if (!isFocused) return;
    if (searchQuery.trim() !== "") return;

    if (Platform.OS === "web" && searchHeaderVisible) {
      suppressNextCompactSearchOpenRef.current = true;
      window.setTimeout(() => {
        suppressNextCompactSearchOpenRef.current = false;
      }, 250);
    }

    searchRef.current?.blur?.();
    Keyboard.dismiss();
    setSearchHeaderVisible(false);
  }, [isCompactHeader, isFocused, searchHeaderVisible, searchQuery]);

  const openHeaderSearch = useCallback(() => {
    if (suppressNextCompactSearchOpenRef.current) {
      suppressNextCompactSearchOpenRef.current = false;
      return;
    }

    setSearchHeaderVisible(true);
    requestAnimationFrame(() => {
      searchRef.current?.focus?.();
    });
  }, []);

  const handleCompactSearchBlur = useCallback(() => {
    closeCompactSearchIfEmpty();
  }, [closeCompactSearchIfEmpty]);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const handleSearchShortcut = (event: KeyboardEvent) => {
      if (!isFocused) return;
      if (event.key === "Escape" && isCompactHeader && searchHeaderVisible) {
        event.preventDefault();
        event.stopPropagation();

        if (searchQuery.trim() === "") {
          setSearchHeaderVisible(false);
          return;
        }

        setSearchQuery("");
        requestAnimationFrame(() => {
          searchRef.current?.focus?.();
        });
        return;
      }

      if (!(event.ctrlKey || event.metaKey)) return;
      if (event.altKey) return;
      if (event.key.toLowerCase() !== "f") return;

      event.preventDefault();
      event.stopPropagation();

      if (isCompactHeader) {
        openHeaderSearch();
        return;
      }

      requestAnimationFrame(() => {
        searchRef.current?.focus?.();
      });
    };

    document.addEventListener("keydown", handleSearchShortcut, true);
    return () => {
      document.removeEventListener("keydown", handleSearchShortcut, true);
    };
  }, [
    isCompactHeader,
    isFocused,
    openHeaderSearch,
    searchHeaderVisible,
    searchQuery,
  ]);

  const glassChromeStyle = getGlassChromeStyle(darkmode);
  const screenContentStyle = getScreenContentStyle(theme);

  const settingsHeader = (
    <View
      style={{
        ...glassChromeStyle,
        minHeight: 37 + Constants.statusBarHeight,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginBottom: 0,
        paddingTop: Constants.statusBarHeight + 4,
        paddingBottom: 3,
        borderRadius: 12,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        justifyContent: "center",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
      }}
    >
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 34,
          paddingLeft:
            (Platform.OS === "web" &&
            TITLEBAR_HEIGHT > 0 &&
            isCompactHeader &&
            controlsLeft
              ? TITLEBAR_CONTROLS_WIDTH
              : 0) + (isCompactHeader && searchHeaderVisible ? 4 : 0),
          paddingRight:
            (Platform.OS === "web" && TITLEBAR_HEIGHT > 0 && !controlsLeft
              ? 104
              : 0) + (isCompactHeader && searchHeaderVisible ? 4 : 0),
          gap: 8,
          position: "relative",
          zIndex: 4,
        }}
      >
        {isCompactHeader && searchHeaderVisible ? (
          <Animated.View
            id="settings-compact-search"
            entering={compactSearchEnter}
            exiting={compactSearchExit}
            layout={Layout.duration(180).easing(settingsSearchTransition)}
            style={[
              {
                flex: 1,
                height: 32,
                marginLeft: 0,
                overflow: "hidden",
                position: "relative",
                zIndex: 5,
              },
              webNoDragStyle,
            ]}
          >
            <View
              style={{
                height: 32,
                maxHeight: 32,
                flex: 1,
                ...webNoDragStyle,
              }}
            >
              <SearchInput
                ref={searchRef}
                placeholder={t("settings:search")}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onBlur={handleCompactSearchBlur}
                onSubmitEditing={handleCompactSearchBlur}
                resetLabel={t("common:reset")}
                height={32}
                fontSize={16}
                compact
              />
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            id="settings-header-title-drag-region"
            {...(isFocused && !searchHeaderVisible ? webDragRegionProps : null)}
            entering={FadeInLeft.duration(180).easing(settingsSearchTransition)}
            exiting={FadeOutLeft.duration(120).easing(settingsSearchTransition)}
            layout={Layout.duration(180).easing(settingsSearchTransition)}
            style={[
              {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                minWidth: 0,
                position: "relative",
                zIndex: 5,
              },
              isFocused && !searchHeaderVisible ? webDragStyle : null,
            ]}
          >
            <Text
              style={{
                color: theme.colors.onSurfaceVariant,
                userSelect: "none",
                fontSize: 15,
                marginLeft: 16,
              }}
              variant="titleSmall"
              numberOfLines={1}
            >
              {t("bar:Settings")}
            </Text>
          </Animated.View>
        )}
        {!isCompactHeader ? (
          <View
            id="settings-wide-search"
            style={{
              height: 34,
              left: "50%",
              marginLeft: -wideSearchWidth / 2,
              position: "absolute",
              width: wideSearchWidth,
              zIndex: 6,
              ...webNoDragStyle,
            }}
          >
            <SearchInput
              ref={searchRef}
              placeholder={t("settings:search")}
              onChangeText={setSearchQuery}
              value={searchQuery}
              resetLabel={t("common:reset")}
              height={34}
              fontSize={13}
            />
          </View>
        ) : null}
        {isCompactHeader ? (
          !searchHeaderVisible ? (
            <IconButton
              accessibilityLabel={t("settings:search")}
              icon="magnify"
              iconColor={theme.colors.primary}
              size={22}
              onPress={openHeaderSearch}
              style={{
                margin: 0,
                marginRight: 8,
                width: 36,
                height: 32,
                position: "relative",
                zIndex: 5,
                ...webNoDragStyle,
              }}
            />
          ) : null
        ) : (
          <View
            id="settings-header-right-drag-region"
            {...(isFocused ? webDragRegionProps : null)}
            style={[
              {
                flex: 1,
                alignSelf: "stretch",
                minHeight: 34,
              },
              isFocused ? webDragStyle : null,
            ]}
          />
        )}
      </View>
    </View>
  );

  return (
    <AnimatedContainer>
      <BottomSheetModalProvider>
        <FocusAwareStatusBar
          animated={true}
          style={headerWhite ? "light" : darkmode ? "light" : "dark"}
          translucent={true}
        />
        {settingsHeader}
        <View
          style={{
            flex: 1,
            width: "100%",
            padding: 0,
            flexDirection: width > 600 ? "row" : "column",
            ...screenContentStyle,
          }}
        >
          {!isCompactSettingsLayout ? (
            <SettingsQuickSelect scrollRef={scrollRef} items={quickSelectItems} />
          ) : null}
          <View style={styles.settingsScrollArea}>
            <SettingsScrollMask
              style={{ flex: 1, width: "100%" }}
              {...settingsScrollMaskProps}
            >
          <ScrollView
            ref={scrollRef}
            style={[styles.scrollView, settingsWebListFadeMaskStyle]}
            contentContainerStyle={settingsScrollContentStyle}
          >
            {visibleSettingsSections.sync ? (
              <SettingsContainer
                ref={authRef}
                icon="sync"
                title={t("settings:sync")}
              >
                <Auth navigation={navigation} />
              </SettingsContainer>
            ) : null}

            {visibleSettingsSections.appearance ? (
              <SettingsContainer
                ref={designRef}
                icon="theme-light-dark"
                title={t("settings:appearance")}
              >
                <AppearanceSettingsSection dropdownMaxWidth={160} />
              </SettingsContainer>
            ) : null}

            {visibleSettingsSections.security ? (
              <SettingsContainer
                ref={authSettingsRef}
                icon="shield-outline"
                title={t("settings:security")}
              >
                <SettingsItem
                  subtitle={t("settings:changeMasterPasswordSubtitle")}
                  onPress={() => {
                    setShowChangeMasterPasswordModal(true);
                  }}
                >
                  {t("settings:changeMasterPassword")}
                </SettingsItem>
                {systemAuthenticationAvailable ? (
                  <>
                    <SettingsDivider />
                    <SettingsSwitch
                      label={t("settings:useSystemAuth")}
                      subtitle={t("settings:useSystemAuthSubtitle")}
                      value={useAuthentication}
                      info={settingInfo.systemAuth}
                      onValueChange={(checked) => {
                        changeAuthentication(checked);
                      }}
                    />
                  </>
                ) : null}
                <SettingsDivider />
                <ContentProtectionSettingsToggle
                  info={settingInfo.contentProtection}
                />
                {isTauri ? (
                  <>
                    <SettingsDivider />
                    <SettingsSwitch
                      label={t("settings:blurOnUnfocus")}
                      subtitle={t("settings:blurOnUnfocusSubtitle")}
                      value={blurOnUnfocus}
                      info={settingInfo.blurOnUnfocus}
                      onValueChange={(checked) => {
                        void setBlurOnUnfocus(checked);
                      }}
                    />
                  </>
                ) : null}
                {Platform.OS !== "web" ? (
                  <>
                    <SettingsDivider />
                    <SettingsSwitch
                      label={t("settings:expiryReminders")}
                      subtitle={t("settings:expiryRemindersSubtitle")}
                      value={expiryReminders}
                      info={settingInfo.expiryReminders}
                      onValueChange={(checked) => {
                        void setExpiryReminders(checked);
                      }}
                    />
                  </>
                ) : null}
                <SettingsDivider />
                <SettingsItem
                  subtitle={t("settings:manageDevicesSubtitle")}
                  onPress={() => {
                    navigation.navigate("Devices");
                  }}
                >
                  {t("settings:manageDevices")}
                </SettingsItem>
                <SettingsDivider />
                <SettingsDropdownItem
                  value={String(copyDurationSeconds ?? 0)}
                  setValue={(v) => setCopyDurationSeconds(Number(v))}
                  label={t("settings:copyDuration")}
                  subtitle={t("settings:copyDurationSubtitle")}
                  info={settingInfo.copyDuration}
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
                      label: t("settings:seconds", { count: 60 }),
                      value: "60",
                    },
                  ]}
                />
                <SettingsDivider />

                <SettingsDropdownItem
                  value={String(autosaveDelaySeconds ?? 30)}
                  setValue={(v) => setAutosaveDelaySeconds(Number(v))}
                  label={t("settings:autosaveDelay")}
                  subtitle={t("settings:autosaveDelaySubtitle")}
                  info={settingInfo.autosaveDelay}
                  dropdownMaxWidth={260}
                  dropdownMinWidth={200}
                  options={[
                    { label: t("settings:autosaveOff"), value: "0" },
                    {
                      label: t("settings:seconds", { count: 5 }),
                      value: "5",
                    },
                    {
                      label: t("settings:seconds", { count: 10 }),
                      value: "10",
                    },
                    {
                      label: t("settings:seconds", { count: 30 }),
                      value: "30",
                    },
                    {
                      label: t("settings:seconds", { count: 60 }),
                      value: "60",
                    },
                  ]}
                />
                <SettingsDivider />

                <SettingsDropdownItem
                  value={String(sessionDurationSeconds ?? 3600)}
                  setValue={(v) => setSessionDurationSeconds(Number(v))}
                  label={t("settings:sessionDuration")}
                  subtitle={t("settings:sessionDurationSubtitle")}
                  info={settingInfo.sessionDuration}
                  dropdownMaxWidth={260}
                  dropdownMinWidth={200}
                  options={[
                    {
                      label: t("settings:minutes", { count: 5 }),
                      value: String(5 * 60),
                    },
                    {
                      label: t("settings:minutes", { count: 10 }),
                      value: String(10 * 60),
                    },
                    {
                      label: t("settings:minutes", { count: 15 }),
                      value: String(15 * 60),
                    },
                    {
                      label: t("settings:minutes", { count: 30 }),
                      value: String(30 * 60),
                    },
                    {
                      label: t("settings:minutes", { count: 60 }),
                      value: String(60 * 60),
                    },
                    {
                      label: t("settings:hours", { count: 2 }),
                      value: String(2 * 60 * 60),
                    },
                    {
                      label: t("settings:hours", { count: 4 }),
                      value: String(4 * 60 * 60),
                    },
                  ]}
                />
              </SettingsContainer>
            ) : null}

            {visibleSettingsSections.fastAccess ? (
              <SettingsContainer
                ref={fastAccessRef}
                icon="tooltip-account"
                title={t("settings:fastAccess")}
              >
                <SettingsSwitch
                  label={t("settings:autoOpenFastAccess")}
                  value={fastAccess}
                  info={settingInfo.fastAccess}
                  onValueChange={(checked) => {
                    changeFastAccessBehavior(checked);
                  }}
                />
                {isTauri ? (
                  <>
                    <SettingsDivider />
                    <FastAccessPositionPicker
                      value={fastAccessPosition}
                      setValue={setFastAccessPosition}
                    />
                  </>
                ) : null}
              </SettingsContainer>
            ) : null}

            {visibleSettingsSections.backup ? (
              <SettingsContainer
                ref={backupRef}
                icon="database-outline"
                title={t("settings:backup")}
              >
                <BackupImportButton />
                <SettingsDivider />
                <BackupExportButton />
              </SettingsContainer>
            ) : null}

            {visibleSettingsSections.import ? (
              <SettingsContainer
                ref={importRef}
                icon="file-import-outline"
                title={t("settings:import")}
              >
                <SettingsItem
                  subtitle={t("settings:importDataHint")}
                  onPress={() => {
                    setShowImportModal(true);
                  }}
                >
                  {t("settings:importData")}
                </SettingsItem>
              </SettingsContainer>
            ) : null}

            {visibleSettingsSections.browserExtensions ? (
              <SettingsContainer
                ref={browserExtensionRef}
                icon="puzzle-outline"
                title={t("settings:browserExtensions")}
              >
                <SettingsItem
                  subtitle={t("settings:browserExtensionOpenOptionsSubtitle")}
                  onPress={() => {
                    setShowBrowserExtensionsModal(true);
                  }}
                >
                  {t("settings:browserExtensionOpenOptions")}
                </SettingsItem>
                <SettingsDivider />
                <SettingsItem
                  subtitle={t("settings:browserExtensionSettingsItemSubtitle")}
                  onPress={() => {
                    navigation.navigate("BrowserExtensions");
                  }}
                >
                  {t("settings:browserExtensionSettingsItem")}
                </SettingsItem>
              </SettingsContainer>
            ) : null}

            {visibleSettingsSections.updates ? (
              <SettingsContainer
                ref={updatesRef}
                icon="update"
                title={t("settings:updates")}
              >
                <SettingsItem>
                  {checkingUpdate
                    ? t("settings:checkingForUpdates")
                    : (manualUpdateLabel ?? t("settings:noUpdatesAvailable"))}
                </SettingsItem>
                {manualMobileUpdateUrl ? (
                  <>
                    <SettingsDivider />
                    <SettingsItem
                      subtitle={t("settings:subtitleMobileUpdateDownload")}
                      onPress={() => {
                        void Linking.openURL(manualMobileUpdateUrl);
                      }}
                    >
                      {t("settings:mobileUpdateDownload")}
                    </SettingsItem>
                  </>
                ) : null}
                <SettingsDivider />
                <SettingsItem
                  subtitle={t("settings:subtitleCheckForUpdates")}
                  onPress={() => {
                    void checkForUpdates();
                  }}
                >
                  {t("settings:checkForUpdates")}
                </SettingsItem>
              </SettingsContainer>
            ) : null}

            {visibleSettingsSections.system ? (
              <SettingsContainer
                ref={systemRef}
                icon="cog-outline"
                title={t("settings:system")}
              >
                <SettingsSwitch
                  label={t("settings:autostart")}
                  subtitle={t("settings:subtitleAutostart")}
                  value={startup}
                  onValueChange={(checked) => {
                    void changeAutoStart(checked);
                  }}
                />
                <SettingsDivider />
                <SettingsSwitch
                  label={t("settings:startMinimized")}
                  subtitle={t("settings:subtitleStartMinimized")}
                  value={hideOnStartup}
                  onValueChange={(checked) => {
                    changeStartBehavior(checked);
                  }}
                />
                <SettingsDivider />
                <SettingsItem
                  subtitle={t("settings:subtitleResetWindowSize")}
                  onPress={() => {
                    resetWindowSize();
                  }}
                >
                  {t("settings:resetWindowSize")}
                </SettingsItem>
                <SettingsDivider />
                <SettingsSwitch
                  label={t("settings:minimizeToTray")}
                  subtitle={t("settings:subtitleMinimizeToTray")}
                  value={closeBehavior}
                  onValueChange={(checked) => {
                    void changeCloseBehavior(checked);
                  }}
                />
              </SettingsContainer>
            ) : null}

            {visibleSettingsSections.hotkeys ? (
              <SettingsContainer
                ref={hotkeysRef}
                icon="keyboard-outline"
                title={t("settings:hotkeys")}
              >
                <HotkeyRecorderItem
                  action="toggleMainWindow"
                  label={t("settings:hotkeyAction_toggleMainWindow")}
                  subtitle={t("settings:hotkeyAction_toggleMainWindowSubtitle")}
                  hotkeys={hotkeys}
                  onChange={(next: HotkeySettings) => {
                    void setHotkeys(next);
                  }}
                />
                <SettingsDivider />
                <HotkeyRecorderItem
                  action="lockVault"
                  label={t("settings:hotkeyAction_lockVault")}
                  subtitle={t("settings:hotkeyAction_lockVaultSubtitle")}
                  hotkeys={hotkeys}
                  onChange={(next: HotkeySettings) => {
                    void setHotkeys(next);
                  }}
                />
                <SettingsDivider />
                <HotkeyRecorderItem
                  action="newEntry"
                  label={t("settings:hotkeyAction_newEntry")}
                  subtitle={t("settings:hotkeyAction_newEntrySubtitle")}
                  hotkeys={hotkeys}
                  onChange={(next: HotkeySettings) => {
                    void setHotkeys(next);
                  }}
                />
              </SettingsContainer>
            ) : null}

            {visibleSettingsSections.cryptography ? (
              <SettingsContainer
                ref={cryptoRef}
                icon="key-outline"
                title={t("settings:cryptography")}
              >
                <SettingsShortcutItem
                  shortcut="XChaCha20"
                  subtitle={t("settings:encryptionSubtitle")}
                >
                  {t("settings:encryption")}
                </SettingsShortcutItem>
                <SettingsDivider />
                <SettingsShortcutItem
                  shortcut="Argon2id"
                  subtitle={t("settings:keyDerivationSubtitle")}
                >
                  {t("settings:keyDerivation")}
                </SettingsShortcutItem>
              </SettingsContainer>
            ) : null}

            {visibleSettingsSections.dangerZone ? (
              <SettingsContainer
                ref={dataResetRef}
                icon="alert-outline"
                title={t("settings:dangerZone")}
                style={{ marginBottom: 4 }}
              >
                <SettingsItem
                  subtitle={t("settings:subtitleResetSettings")}
                  onPress={() => setResetAction("settings")}
                >
                  {t("settings:resetSettings")}
                </SettingsItem>
                <SettingsDivider />
                <SettingsItem
                  subtitle={t("settings:subtitleResetDevice")}
                  onPress={() => setResetAction("device")}
                >
                  {t("settings:resetDevice")}
                </SettingsItem>
                <SettingsDivider />
                <SettingsItem
                  subtitle={t("settings:subtitleClearVault")}
                  onPress={() => setResetAction("vault")}
                >
                  {t("settings:clearVault")}
                </SettingsItem>
                {devMode ? (
                  <>
                    <SettingsDivider />
                    <SettingsItem
                      subtitle={t("settings:subtitleClearSyncDevices")}
                      onPress={() => setResetAction("syncDevices")}
                    >
                      {t("settings:clearSyncDevices")}
                    </SettingsItem>
                  </>
                ) : null}
              </SettingsContainer>
            ) : null}

            {!hasVisibleSettingsSections ? (
              <SettingsContainer icon="magnify" title={t("settings:search")}>
                <SettingsItem rightIcon={null}>
                  {t("settings:noSearchResults")}
                </SettingsItem>
              </SettingsContainer>
            ) : null}

            <SettingsFooter />

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
                flexWrap: "wrap",
                margin: 8,
                marginTop: 0,
                marginBottom: 8,
              }}
            >
              <AppChip
                icon={"web"}
                showSelectedOverlay={true}
                onPress={() => {
                  openURL("https://clavispass.arratel.dev/");
                }}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {t("settings:website")}
              </AppChip>
              <AppChip
                icon={"github"}
                showSelectedOverlay={true}
                onPress={() => {
                  openURL("https://github.com/ClavisPass/ClavisPass");
                }}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                Github
              </AppChip>
              <AppChip
                icon={"email-outline"}
                showSelectedOverlay={true}
                onPress={() => {
                  openURL("mailto:clavispass@arratel.dev");
                }}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {t("settings:contact")}
              </AppChip>
            </View>
          </ScrollView>
            </SettingsScrollMask>
            {isCompactSettingsLayout ? (
              <View pointerEvents="box-none" style={styles.quickSelectOverlay}>
                <View style={styles.quickSelectOverlaySurface}>
                  <SettingsQuickSelect
                    scrollRef={scrollRef}
                    items={quickSelectItems}
                  />
                </View>
              </View>
            ) : null}
          </View>
        </View>

        <ChangeMasterPasswordModal
          visible={showChangeMasterPasswordModal}
          setVisible={setShowChangeMasterPasswordModal}
        />
        <BrowserExtensionsModal
          visible={showBrowserExtensionsModal}
          onDismiss={() => setShowBrowserExtensionsModal(false)}
          onOpenChromeStore={() => {
            openURL(CHROME_EXTENSION_URL);
          }}
          onOpenFirefoxStore={() => {
            openURL(FIREFOX_EXTENSION_URL);
          }}
        />
        <Modal
          visible={showImportModal}
          onDismiss={() => setShowImportModal(false)}
        >
          <View
            style={[
              styles.importModal,
              {
                width: Math.min(340, width - 32),
                maxHeight: importModalMaxHeight,
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.outlineVariant,
                borderWidth: StyleSheet.hairlineWidth,
              },
            ]}
          >
            <View style={styles.importModalHeader}>
              <Text variant="titleMedium">{t("settings:importData")}</Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {t("settings:importDataHint")}
              </Text>
            </View>
            <SettingsDivider />
            <ScrollView
              style={{ maxHeight: importListMaxHeight }}
              showsVerticalScrollIndicator
            >
              {isTauri ? (
                <>
                  <Import
                    type={DocumentTypeEnum.KDBX}
                    title="KeePass"
                    icon="key-outline"
                    vault={vault}
                    leading={
                      <BrandIcon
                        icon={siKeepassxc}
                        color={theme.colors.primary}
                      />
                    }
                  />
                  <SettingsDivider />
                </>
              ) : null}
              <Import
                type={DocumentTypeEnum.BITWARDEN}
                title="Bitwarden"
                icon="shield-key-outline"
                vault={vault}
                leading={
                  <BrandIcon icon={siBitwarden} color={theme.colors.primary} />
                }
              />
              <SettingsDivider />
              <Import
                type={DocumentTypeEnum.FIREFOX}
                title="Firefox"
                icon="firefox"
                vault={vault}
              />
              <SettingsDivider />
              <Import
                type={DocumentTypeEnum.CHROME}
                title="Chrome"
                icon="google-chrome"
                vault={vault}
              />
              {devMode ? (
                <>
                  <SettingsDivider />
                  <Import
                    type={DocumentTypeEnum.PCLOUD}
                    title="pCloud"
                    icon="circle-outline"
                    vault={vault}
                  />
                </>
              ) : null}
            </ScrollView>
          </View>
        </Modal>
        <Modal
          visible={resetAction !== null}
          onDismiss={() => setResetAction(null)}
        >
          {resetModalConfig ? (
            <View style={styles.resetModal}>
              <Text variant="titleLarge">{resetModalConfig.title}</Text>
              <Text
                variant="bodyMedium"
                style={{
                  marginTop: 8,
                  color: theme.colors.onSurfaceVariant,
                }}
              >
                {resetModalConfig.text}
              </Text>
              <View style={styles.resetModalActions}>
                <PaperButton
                  style={styles.resetModalButton}
                  onPress={() => setResetAction(null)}
                >
                  {t("common:cancel")}
                </PaperButton>
                <PaperButton
                  mode="contained"
                  style={styles.resetModalButton}
                  buttonColor={
                    resetModalConfig.destructive
                      ? theme.colors.error
                      : undefined
                  }
                  textColor={
                    resetModalConfig.destructive
                      ? theme.colors.onError
                      : undefined
                  }
                  onPress={() => {
                    void confirmResetAction();
                  }}
                >
                  {resetModalConfig.action}
                </PaperButton>
              </View>
            </View>
          ) : null}
        </Modal>
      </BottomSheetModalProvider>
    </AnimatedContainer>
  );
};

export default SettingsScreen;
