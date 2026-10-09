import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Platform,
  useWindowDimensions,
  InteractionManager,
  Keyboard,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Button, Icon, IconButton } from "react-native-paper";

import { Text } from "react-native-paper";

import { FlashList } from "@shopify/flash-list";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  Layout,
  withTiming,
} from "react-native-reanimated";

import ListItem from "../features/vault/components/items/ListItem";
import FocusAwareStatusBar from "../shared/components/FocusAwareStatusBar";
import Constants from "expo-constants";
import HomeFilterMenu from "../features/vault/components/menus/HomeFilterMenu";
import Blur from "../shared/components/Blur";
import AppChip from "../shared/components/chips/AppChip";
import FolderFilter from "../features/vault/components/FolderFilter";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import SearchInput from "../shared/components/SearchInput";
import {
  useFocusEffect,
  useIsFocused,
  useScrollToTop,
} from "@react-navigation/native";
import {
  TITLEBAR_CONTROLS_WIDTH,
  TITLEBAR_HEIGHT,
} from "../shared/components/titlebarMetrics";
import { resolveWindowControlsSide } from "../infrastructure/platform/windowControls";
import FolderModal from "../features/vault/components/modals/FolderModal";
import AddValueModal from "../features/vault/components/modals/AddValueModal";
import { useAuth } from "../app/providers/AuthProvider";
import { useTheme } from "../app/providers/ThemeProvider";
import {
  getGlassChromeStyle,
  getScreenContentStyle,
} from "../shared/ui/glass";

import Logo from "../shared/ui/Logo";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import FolderType from "../features/vault/model/FolderType";
import ValuesType from "../features/vault/model/ValuesType";
import { useTranslation } from "react-i18next";

import TotpItem from "../features/vault/components/items/TotpItem";
import ModulesEnum from "../features/vault/model/ModulesEnum";
import CardItem from "../features/vault/components/items/CardItem";
import DigitalCardModuleType from "../features/vault/model/modules/DigitalCardModuleType";
import { useToken } from "../app/providers/CloudProvider";
import { useOnline } from "../app/providers/OnlineProvider";
import { logger } from "../infrastructure/logging/logger";
import { fetchRemoteVaultFile } from "../infrastructure/cloud/clients/CloudStorageClient";
import { useSetting } from "../app/providers/SettingsProvider";
import Sync from "../features/sync/components/Sync";
import { useVault } from "../app/providers/VaultProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { HomeStackParamList } from "../app/navigation/model/types";
import { decryptVaultContent } from "../infrastructure/crypto/decryptVaultContent";
import { extractUrlFromEntry } from "../features/vault/utils/digitalCardTheme";
import {
  areVaultDataEqual,
  mergeVaultData,
} from "../features/vault/utils/mergeVaultData";
import { VaultIdentityMismatchError } from "../features/vault/utils/vaultIdentity";
import ExpiryOverviewModal from "../features/vault/components/modals/ExpiryOverviewModal";
import ModuleFilterModal from "../features/vault/components/modals/ModuleFilterModal";
import type ExpiryModuleType from "../features/vault/model/modules/ExpiryModuleType";
import { getRelativeInfo, getStatus } from "../features/vault/utils/expiry";
import { formatAbsoluteLocal } from "../shared/utils/Timestamp";
import { buildEntryMeta } from "../features/vault/utils/modulePolicy";
import {
  comparePinnedFirst,
  orderPinnedFirst,
} from "../features/vault/utils/pinnedEntries";
import {
  subscribeOpenAddValue,
  unsubscribeOpenAddValue,
} from "../infrastructure/events/openAddValueBus";
import Modal from "../shared/components/modals/Modal";
import {
  authenticateUser,
  isSystemAuthenticationAvailable,
  isUsingAuthentication,
  saveAuthentication,
} from "../features/auth/utils/authenticateUser";
import PerfProfiler from "../shared/performance/PerfProfiler";
import { triggerGlobalError } from "../infrastructure/events/errorBus";
import { detectTauriEnvironment } from "../infrastructure/platform/isTauri";
import type { MenuAnchorRect } from "../shared/components/menus/Menu";

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, "Home">;

const HOME_SCROLLBAR_STYLE_ID = "clavispass-home-scrollbar-style";
const homeSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  desktopGutter: 12,
  mobileGutter: 8,
};
const mobileFolderFilterOverlayHeight = 72;
const mobileFolderFilterFadeHeight = 34;
const homeToolChipHeight = 30;
const homeToolChipBottomPadding = homeSpacing.xs;
const homeToolsTopPadding = homeSpacing.sm;
const homeToolsOverlayHeight = 40;
const homeListEdgeGap = homeSpacing.sm;
const homeListTopGap = 6;
const homeListTopInset =
  homeToolsTopPadding +
  homeToolChipHeight +
  homeToolChipBottomPadding +
  homeListTopGap;
const webListTopFadeStart = 24;
const webListTopFadeEnd = homeListTopInset + 12;
const webListBottomFadeStart = mobileFolderFilterOverlayHeight + 0;
const webListBottomFadeEnd = 24;
const nativeListTopFadeClear = homeListTopInset + 12;
const nativeListBottomFadeClear =
  mobileFolderFilterOverlayHeight + homeListEdgeGap;
const homeListDrawDistance = Platform.OS === "web" ? 120 : 600;
const headerSearchTransition = Easing.out(Easing.cubic);
const compactSearchEnter = () => {
  "worklet";
  return {
    initialValues: {
      opacity: 0,
      transform: [{ translateX: 96 }, { scaleX: 0.72 }],
    },
    animations: {
      opacity: withTiming(1, { duration: 190, easing: headerSearchTransition }),
      transform: [
        {
          translateX: withTiming(0, {
            duration: 190,
            easing: headerSearchTransition,
          }),
        },
        {
          scaleX: withTiming(1, {
            duration: 190,
            easing: headerSearchTransition,
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
      opacity: withTiming(0, { duration: 140, easing: headerSearchTransition }),
      transform: [
        {
          translateX: withTiming(96, {
            duration: 140,
            easing: headerSearchTransition,
          }),
        },
        {
          scaleX: withTiming(0.72, {
            duration: 140,
            easing: headerSearchTransition,
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

type HomeValueListItemProps = {
  item: ValuesType;
  index: number;
  onPress: (item: ValuesType) => void;
  denseHorizontalInset: number;
};

const areHomeValueListItemPropsEqual = (
  prev: HomeValueListItemProps,
  next: HomeValueListItemProps,
) => {
  const prevFolder = prev.item.folder;
  const nextFolder = next.item.folder;

  return (
    prev.index === next.index &&
    prev.onPress === next.onPress &&
    prev.denseHorizontalInset === next.denseHorizontalInset &&
    prev.item.id === next.item.id &&
    prev.item.title === next.item.title &&
    prev.item.fav === next.item.fav &&
    prev.item.pinnedAt === next.item.pinnedAt &&
    prev.item.created === next.item.created &&
    prev.item.lastUpdated === next.item.lastUpdated &&
    (prevFolder?.id ?? null) === (nextFolder?.id ?? null) &&
    (prevFolder?.name ?? null) === (nextFolder?.name ?? null) &&
    (prevFolder?.color ?? null) === (nextFolder?.color ?? null) &&
    (prevFolder?.icon ?? null) === (nextFolder?.icon ?? null)
  );
};

const HomeValueListItem = React.memo(function HomeValueListItem({
  item,
  index,
  onPress,
  denseHorizontalInset,
}: HomeValueListItemProps) {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  return (
    <PerfProfiler id="HomeScreen.ValueListItem" minDurationMs={20}>
      <ListItem
        item={item}
        index={index}
        onPress={handlePress}
        denseSpacing
        denseHorizontalInset={denseHorizontalInset}
      />
    </PerfProfiler>
  );
}, areHomeValueListItemPropsEqual);

const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
  const triggerAdd = route.params?.triggerAdd ?? false;

  const {
    setHeaderWhite,
    setHeaderSpacing,
    setTitlebarCenterGap,
    setTitlebarOverlayDragEnabled,
    theme,
    darkmode,
  } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isFocused = useIsFocused();
  const auth = useAuth();
  const vault = useVault();
  const { isOnline } = useOnline();
  const glassChromeStyle = getGlassChromeStyle(darkmode);
  const screenContentStyle = getScreenContentStyle(theme);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchHeaderVisible, setSearchHeaderVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  const { value: selectedFav, setValue: setSelectedFav } =
    useSetting("FAVORITE_FILTER");
  const { value: selected2FA, setValue: setSelected2FA } =
    useSetting("TWOFA_FILTER");
  const { value: selectedCard, setValue: setSelectedCard } =
    useSetting("CARD_FILTER");
  const { value: windowControlsStyle } = useSetting("WINDOW_CONTROLS_STYLE");
  const { value: dateFormat } = useSetting("DATE_FORMAT");
  const { value: timeFormat } = useSetting("TIME_FORMAT");
  const { value: systemAuthPromptDone, setValue: setSystemAuthPromptDone } =
    useSetting("SYSTEM_AUTH_PROMPT_DONE");

  const [refreshing, setRefreshing] = useState(false);
  const [pullRefreshing, setPullRefreshing] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const sortChipRef = useRef<View>(null);
  const expiryChipRef = useRef<View>(null);
  const toolChipScrollRef = useRef<ScrollView>(null);
  const toolChipHorizontalOffsetRef = useRef(0);
  const toolChipHorizontalTargetOffsetRef = useRef(0);
  const toolChipHorizontalAnimationFrameRef = useRef<number | null>(null);
  const toolChipContentWidthRef = useRef(0);
  const toolChipViewportWidthRef = useRef(0);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<MenuAnchorRect | null>(
    null,
  );
  const [expiryMenuAnchor, setExpiryMenuAnchor] =
    useState<MenuAnchorRect | null>(null);

  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [moduleFilterModalVisible, setModuleFilterModalVisible] =
    useState(false);
  const [moduleFilters, setModuleFilters] = useState<ModulesEnum[]>([]);
  const [selectedModuleFilters, setSelectedModuleFilters] = useState<
    ModulesEnum[]
  >([]);
  const [valueModalVisible, setValueModalVisible] = useState(false);
  const [expiryModalVisible, setExpiryModalVisible] = useState(false);
  const [systemAuthPromptVisible, setSystemAuthPromptVisible] = useState(false);
  const [homeContentVisible, setHomeContentVisible] = useState(true);
  const { provider, accessToken, ensureFreshAccessToken } = useToken();

  const measureAnchor = (
    ref: React.RefObject<View | null>,
    setAnchor: (anchor: MenuAnchorRect | null) => void,
    open: () => void,
  ) => {
    if (Platform.OS !== "web") {
      open();
      return;
    }

    ref.current?.measureInWindow?.((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      open();
    });
  };

  const openSortMenu = () => {
    measureAnchor(sortChipRef, setSortMenuAnchor, () => setShowMenu(true));
  };

  const openExpiryMenu = () => {
    measureAnchor(expiryChipRef, setExpiryMenuAnchor, () =>
      setExpiryModalVisible(true),
    );
  };

  const getMaxToolChipHorizontalOffset = useCallback(
    () =>
      Math.max(
        0,
        toolChipContentWidthRef.current - toolChipViewportWidthRef.current,
      ),
    [],
  );

  const animateToolChipHorizontalScroll = useCallback(() => {
    const current = toolChipHorizontalOffsetRef.current;
    const target = Math.min(
      toolChipHorizontalTargetOffsetRef.current,
      getMaxToolChipHorizontalOffset(),
    );
    const distance = target - current;

    if (Math.abs(distance) < 0.5) {
      toolChipHorizontalOffsetRef.current = target;
      toolChipHorizontalTargetOffsetRef.current = target;
      toolChipHorizontalAnimationFrameRef.current = null;
      toolChipScrollRef.current?.scrollTo({ animated: false, x: target });
      return;
    }

    const next = current + distance * 0.28;
    toolChipHorizontalOffsetRef.current = next;
    toolChipScrollRef.current?.scrollTo({ animated: false, x: next });
    toolChipHorizontalAnimationFrameRef.current = window.requestAnimationFrame(
      animateToolChipHorizontalScroll,
    );
  }, [getMaxToolChipHorizontalOffset]);

  const startToolChipHorizontalScroll = useCallback(
    (targetOffset: number) => {
      toolChipHorizontalTargetOffsetRef.current = Math.min(
        Math.max(0, targetOffset),
        getMaxToolChipHorizontalOffset(),
      );

      if (toolChipHorizontalAnimationFrameRef.current === null) {
        toolChipHorizontalAnimationFrameRef.current =
          window.requestAnimationFrame(animateToolChipHorizontalScroll);
      }
    },
    [animateToolChipHorizontalScroll, getMaxToolChipHorizontalOffset],
  );

  const handleToolChipHorizontalScroll = useCallback((event: any) => {
    const offset = event?.nativeEvent?.contentOffset?.x ?? 0;
    toolChipHorizontalOffsetRef.current = offset;
    if (toolChipHorizontalAnimationFrameRef.current === null) {
      toolChipHorizontalTargetOffsetRef.current = offset;
    }
  }, []);

  const handleToolChipHorizontalWheel = useCallback(
    (event: any) => {
      if (Platform.OS !== "web") return;

      const nativeEvent = event?.nativeEvent ?? event;
      const deltaX = nativeEvent?.deltaX ?? 0;
      const deltaY = nativeEvent?.deltaY ?? 0;
      const rawDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
      const deltaMode = nativeEvent?.deltaMode ?? 0;
      const delta =
        deltaMode === 1
          ? rawDelta * 16
          : deltaMode === 2
            ? rawDelta * toolChipViewportWidthRef.current
            : rawDelta;
      if (!delta) return;

      nativeEvent?.preventDefault?.();
      startToolChipHorizontalScroll(
        toolChipHorizontalTargetOffsetRef.current + delta,
      );
    },
    [startToolChipHorizontalScroll],
  );

  const toolChipHorizontalWheelProps =
    Platform.OS === "web"
      ? ({ onWheel: handleToolChipHorizontalWheel } as any)
      : {};

  useEffect(
    () => () => {
      if (
        Platform.OS === "web" &&
        toolChipHorizontalAnimationFrameRef.current !== null
      ) {
        window.cancelAnimationFrame(
          toolChipHorizontalAnimationFrameRef.current,
        );
      }
    },
    [],
  );

  const saveSelectedFavState = useCallback(
    (fav: boolean) => {
      if (fav) setSelectedModuleFilters([]);
      setSelectedFav(fav);
    },
    [setSelectedFav],
  );

  const saveSelected2FAState = useCallback(
    (twoFA: boolean) => {
      setSearchQuery("");
      if (twoFA) setSelectedModuleFilters([]);
      setSelected2FA(twoFA);
    },
    [setSelected2FA],
  );

  const saveSelectedCardState = useCallback(
    (card: boolean) => {
      setSearchQuery("");
      if (card) setSelectedModuleFilters([]);
      setSelectedCard(card);
    },
    [setSelectedCard],
  );

  const saveSelectedFolderState = useCallback((folder: FolderType | null) => {
    if (folder) setSelectedModuleFilters([]);
    setSelectedFolder(folder);
  }, []);

  const openModuleFilterModal = useCallback(() => {
    setModuleFilterModalVisible(true);
  }, []);

  const isCompactHeader = width < 600;
  const homeGutter = isCompactHeader
    ? homeSpacing.mobileGutter
    : homeSpacing.desktopGutter;
  const homeListItemHorizontalInset = isCompactHeader ? 0 : homeSpacing.sm;
  const homeListContentContainerStyle = useMemo(
    () => ({
      paddingLeft: isCompactHeader ? homeSpacing.sm : 0,
      paddingRight: isCompactHeader ? homeSpacing.sm : 0,
      paddingTop: homeListTopInset,
      paddingBottom: isCompactHeader
        ? Platform.OS === "web"
          ? mobileFolderFilterOverlayHeight + homeListEdgeGap
          : nativeListBottomFadeClear
        : homeSpacing.sm,
    }),
    [isCompactHeader],
  );
  const homeScrollIndicatorInsets = useMemo(
    () => ({
      top: homeListTopInset,
      bottom: isCompactHeader
        ? mobileFolderFilterOverlayHeight + homeListEdgeGap
        : homeSpacing.sm,
    }),
    [isCompactHeader],
  );
  const webHomeListScrollProps =
    Platform.OS === "web"
      ? ({
          dataSet: {
            clavispassHomeListScroll: "",
            compact: isCompactHeader ? "true" : "false",
          },
        } as any)
      : null;
  const webListFadeMaskStyle =
    Platform.OS === "web"
      ? ({
          WebkitMaskImage: isCompactHeader
            ? `linear-gradient(to bottom, transparent 0px, transparent ${webListTopFadeStart}px, black ${webListTopFadeEnd}px, black calc(100% - ${webListBottomFadeStart}px), transparent calc(100% - ${webListBottomFadeEnd}px), transparent 100%)`
            : `linear-gradient(to bottom, transparent 0px, transparent ${webListTopFadeStart}px, black ${webListTopFadeEnd}px, black 100%)`,
          maskImage: isCompactHeader
            ? `linear-gradient(to bottom, transparent 0px, transparent ${webListTopFadeStart}px, black ${webListTopFadeEnd}px, black calc(100% - ${webListBottomFadeStart}px), transparent calc(100% - ${webListBottomFadeEnd}px), transparent 100%)`
            : `linear-gradient(to bottom, transparent 0px, transparent ${webListTopFadeStart}px, black ${webListTopFadeEnd}px, black 100%)`,
        } as any)
      : null;
  const controlsLeft =
    resolveWindowControlsSide(windowControlsStyle) === "left";
  const wideSearchWidth = Math.min(340, Math.max(200, width * 0.32));

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;

    const existingStyle = document.getElementById(HOME_SCROLLBAR_STYLE_ID);
    const css = `
      [data-clavispass-home-list-scroll] *::-webkit-scrollbar-track {
        margin-top: ${homeListTopInset}px;
      }

      [data-clavispass-home-list-scroll][data-compact="true"] *::-webkit-scrollbar-track {
        margin-bottom: ${mobileFolderFilterOverlayHeight + homeListEdgeGap}px;
      }
    `;

    if (existingStyle) {
      existingStyle.textContent = css;
      return;
    }

    const style = document.createElement("style");
    style.id = HOME_SCROLLBAR_STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (!isCompactHeader) {
      setSearchHeaderVisible(false);
      return;
    }

    if (searchQuery.trim() !== "") setSearchHeaderVisible(true);
  }, [isCompactHeader, searchQuery]);

  useEffect(() => {
    if (Platform.OS !== "web" || TITLEBAR_HEIGHT <= 0) return;

    if (!isFocused) {
      setTitlebarCenterGap(0);
      return;
    }

    setTitlebarCenterGap(0);
    setTitlebarOverlayDragEnabled(false);
    return () => {
      setTitlebarCenterGap(0);
    };
  }, [isFocused, setTitlebarCenterGap, setTitlebarOverlayDragEnabled]);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const styleId = "clavispass-home-search-selection-style";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      #home-compact-search,
      #home-compact-search *,
      #home-wide-search,
      #home-wide-search * {
        -webkit-user-select: none;
        user-select: none;
      }

      #home-compact-search input,
      #home-compact-search textarea,
      #home-wide-search input,
      #home-wide-search textarea {
        -webkit-user-select: text;
        user-select: text;
      }

      #home-compact-search input::placeholder,
      #home-compact-search textarea::placeholder,
      #home-wide-search input::placeholder,
      #home-wide-search textarea::placeholder {
        -webkit-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const toggleModuleFilter = useCallback(
    (module: ModulesEnum) => {
      const isSelected = selectedModuleFilters.includes(module);

      setSelectedFolder(null);
      setSelectedFav(false);
      setSelected2FA(false);
      setSelectedCard(false);
      setSearchQuery("");

      setModuleFilters((current) =>
        current.includes(module) ? current : [...current, module],
      );
      setSelectedModuleFilters((current) =>
        isSelected
          ? current.filter((item) => item !== module)
          : [...current, module],
      );
    },
    [selectedModuleFilters, setSelectedCard, setSelected2FA, setSelectedFav],
  );

  const removeModuleFilter = useCallback((module: ModulesEnum) => {
    setModuleFilters((current) => current.filter((item) => item !== module));
    setSelectedModuleFilters((current) =>
      current.filter((item) => item !== module),
    );
  }, []);

  useEffect(() => {
    if (triggerAdd) {
      setValueModalVisible(true);
      navigation.setParams({ triggerAdd: undefined });
    }
  }, [triggerAdd, navigation]);

  useEffect(() => {
    const openAddValue = () => {
      setValueModalVisible(true);
    };

    subscribeOpenAddValue(openAddValue);
    return () => unsubscribeOpenAddValue(openAddValue);
  }, []);

  useEffect(() => {
    if (systemAuthPromptDone) return;
    if (!auth.isLoggedIn) return;

    let cancelled = false;

    (async () => {
      if (Platform.OS === "web" && !(await detectTauriEnvironment())) return;

      const master = auth.getMaster();
      if (!master) return;

      const alreadyEnabled = await isUsingAuthentication();
      if (alreadyEnabled) {
        await setSystemAuthPromptDone(true);
        return;
      }

      const available = await isSystemAuthenticationAvailable();
      if (!cancelled && available) {
        setSystemAuthPromptVisible(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [auth, auth.isLoggedIn, setSystemAuthPromptDone, systemAuthPromptDone]);

  const dismissSystemAuthPrompt = async () => {
    setSystemAuthPromptVisible(false);
    await setSystemAuthPromptDone(true);
  };

  const enableSystemAuth = async () => {
    const master = auth.getMaster();
    if (!master) {
      await dismissSystemAuthPrompt();
      return;
    }

    const isAuthenticated = await authenticateUser();
    if (!isAuthenticated) return;

    await saveAuthentication(master);
    await dismissSystemAuthPrompt();
  };

  useFocusEffect(
    React.useCallback(() => {
      setHomeContentVisible(true);
      let task = InteractionManager.runAfterInteractions(() => {
        setHeaderSpacing(0);
        setHeaderWhite(false);
      });
      return () => {
        task?.cancel?.();
        setHomeContentVisible(false);
      };
    }, []),
  );

  const searchRef = useRef<any>(null);
  const suppressNextCompactSearchOpenRef = useRef(false);

  const closeCompactSearchIfEmpty = useCallback(() => {
    if (!isCompactHeader) return;
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
  }, [isCompactHeader, searchHeaderVisible, searchQuery]);

  const handleHomeContentResponderCapture = useCallback(() => {
    closeCompactSearchIfEmpty();
    return false;
  }, [closeCompactSearchIfEmpty]);

  const openEditScreen = useCallback(
    (item: ValuesType) => {
      closeCompactSearchIfEmpty();
      setHomeContentVisible(false);
      const navigate = () => {
        navigation.navigate("Edit", {
          value: item,
        });
      };

      if (Platform.OS === "web") {
        requestAnimationFrame(navigate);
        return;
      }

      navigate();
    },
    [closeCompactSearchIfEmpty, navigation],
  );

  const openCardDetailsScreen = useCallback(
    (params: {
      accentColor?: string | null;
      faviconUrl?: string | null;
      item: ValuesType;
      sourceUrl?: string | null;
      title: string;
      type: HomeStackParamList["CardDetails"]["type"];
      value: string;
    }) => {
      closeCompactSearchIfEmpty();
      setHomeContentVisible(false);
      const navigate = () => {
        navigation.navigate("CardDetails", {
          value: params.value,
          title: params.title,
          type: params.type,
          sourceUrl: params.sourceUrl ?? extractUrlFromEntry(params.item),
          faviconUrl: params.faviconUrl ?? null,
          accentColor: params.accentColor ?? null,
        });
      };

      if (Platform.OS === "web") {
        requestAnimationFrame(navigate);
        return;
      }

      navigate();
    },
    [closeCompactSearchIfEmpty, navigation],
  );

  useEffect(() => {
    setHeaderWhite(false);
  }, [vault.dirty]);

  const vaultData = useMemo(() => {
    try {
      if (!vault.isUnlocked) return null;
      return vault.exportFullData();
    } catch {
      return null;
    }
  }, [vault.isUnlocked, vault.entries, vault.folders, vault.dirty]);

  const hasCardEntries = useMemo(
    () =>
      (vaultData?.values ?? []).some((item) =>
        item.modules.some(
          (module) => module.module === ModulesEnum.DIGITAL_CARD,
        ),
      ),
    [vaultData],
  );

  const hasTwoFactorEntries = useMemo(
    () =>
      (vaultData?.values ?? []).some((item) =>
        item.modules.some((module) => module.module === ModulesEnum.TOTP),
      ),
    [vaultData],
  );

  useEffect(() => {
    if (!vaultData) return;
    if (selectedCard && !hasCardEntries) setSelectedCard(false);
    if (selected2FA && !hasTwoFactorEntries) setSelected2FA(false);
  }, [
    hasCardEntries,
    hasTwoFactorEntries,
    selected2FA,
    selectedCard,
    setSelected2FA,
    setSelectedCard,
    vaultData,
  ]);

  const filteredValues = useMemo(() => {
    const values = vaultData?.values ?? [];

    const normalizeText = (text: string) =>
      text
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

    const scoreField = (
      value: string | null | undefined,
      query: string,
      prefixWeight: number,
      containsWeight: number,
    ) => {
      if (!value) return Infinity;

      const normalizedValue = normalizeText(value);
      if (!normalizedValue) return Infinity;

      if (normalizedValue.startsWith(query)) return prefixWeight;

      const index = normalizedValue.indexOf(query);
      if (index === -1) return Infinity;

      return containsWeight + index;
    };

    const getDomain = (value: string | null | undefined) => {
      if (!value) return null;

      try {
        const withScheme = /^https?:\/\//i.test(value)
          ? value
          : `https://${value}`;
        return new URL(withScheme).hostname.replace(/^www\./i, "");
      } catch {
        return value.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
      }
    };

    const normalizedQuery = normalizeText(searchQuery.trim());
    const hasQuery = normalizedQuery.length > 0;
    const includeMetaFields = normalizedQuery.length >= 2;
    const activeModuleFilters = new Set(selectedModuleFilters);

    const prefiltered = values.filter((item) => {
      const moduleMatch =
        activeModuleFilters.size === 0 ||
        item.modules.some((module) => activeModuleFilters.has(module.module));
      if (!moduleMatch) return false;

      if (hasQuery) return true;

      const folderMatch =
        selectedFolder === null || item.folder?.id === selectedFolder.id;
      const favMatch = !selectedFav || item.fav;
      return folderMatch && favMatch;
    });

    if (!hasQuery) return orderPinnedFirst(prefiltered);

    const withRelevance = prefiltered.map((item) => {
      const meta = buildEntryMeta(item);
      const domain = getDomain(meta.url);
      const tagScores =
        meta.tags?.map((tag) => scoreField(tag, normalizedQuery, 38, 42)) ?? [];

      const scores = [
        scoreField(item.title, normalizedQuery, 0, 10),
        ...(includeMetaFields
          ? [
              scoreField(domain, normalizedQuery, 30, 36),
              ...tagScores,
              scoreField(meta.username, normalizedQuery, 44, 50),
              scoreField(meta.email, normalizedQuery, 44, 50),
              scoreField(meta.url, normalizedQuery, 62, 68),
              scoreField(meta.phone, normalizedQuery, 80, 86),
              scoreField(meta.wifiName, normalizedQuery, 80, 86),
              scoreField(meta.wifiType, normalizedQuery, 90, 96),
              scoreField((item.folder as any)?.name, normalizedQuery, 92, 98),
            ]
          : []),
      ];

      const relevance = Math.min(...scores);

      return { ...item, _relevance: relevance };
    });

    return withRelevance
      .filter((item) => item._relevance !== Infinity)
      .sort((a, b) => {
        const pinned = comparePinnedFirst(a, b);
        if (pinned !== 0) return pinned;
        return a._relevance - b._relevance;
      });
  }, [
    vaultData,
    searchQuery,
    selectedFolder,
    selectedFav,
    selectedModuleFilters,
  ]);

  const reorderValues = useMemo(() => {
    const values = vaultData?.values ?? [];

    if (searchQuery.trim() !== "") return filteredValues;

    if (selectedCard) {
      return orderPinnedFirst(
        values.filter((item) =>
          item.modules.some(
            (module) => module.module === ModulesEnum.DIGITAL_CARD,
          ),
        ),
      );
    }

    if (selected2FA) {
      return orderPinnedFirst(
        values.filter((item) =>
          item.modules.some((module) => module.module === ModulesEnum.TOTP),
        ),
      );
    }

    return filteredValues;
  }, [filteredValues, searchQuery, selected2FA, selectedCard, vaultData]);

  const openReorderScreen = useCallback(() => {
    setHomeContentVisible(false);
    const values = reorderValues.map((item) => ({
      ...item,
      modules: [...item.modules],
    }));

    const navigate = () => {
      navigation.navigate("Reorder", { values });
    };

    if (Platform.OS === "web") {
      requestAnimationFrame(navigate);
      return;
    }

    navigate();
  }, [navigation, reorderValues]);

  const expiryEntries = useMemo(() => {
    const entries: Array<{
      key: string;
      title: string;
      absoluteLabel: string;
      relativeLabel: string;
      statusLabel: string;
      status: "active" | "dueSoon" | "expired";
      timestamp: number;
      item: ValuesType;
    }> = [];

    const formatRelativeLabel = (remainingMs: number) => {
      const relative = getRelativeInfo(remainingMs);
      const unit =
        relative.kind === "future" || relative.kind === "past"
          ? relative.unit === "day"
            ? t("common:expiryDayShort")
            : relative.unit === "hour"
              ? t("common:expiryHourShort")
              : t("common:expiryMinuteShort")
          : "";

      if (relative.kind === "future") {
        return t("common:expiryIn", { value: relative.value, unit });
      }
      if (relative.kind === "past") {
        return t("common:expiryAgo", { value: relative.value, unit });
      }
      if (relative.kind === "now") return t("common:expiryNow");
      return t("common:expiryJustExpired");
    };

    if (!vaultData?.values) return entries;

    for (const item of vaultData.values) {
      for (const mod of item.modules) {
        if (mod.module !== ModulesEnum.EXPIRY) continue;

        const expiryModule = mod as ExpiryModuleType;
        const iso = expiryModule.value?.trim?.() ?? "";
        if (!iso) continue;

        const timestamp = Date.parse(iso);
        if (Number.isNaN(timestamp)) continue;

        const statusInfo = getStatus(
          iso,
          Date.now(),
          expiryModule.warnBeforeMs ?? 24 * 60 * 60 * 1000,
        );

        if (statusInfo.status === "empty") continue;

        entries.push({
          key: `${item.id}:${mod.id}`,
          title: item.title,
          absoluteLabel: formatAbsoluteLocal(iso, dateFormat, timeFormat),
          relativeLabel:
            statusInfo.status === "expired"
              ? `${t("common:expiryExpiredPrefix")} ${formatRelativeLabel(
                  statusInfo.remainingMs,
                )}`
              : `${t("common:expiryExpires")} ${formatRelativeLabel(
                  statusInfo.remainingMs,
                )}`,
          statusLabel:
            statusInfo.status === "expired"
              ? t("common:expiryExpired")
              : statusInfo.status === "dueSoon"
                ? t("common:expiryDueSoon")
                : t("common:expiryActive"),
          status: statusInfo.status,
          timestamp,
          item,
        });
      }
    }

    return entries.sort((a, b) => a.timestamp - b.timestamp);
  }, [vaultData, dateFormat, timeFormat, t]);

  const expiryOverviewItems = useMemo(
    () =>
      expiryEntries.map((entry) => ({
        key: entry.key,
        title: entry.title,
        absoluteLabel: entry.absoluteLabel,
        relativeLabel: entry.relativeLabel,
        statusLabel: entry.statusLabel,
        status: entry.status,
        onPress: () => {
          setExpiryModalVisible(false);
          openEditScreen(entry.item);
        },
      })),
    [expiryEntries, openEditScreen],
  );

  const refreshData = useCallback(async () => {
    const master = auth.getMaster();

    if (!master || !provider) {
      setRefreshing(false);
      return;
    }

    setRefreshing(true);

    try {
      let tokenToUse: string | null = null;

      if (provider !== "device") {
        tokenToUse = accessToken ?? (await ensureFreshAccessToken());
        if (!tokenToUse) {
          logger.warn("[Home] No access token available for refreshData.");
          return;
        }
      }

      const result = await fetchRemoteVaultFile({
        provider,
        accessToken: tokenToUse ?? "",
        remotePath: "clavispass.lock",
      });

      if (result.status === "error") {
        logger.warn(
          "[Home] refreshData fetch error:",
          result.message,
          result.cause,
        );
        return;
      }

      if (result.status === "not_found") {
        logger.info("[Home] No vault found during refreshData.");
        return;
      }

      const decrypted = await decryptVaultContent(result.content, master);

      if (!decrypted.ok) {
        logger.warn(
          "[Home] refreshData decrypt failed:",
          decrypted.reason,
          decrypted.error,
        );
        return;
      }

      const localVault = vault.exportFullData();
      const mergeResult = mergeVaultData(localVault, decrypted.payload, {
        sameTimestampConflictStrategy: "keepRemote",
      });

      if (areVaultDataEqual(mergeResult.vault, localVault)) {
        vault.markSaved();
      } else {
        vault.update((draft) => {
          draft.vaultId = mergeResult.vault.vaultId;
          draft.version = mergeResult.vault.version;
          draft.folder = mergeResult.vault.folder ?? [];
          draft.values = mergeResult.vault.values ?? [];
          draft.devices = mergeResult.vault.devices ?? [];
          draft.deletedEntries = mergeResult.vault.deletedEntries ?? [];
        });

        if (areVaultDataEqual(mergeResult.vault, decrypted.payload)) {
          vault.markSaved();
        }
      }

      if (mergeResult.summary.conflicts.length > 0) {
        logger.warn("[Home] Vault refresh merge created conflict copies.", {
          conflicts: mergeResult.summary.conflicts.length,
        });
      }

      setSelectedFolder(null);
      saveSelectedFavState(false);
      saveSelected2FAState(false);
      saveSelectedCardState(false);
      setModuleFilters([]);
      setSelectedModuleFilters([]);
    } catch (error) {
      if (error instanceof VaultIdentityMismatchError) {
        triggerGlobalError({
          title: t("common:vaultMismatchTitle"),
          message: t("common:vaultMismatchText"),
          code: "VAULT_IDENTITY_MISMATCH",
        });
      }
      logger.error("[Home] Error during refreshData:", error);
    } finally {
      setRefreshing(false);
    }
  }, [
    accessToken,
    auth,
    ensureFreshAccessToken,
    provider,
    saveSelected2FAState,
    saveSelectedCardState,
    saveSelectedFavState,
    t,
    vault,
  ]);

  const pullRefreshData = useCallback(async () => {
    setPullRefreshing(true);
    try {
      await refreshData();
    } finally {
      setPullRefreshing(false);
    }
  }, [refreshData]);

  const activeListRef = useRef<any>(null);
  const setActiveListRef = React.useCallback((instance: any | null) => {
    activeListRef.current = instance;
  }, []);

  const scrollToTopRef = useRef({
    scrollToTop: () => {
      activeListRef.current?.scrollToOffset?.({
        offset: 0,
        animated: true,
      });
    },
  });

  useScrollToTop(scrollToTopRef);

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={false}
        onRefresh={pullRefreshData}
        colors={[theme.colors.primary]}
        progressBackgroundColor={theme.colors.background}
        tintColor={theme.colors.primary}
        title={t("common:refreshing")}
        titleColor={theme.colors.primary}
      />
    ),
    [
      pullRefreshing,
      pullRefreshData,
      theme.colors.primary,
      theme.colors.background,
      t,
    ],
  );

  const keyExtractor = useCallback((item: ValuesType) => item.id, []);

  const renderValueItem = useCallback(
    ({ item, index }: { item: ValuesType; index: number }) => (
      <HomeValueListItem
        item={item}
        index={index}
        onPress={openEditScreen}
        denseHorizontalInset={homeListItemHorizontalInset}
      />
    ),
    [homeListItemHorizontalInset, openEditScreen],
  );

  const openAnalysisScreen = useCallback(() => {
    closeCompactSearchIfEmpty();
    setHomeContentVisible(false);
    navigation.navigate("Analysis");
  }, [closeCompactSearchIfEmpty, navigation]);

  const actionChipStyle = {
    height: 30,
    borderRadius: 12,
    margin: 0,
  };

  const actionChipTextStyle = {
    fontSize: 12,
    lineHeight: 16,
  };
  const actionChipShellStyle = styles.homeToolChipShell;

  const renderHomeActionChips = () => (
    <ScrollView
      ref={toolChipScrollRef}
      {...toolChipHorizontalWheelProps}
      horizontal
      showsHorizontalScrollIndicator={false}
      onLayout={(event) => {
        toolChipViewportWidthRef.current = event.nativeEvent.layout.width;
      }}
      onContentSizeChange={(contentWidth) => {
        toolChipContentWidthRef.current = contentWidth;
      }}
      onScroll={handleToolChipHorizontalScroll}
      scrollEventThrottle={16}
      contentContainerStyle={{
        alignItems: "center",
        flexDirection: "row",
        flexGrow: 1,
        gap: homeSpacing.sm,
        justifyContent: "flex-start",
        paddingLeft: homeSpacing.sm,
        paddingRight: isCompactHeader ? homeSpacing.sm : homeGutter,
        paddingTop: 0,
        paddingBottom: homeSpacing.xs,
      }}
      style={{ flexGrow: 0, width: "100%" }}
    >
      <View style={actionChipShellStyle}>
        <AppChip
          compact
          icon="refresh"
          disabled={!isOnline || refreshing}
          onPress={refreshData}
          style={actionChipStyle}
          textStyle={actionChipTextStyle}
        >
          {t("common:reload")}
        </AppChip>
      </View>
      <View style={actionChipShellStyle}>
        <AppChip
          compact
          icon="activity"
          onPress={openAnalysisScreen}
          style={actionChipStyle}
          textStyle={actionChipTextStyle}
        >
          {t("home:analysis")}
        </AppChip>
      </View>
      <View style={actionChipShellStyle}>
        <AppChip
          compact
          icon="arrow-split-horizontal"
          disabled={reorderValues.length < 2}
          onPress={openReorderScreen}
          style={actionChipStyle}
          textStyle={actionChipTextStyle}
        >
          {t("home:reorderChip")}
        </AppChip>
      </View>
      <View style={actionChipShellStyle}>
        <AppChip
          compact
          icon="folder-outline"
          onPress={() => setFolderModalVisible(true)}
          style={actionChipStyle}
          textStyle={actionChipTextStyle}
        >
          {t("home:editFolders")}
        </AppChip>
      </View>
      <View ref={sortChipRef} collapsable={false} style={actionChipShellStyle}>
        <AppChip
          compact
          icon="sort-variant"
          onPress={openSortMenu}
          style={actionChipStyle}
          textStyle={actionChipTextStyle}
        >
          {t("home:sort")}
        </AppChip>
      </View>
      {expiryEntries.length > 0 ? (
        <View
          ref={expiryChipRef}
          collapsable={false}
          style={actionChipShellStyle}
        >
          <AppChip
            compact
            icon="calendar-clock-outline"
            onPress={openExpiryMenu}
            style={actionChipStyle}
            textStyle={actionChipTextStyle}
          >
            {`${t("home:expiries")} ${expiryEntries.length}`}
          </AppChip>
        </View>
      ) : null}
    </ScrollView>
  );

  const openAddValueModal = useCallback(() => {
    closeCompactSearchIfEmpty();
    setValueModalVisible(true);
  }, [closeCompactSearchIfEmpty]);

  const renderEmptyVault = () => {
    const tips = [
      t("home:emptyVaultTipCreate"),
      t("home:emptyVaultTipOrganize"),
      t("home:emptyVaultTipAnalyze"),
    ];

    return (
      <ScrollView
        refreshControl={refreshControl}
        contentContainerStyle={[
          styles.emptyVaultScrollContent,
          { paddingHorizontal: width > 600 ? homeSpacing.xl : homeSpacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyVaultPanel}>
          <View
            style={[
              styles.emptyVaultIcon,
              { backgroundColor: theme.colors.secondaryContainer },
            ]}
          >
            <Icon
              source="shield-plus-outline"
              size={34}
              color={theme.colors.primary}
            />
          </View>
          <Text
            variant={width > 600 ? "headlineSmall" : "titleLarge"}
            style={[styles.emptyVaultTitle, { color: theme.colors.onSurface }]}
          >
            {t("home:emptyVaultTitle")}
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.emptyVaultText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t("home:emptyVaultText")}
          </Text>
          <Button
            mode="contained"
            icon="plus"
            onPress={openAddValueModal}
            style={styles.emptyVaultButton}
            contentStyle={styles.emptyVaultButtonContent}
          >
            {t("home:emptyVaultCreate")}
          </Button>
          <View style={styles.emptyVaultTips}>
            {tips.map((tip, index) => (
              <View
                key={tip}
                style={[
                  styles.emptyVaultTip,
                  {
                    borderColor: theme.colors.outlineVariant,
                    backgroundColor: theme.colors.surfaceVariant,
                  },
                ]}
              >
                <Text
                  variant="labelMedium"
                  style={[
                    styles.emptyVaultTipNumber,
                    { color: theme.colors.primary },
                  ]}
                >
                  {index + 1}
                </Text>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.emptyVaultTipText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

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

  const syncBar = (
    <Sync
      bottomPadding={isCompactHeader ? 0 : undefined}
      refreshData={refreshData}
      refreshing={refreshing}
      setRefreshing={setRefreshing}
    />
  );

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

  function renderFlashList() {
    const isFreshVault =
      (vaultData?.values?.length ?? 0) === 0 &&
      searchQuery.trim() === "" &&
      !selectedFav &&
      !selectedFolder &&
      !selectedCard &&
      !selected2FA &&
      selectedModuleFilters.length === 0;

    if (isFreshVault) return renderEmptyVault();

    if (selectedCard && searchQuery === "") {
      let cardEntries: any[] = [];
      if (vaultData?.values) {
        for (const item of vaultData.values) {
          for (const mod of item.modules) {
            const isCard = mod.module === ModulesEnum.DIGITAL_CARD;
            const moduleType = mod as DigitalCardModuleType;
            if (!isCard) continue;
            cardEntries.push({
              key: `${item.id}:${mod.id}`,
              item: item,
              value: moduleType.value,
              type: moduleType.type,
              title: item.title,
              sourceUrl: extractUrlFromEntry(item),
            });
          }
        }
      }
      return (
        <PerfProfiler id="HomeScreen.CardList">
          <FlashList
            ref={setActiveListRef}
            refreshControl={refreshControl}
            contentContainerStyle={homeListContentContainerStyle}
            scrollIndicatorInsets={homeScrollIndicatorInsets}
            drawDistance={homeListDrawDistance}
            data={cardEntries}
            keyExtractor={(item) => item.key}
            getItemType={(item) => item.type}
            renderItem={({ item, index }) => (
              <CardItem
                title={item.title}
                value={item.value}
                type={item.type}
                item={item.item}
                sourceUrl={item.sourceUrl}
                index={index}
                denseSpacing
                denseHorizontalInset={homeListItemHorizontalInset}
                onPressEdit={() => {
                  openEditScreen(item.item);
                }}
                onPress={({ accentColor, sourceUrl, faviconUrl }) => {
                  openCardDetailsScreen({
                    accentColor,
                    faviconUrl,
                    item: item.item,
                    sourceUrl: sourceUrl ?? item.sourceUrl,
                    title: item.title,
                    type: item.type,
                    value: item.value,
                  });
                }}
              />
            )}
          />
        </PerfProfiler>
      );
    }
    if (selected2FA && searchQuery === "") {
      let totpEntries: any[] = [];
      if (vaultData?.values) {
        for (const item of vaultData.values) {
          for (const mod of item.modules) {
            const isTOTP = mod.module === ModulesEnum.TOTP;
            if (!isTOTP) continue;
            totpEntries.push({
              key: `${item.id}:${mod.id}`,
              item: item,
              value: mod.value as string,
            });
          }
        }
      }
      return (
        <PerfProfiler id="HomeScreen.TotpList">
          <FlashList
            ref={setActiveListRef}
            refreshControl={refreshControl}
            contentContainerStyle={homeListContentContainerStyle}
            scrollIndicatorInsets={homeScrollIndicatorInsets}
            drawDistance={homeListDrawDistance}
            data={totpEntries}
            keyExtractor={(item) => item.key}
            renderItem={({ item, index }) => (
              <TotpItem
                value={item.value}
                item={item.item}
                index={index}
                denseSpacing
                denseHorizontalInset={homeListItemHorizontalInset}
                onPress={() => {
                  openEditScreen(item.item);
                }}
              />
            )}
          />
        </PerfProfiler>
      );
    }
    const flashList = (
      <PerfProfiler id="HomeScreen.ValueList">
        <FlashList
          ref={setActiveListRef}
          refreshControl={refreshControl}
          contentContainerStyle={homeListContentContainerStyle}
          scrollIndicatorInsets={homeScrollIndicatorInsets}
          drawDistance={homeListDrawDistance}
          data={filteredValues}
          keyExtractor={keyExtractor}
          renderItem={renderValueItem}
        />
      </PerfProfiler>
    );
    if (Platform.OS === "web") return <Blur>{flashList}</Blur>;
    else return flashList;
  }

  const renderFadedHomeList = () => {
    const list = renderFlashList();

    if (Platform.OS === "web") {
      return (
        <View
          {...webHomeListScrollProps}
          style={[{ flex: 1, width: "100%" }, webListFadeMaskStyle]}
        >
          {list}
        </View>
      );
    }

    return (
      <MaskedView
        style={{ flex: 1, width: "100%" }}
        maskElement={
          <View style={styles.nativeListMask}>
            <LinearGradient
              colors={["transparent", "transparent", "black"]}
              locations={[0, 0.42, 1]}
              style={styles.nativeListMaskTop}
            />
            <View style={styles.nativeListMaskMiddle} />
            {isCompactHeader ? (
              <LinearGradient
                colors={["black", "transparent", "transparent"]}
                locations={[0, 0.58, 1]}
                style={styles.nativeListMaskBottom}
              />
            ) : null}
          </View>
        }
      >
        {list}
      </MaskedView>
    );
  };

  const folderFilter = (
    <PerfProfiler id="HomeScreen.FolderFilter" minDurationMs={8}>
      <FolderFilter
        folder={vaultData?.folder}
        selectedFav={selectedFav}
        setSelectedFav={saveSelectedFavState}
        selectedFolder={selectedFolder}
        setSelectedFolder={saveSelectedFolderState}
        selected2FA={selected2FA}
        setSelected2FA={saveSelected2FAState}
        selectedCard={selectedCard}
        setSelectedCard={saveSelectedCardState}
        hasTwoFactorEntries={hasTwoFactorEntries}
        hasCardEntries={hasCardEntries}
        moduleFilters={moduleFilters}
        selectedModuleFilters={selectedModuleFilters}
        toggleModuleFilter={toggleModuleFilter}
        removeModuleFilter={removeModuleFilter}
        openModuleFilterModal={openModuleFilterModal}
      />
    </PerfProfiler>
  );

  return (
    <AnimatedContainer style={{ display: "flex", justifyContent: "center" }}>
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          <FocusAwareStatusBar
            animated={true}
            style={darkmode ? "light" : "dark"}
            translucent={true}
          />
          <View
            style={{
              ...glassChromeStyle,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingHorizontal:
                isCompactHeader && searchHeaderVisible
                  ? TITLEBAR_HEIGHT > 0
                    ? homeSpacing.xs
                    : homeSpacing.sm
                  : homeGutter,
              paddingTop:
                Constants.statusBarHeight +
                (!isCompactHeader
                  ? homeSpacing.xs
                  : TITLEBAR_HEIGHT > 0
                    ? homeSpacing.xs
                    : homeSpacing.sm),
              paddingBottom: !isCompactHeader
                ? 2
                : TITLEBAR_HEIGHT > 0
                  ? homeSpacing.xs
                  : homeSpacing.sm,
              marginBottom: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
            }}
          >
            <Animated.View
              layout={Layout.duration(180).easing(headerSearchTransition)}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 0,
                marginBottom: 0,
                width: "100%",
                minHeight: isCompactHeader ? undefined : 34,
                gap: homeSpacing.sm,
                position: "relative",
                zIndex: 4,
                paddingLeft:
                  Platform.OS === "web" &&
                  TITLEBAR_HEIGHT > 0 &&
                  isCompactHeader &&
                  controlsLeft
                    ? TITLEBAR_CONTROLS_WIDTH
                    : 0,
                paddingRight:
                  Platform.OS === "web" && TITLEBAR_HEIGHT > 0 && !controlsLeft
                    ? 104
                    : 0,
              }}
            >
              {isCompactHeader && searchHeaderVisible ? (
                <Animated.View
                  id="home-compact-search"
                  entering={compactSearchEnter}
                  exiting={compactSearchExit}
                  layout={Layout.duration(180).easing(headerSearchTransition)}
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
                      placeholder={t("home:search")}
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
                  id="home-header-brand-drag-region"
                  {...(isFocused && !searchHeaderVisible
                    ? webDragRegionProps
                    : null)}
                  entering={FadeInLeft.duration(180).easing(
                    headerSearchTransition,
                  )}
                  exiting={FadeOutLeft.duration(120).easing(
                    headerSearchTransition,
                  )}
                  layout={Layout.duration(180).easing(headerSearchTransition)}
                  style={[
                    {
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: homeSpacing.sm,
                      flex: 1,
                      minWidth: 0,
                      position: "relative",
                      zIndex: 5,
                    },
                    isFocused && !searchHeaderVisible ? webDragStyle : null,
                  ]}
                >
                  <Logo width={20} height={20} />
                  <Text
                    style={{
                      fontFamily: "LexendExa_400Regular",
                      fontSize: 16,
                      lineHeight: 16,
                      color: theme.colors.onSurfaceVariant,
                      userSelect: "none",
                      includeFontPadding: false,
                      paddingRight: homeSpacing.sm,
                    }}
                    numberOfLines={1}
                  >
                    ClavisPass
                  </Text>
                </Animated.View>
              )}
              {!isCompactHeader ? (
                <View
                  id="home-wide-search"
                  style={{
                    height: 34,
                    left: "50%",
                    marginLeft: -wideSearchWidth / 2,
                    position: "absolute",
                    top: 0,
                    width: wideSearchWidth,
                    zIndex: 6,
                    ...webNoDragStyle,
                  }}
                >
                  <SearchInput
                    ref={searchRef}
                    placeholder={t("home:search")}
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
                    accessibilityLabel={t("home:search")}
                    icon="magnify"
                    iconColor={theme.colors.primary}
                    size={22}
                    onPress={openHeaderSearch}
                    style={{
                      margin: 0,
                      marginRight: 2,
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
                  id="home-header-right-drag-region"
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
            </Animated.View>
          </View>
          {!isCompactHeader ? syncBar : null}
          <View
            onStartShouldSetResponderCapture={handleHomeContentResponderCapture}
            style={{
              flex: 1,
              width: "100%",
              paddingTop: 0,
              paddingBottom: isCompactHeader ? 0 : homeSpacing.sm,
              paddingRight: 0,
              paddingLeft: 0,
              flexDirection: width > 600 ? "row-reverse" : "column",
              gap: 0,
              position: "relative",
              ...screenContentStyle,
            }}
          >
            {isFocused && homeContentVisible ? (
              <>
                <View style={{ flex: 1, width: "100%" }}>
                  <View
                    style={{
                      flex: 1,
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {renderFadedHomeList()}
                    <View
                      pointerEvents="box-none"
                      style={styles.homeToolsOverlay}
                    >
                      <View style={styles.homeToolsSurface}>
                        {renderHomeActionChips()}
                      </View>
                    </View>
                    {isCompactHeader ? (
                      <View
                        pointerEvents="box-none"
                        style={styles.mobileFolderFilterOverlay}
                      >
                        <View style={styles.mobileFolderFilterSurface}>
                          {folderFilter}
                        </View>
                      </View>
                    ) : null}
                  </View>
                  {isCompactHeader ? syncBar : null}
                </View>
                {isCompactHeader ? null : folderFilter}
              </>
            ) : (
              <View style={{ flex: 1, width: "100%" }} />
            )}
          </View>

          <HomeFilterMenu
            visible={showMenu}
            setVisible={setShowMenu}
            positionY={
              Constants.statusBarHeight +
              TITLEBAR_HEIGHT +
              (Platform.OS === "web" ? 48 : 90)
            }
            anchorRect={sortMenuAnchor}
          />

          <FolderModal
            visible={folderModalVisible}
            setVisible={setFolderModalVisible}
            folder={vaultData?.folder ?? []}
          />
          <ModuleFilterModal
            visible={moduleFilterModalVisible}
            selectedModules={selectedModuleFilters}
            onToggleModule={toggleModuleFilter}
            onDismiss={() => setModuleFilterModalVisible(false)}
          />
          <ExpiryOverviewModal
            visible={expiryModalVisible}
            setVisible={setExpiryModalVisible}
            positionY={
              Constants.statusBarHeight +
              TITLEBAR_HEIGHT +
              (Platform.OS === "web" ? 48 : 90)
            }
            anchorRect={expiryMenuAnchor}
            items={expiryOverviewItems}
          />
          <Modal
            visible={systemAuthPromptVisible}
            onDismiss={dismissSystemAuthPrompt}
          >
            <View
              style={{
                width: 300,
                minHeight: 190,
                padding: 14,
                borderRadius: 12,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: theme.colors.outlineVariant,
                backgroundColor: theme.colors.background,
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <View style={{ gap: 8, alignItems: "center" }}>
                <View style={{ marginTop: 8, marginBottom: 8 }}>
                  <Icon
                    source="fingerprint"
                    size={56}
                    color={theme.colors.primary}
                  />
                </View>
                <Text variant="headlineSmall" style={{ userSelect: "none" }}>
                  {t("home:systemAuthPromptTitle")}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ userSelect: "none", alignSelf: "stretch" }}
                >
                  {t("home:systemAuthPromptText")}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 6,
                }}
              >
                <Button
                  style={{ borderRadius: 12 }}
                  mode="contained-tonal"
                  onPress={dismissSystemAuthPrompt}
                >
                  {t("home:systemAuthPromptLater")}
                </Button>
                <Button
                  style={{ borderRadius: 12 }}
                  mode="contained"
                  onPress={enableSystemAuth}
                >
                  {t("home:systemAuthPromptEnable")}
                </Button>
              </View>
            </View>
          </Modal>
          <AddValueModal
            visible={valueModalVisible}
            setVisible={setValueModalVisible}
            navigation={navigation}
            favorite={selectedFav}
            folder={selectedFolder}
            searchstring={
              searchQuery !== "" && filteredValues.length === 0
                ? searchQuery
                : null
            }
          />
        </View>
      </BottomSheetModalProvider>
    </AnimatedContainer>
  );
};

const styles = StyleSheet.create({
  emptyVaultScrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: homeSpacing.lg,
    paddingBottom: homeSpacing.xl,
  },
  emptyVaultPanel: {
    width: "100%",
    maxWidth: 520,
    alignItems: "center",
    paddingHorizontal: homeSpacing.lg,
    paddingVertical: homeSpacing.xl,
  },
  emptyVaultIcon: {
    width: 64,
    height: 64,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: homeSpacing.lg,
  },
  emptyVaultTitle: {
    textAlign: "center",
    userSelect: "none",
  },
  emptyVaultText: {
    maxWidth: 390,
    textAlign: "center",
    marginTop: homeSpacing.sm,
    marginBottom: homeSpacing.lg,
    userSelect: "none",
  },
  emptyVaultButton: {
    borderRadius: 8,
    marginBottom: homeSpacing.lg,
  },
  emptyVaultButtonContent: {
    minHeight: 42,
    paddingHorizontal: 8,
  },
  emptyVaultTips: {
    width: "100%",
    gap: homeSpacing.sm,
  },
  emptyVaultTip: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: homeSpacing.md,
    paddingVertical: homeSpacing.sm,
    gap: homeSpacing.sm,
  },
  emptyVaultTipNumber: {
    width: 18,
    textAlign: "center",
    fontWeight: "700",
    userSelect: "none",
  },
  emptyVaultTipText: {
    flex: 1,
    lineHeight: 18,
    userSelect: "none",
  },
  mobileFolderFilterOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -2,
    height: mobileFolderFilterOverlayHeight + 2,
    justifyContent: "flex-end",
    zIndex: 8,
  },
  mobileFolderFilterSurface: {
    position: "relative",
    zIndex: 1,
    minHeight: mobileFolderFilterOverlayHeight - mobileFolderFilterFadeHeight,
    paddingBottom: homeSpacing.sm,
  },
  homeToolsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: homeToolsOverlayHeight,
    zIndex: 8,
    paddingTop: homeToolsTopPadding,
  },
  homeToolsSurface: {
    position: "relative",
    zIndex: 1,
  },
  homeToolChipShell: {
    borderRadius: 12,
    overflow: "hidden",
  },
  nativeListMask: {
    flex: 1,
    width: "100%",
  },
  nativeListMaskTop: {
    height: nativeListTopFadeClear,
    width: "100%",
  },
  nativeListMaskMiddle: {
    flex: 1,
    width: "100%",
    backgroundColor: "black",
  },
  nativeListMaskBottom: {
    height: nativeListBottomFadeClear,
    width: "100%",
  },
});

export default HomeScreen;
