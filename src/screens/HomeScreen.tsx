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
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Button,
  Chip,
  Icon,
  IconButton,
  Searchbar,
} from "react-native-paper";

import { Text } from "react-native-paper";

import { FlashList } from "@shopify/flash-list";
import Animated, {
  Easing,
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  Layout,
} from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";
import ListItem from "../features/vault/components/items/ListItem";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import getColors from "../shared/ui/linearGradient";
import HomeFilterMenu from "../features/vault/components/menus/HomeFilterMenu";
import Blur from "../shared/components/Blur";
import FolderFilter from "../features/vault/components/FolderFilter";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import {
  useFocusEffect,
  useIsFocused,
  useScrollToTop,
} from "@react-navigation/native";
import { TITLEBAR_HEIGHT } from "../shared/components/CustomTitlebar";
import FolderModal from "../features/vault/components/modals/FolderModal";
import AddValueModal from "../features/vault/components/modals/AddValueModal";
import { useAuth } from "../app/providers/AuthProvider";
import { useTheme } from "../app/providers/ThemeProvider";

import LogoColored from "../shared/ui/LogoColored";
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

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, "Home">;

const listContentContainerStyle = { paddingRight: 4 };
const homeListDrawDistance = Platform.OS === "web" ? 120 : 600;
const headerSearchTransition = Easing.out(Easing.cubic);
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
        cursor: "grab",
      } as any)
    : null;

const VerticalReorderIcon = ({
  color,
  size = 18,
}: {
  color?: string;
  size?: number;
}) => (
  <View
    style={{
      width: size,
      height: size,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View style={{ height: size / 2, marginBottom: -2 }}>
      <Icon source="chevron-up" size={size * 0.72} color={color} />
    </View>
    <View style={{ height: size / 2, marginTop: -2 }}>
      <Icon source="chevron-down" size={size * 0.72} color={color} />
    </View>
  </View>
);

type HomeValueListItemProps = {
  item: ValuesType;
  index: number;
  onPress: (item: ValuesType) => void;
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
}: HomeValueListItemProps) {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  return (
    <PerfProfiler id="HomeScreen.ValueListItem" minDurationMs={20}>
      <ListItem item={item} index={index} onPress={handlePress} />
    </PerfProfiler>
  );
}, areHomeValueListItemPropsEqual);

const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
  const triggerAdd = route.params?.triggerAdd ?? false;

  const { headerWhite, setHeaderWhite, darkmode, setHeaderSpacing, theme } =
    useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isFocused = useIsFocused();
  const auth = useAuth();
  const vault = useVault();
  const { isOnline } = useOnline();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchHeaderVisible, setSearchHeaderVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  const { value: selectedFav, setValue: setSelectedFav } =
    useSetting("FAVORITE_FILTER");
  const { value: selected2FA, setValue: setSelected2FA } =
    useSetting("TWOFA_FILTER");
  const { value: selectedCard, setValue: setSelectedCard } =
    useSetting("CARD_FILTER");
  const { value: dateFormat } = useSetting("DATE_FORMAT");
  const { value: timeFormat } = useSetting("TIME_FORMAT");
  const { value: systemAuthPromptDone, setValue: setSystemAuthPromptDone } =
    useSetting("SYSTEM_AUTH_PROMPT_DONE");

  const [refreshing, setRefreshing] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

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

  useEffect(() => {
    if (!isCompactHeader) {
      setSearchHeaderVisible(false);
      return;
    }

    if (searchQuery.trim() !== "") setSearchHeaderVisible(true);
  }, [isCompactHeader, searchQuery]);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const compactDragRegion = document.getElementById(
      "home-header-brand-drag-region",
    );
    if (!compactDragRegion) return;

    if (!searchHeaderVisible) {
      compactDragRegion.setAttribute("data-tauri-drag-region", "");
      return;
    }

    compactDragRegion.removeAttribute("data-tauri-drag-region");
  }, [isCompactHeader, searchHeaderVisible]);

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
    [
      selectedModuleFilters,
      setSelectedCard,
      setSelected2FA,
      setSelectedFav,
    ],
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
    if (Platform.OS === "web") return;
    if (systemAuthPromptDone) return;
    if (!auth.isLoggedIn) return;

    let cancelled = false;

    (async () => {
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
        setHeaderWhite(true);
      });
      return () => {
        task?.cancel?.();
        setHomeContentVisible(false);
      };
    }, []),
  );

  const openEditScreen = useCallback(
    (item: ValuesType) => {
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
    [navigation],
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
    [navigation],
  );

  useEffect(() => {
    setHeaderWhite(true);
  }, [vault.dirty]);

  const vaultData = useMemo(() => {
    try {
      if (!vault.isUnlocked) return null;
      return vault.exportFullData();
    } catch {
      return null;
    }
  }, [vault.isUnlocked, vault.entries, vault.folders, vault.dirty]);

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

      const scores = [
        scoreField(item.title, normalizedQuery, 0, 10),
        ...(includeMetaFields
          ? [
              scoreField(domain, normalizedQuery, 30, 36),
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
  }, [vaultData, searchQuery, selectedFolder, selectedFav, selectedModuleFilters]);

  const reorderValues = useMemo(() => {
    const values = vaultData?.values ?? [];

    if (searchQuery.trim() !== "") return filteredValues;

    if (selectedCard) {
      return orderPinnedFirst(
        values.filter((item) =>
          item.modules.some((module) => module.module === ModulesEnum.DIGITAL_CARD),
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

  const refreshData = useCallback(() => {
    const master = auth.getMaster();

    if (!master || !provider) {
      setRefreshing(false);
      return;
    }

    setRefreshing(true);

    (async () => {
      try {
        let tokenToUse: string | null = null;

        if (provider !== "device") {
          tokenToUse = accessToken ?? (await ensureFreshAccessToken());
          if (!tokenToUse) {
            logger.warn("[Home] No access token available for refreshData.");
            setRefreshing(false);
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
          setRefreshing(false);
          return;
        }

        if (result.status === "not_found") {
          logger.info("[Home] No vault found during refreshData.");
          setRefreshing(false);
          return;
        }

        const decrypted = await decryptVaultContent(result.content, master);

        if (!decrypted.ok) {
          logger.warn(
            "[Home] refreshData decrypt failed:",
            decrypted.reason,
            decrypted.error,
          );
          setRefreshing(false);
          return;
        }

        vault.unlockWithDecryptedVault(decrypted.payload);
        vault.markSaved();

        setSelectedFolder(null);
        saveSelectedFavState(false);
        saveSelected2FAState(false);
        saveSelectedCardState(false);
        setModuleFilters([]);
        setSelectedModuleFilters([]);
      } catch (error) {
        logger.error("[Home] Error during refreshData:", error);
      } finally {
        setRefreshing(false);
      }
    })();
  }, [
    accessToken,
    auth,
    ensureFreshAccessToken,
    provider,
    saveSelected2FAState,
    saveSelectedCardState,
    saveSelectedFavState,
    vault,
  ]);

  const searchRef = useRef<any>(null);
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
        refreshing={refreshing}
        onRefresh={refreshData}
        colors={[theme.colors.primary]}
        progressBackgroundColor={theme.colors.background}
        tintColor={theme.colors.primary}
        title={t("common:refreshing")}
        titleColor={theme.colors.primary}
      />
    ),
    [refreshing, refreshData, theme.colors.primary, theme.colors.background, t],
  );

  const keyExtractor = useCallback((item: ValuesType) => item.id, []);

  const renderValueItem = useCallback(
    ({ item, index }: { item: ValuesType; index: number }) => (
      <HomeValueListItem
        item={item}
        index={index}
        onPress={openEditScreen}
      />
    ),
    [openEditScreen],
  );

  const actionChipStyle = {
    height: 30,
    borderRadius: 12,
    margin: 0,
  };

  const actionChipTextStyle = {
    fontSize: 12,
    lineHeight: 16,
  };

  const renderHomeActionChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: "center",
        flexDirection: "row-reverse",
        flexGrow: 1,
        gap: 4,
        justifyContent: "flex-start",
        paddingHorizontal: 8,
        paddingBottom: 4,
      }}
      style={{ flexGrow: 0, width: "100%" }}
    >
      <Chip
        compact
        icon="sort-variant"
        onPress={() => setShowMenu(true)}
        style={actionChipStyle}
        textStyle={actionChipTextStyle}
      >
        {t("home:sort")}
      </Chip>
      {expiryEntries.length > 0 ? (
        <Chip
          compact
          icon="calendar-clock"
          onPress={() => setExpiryModalVisible(true)}
          style={actionChipStyle}
          textStyle={actionChipTextStyle}
        >
          {`${t("home:expiries")} ${expiryEntries.length}`}
        </Chip>
      ) : null}
      <Chip
        compact
        icon={({ color, size }) => (
          <VerticalReorderIcon color={color} size={size} />
        )}
        disabled={reorderValues.length < 2}
        onPress={openReorderScreen}
        style={actionChipStyle}
        textStyle={actionChipTextStyle}
      >
        {t("home:reorderChip")}
      </Chip>
      <Chip
        compact
        icon="refresh"
        disabled={!isOnline || refreshing}
        onPress={refreshData}
        style={actionChipStyle}
        textStyle={actionChipTextStyle}
      >
        {t("common:reload")}
      </Chip>
    </ScrollView>
  );

  const openHeaderSearch = useCallback(() => {
    setSearchHeaderVisible(true);
    requestAnimationFrame(() => {
      searchRef.current?.focus?.();
    });
  }, []);

  const closeHeaderSearch = useCallback(() => {
    setSearchHeaderVisible(false);
    setSearchQuery("");
  }, []);

  function renderFlashList() {
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
            contentContainerStyle={{ paddingRight: 4 }}
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
            contentContainerStyle={{ paddingRight: 4 }}
            drawDistance={homeListDrawDistance}
            data={totpEntries}
            keyExtractor={(item) => item.key}
            renderItem={({ item, index }) => (
              <TotpItem
                value={item.value}
                item={item.item}
                index={index}
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
          contentContainerStyle={listContentContainerStyle}
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

  return (
    <AnimatedContainer style={{ display: "flex", justifyContent: "center" }}>
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          <StatusBar
            animated={true}
            style={headerWhite ? "light" : darkmode ? "light" : "dark"}
            translucent={true}
          />
          <LinearGradient
            colors={getColors()}
            dither={true}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              paddingTop:
                Constants.statusBarHeight + (TITLEBAR_HEIGHT > 0 ? 4 : 6),
              paddingBottom: TITLEBAR_HEIGHT > 0 ? 4 : 6,
              marginBottom: 4,
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 6,
              elevation: 5,
            }}
            end={{ x: 0.1, y: 0.2 }}
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
                gap: 8,
                position: "relative",
                zIndex: 4,
                paddingRight:
                  Platform.OS === "web" && TITLEBAR_HEIGHT > 0 && isCompactHeader
                    ? 104
                    : 0,
              }}
            >
              {isCompactHeader && searchHeaderVisible ? (
                <Animated.View
                  entering={FadeInRight.duration(180).easing(
                    headerSearchTransition,
                  )}
                  exiting={FadeOutRight.duration(120).easing(
                    headerSearchTransition,
                  )}
                  layout={Layout.duration(180).easing(headerSearchTransition)}
                  style={[
                    {
                      flex: 1,
                      height: 36,
                      overflow: "hidden",
                      position: "relative",
                      zIndex: 5,
                    },
                    webNoDragStyle,
                  ]}
                >
                  <Searchbar
                    ref={searchRef}
                    inputStyle={{
                      height: 36,
                      minHeight: 36,
                      lineHeight: 18,
                      color: "white",
                    }}
                    style={{
                      height: 36,
                      maxHeight: 36,
                      flex: 1,
                      borderRadius: 10,
                      backgroundColor: "rgba(217, 217, 217, 0.21)",
                      ...webNoDragStyle,
                    }}
                    placeholder={t("home:search")}
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    loading={false}
                    iconColor={"#ffffff80"}
                    placeholderTextColor={"#ffffff80"}
                    right={() =>
                      searchQuery ? (
                        <IconButton
                          accessibilityLabel={t("common:reset")}
                          icon="close"
                          iconColor="#ffffff80"
                          size={20}
                          onPress={() => {
                            setSearchQuery("");
                            searchRef.current?.focus?.();
                          }}
                          style={{
                            marginVertical: 0,
                            marginLeft: 0,
                            marginRight: 1,
                            ...webNoDragStyle,
                          }}
                        />
                      ) : null
                    }
                  />
                </Animated.View>
              ) : (
                <Animated.View
                  id="home-header-brand-drag-region"
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
                      gap: 8,
                      flex: 1,
                      minWidth: 0,
                      position: "relative",
                      zIndex: 5,
                    },
                    !searchHeaderVisible ? webDragStyle : null,
                  ]}
                >
                  <LogoColored width={20} height={20} />
                  <Text
                    style={{
                      fontFamily: "LexendExa_400Regular",
                      fontSize: 16,
                      lineHeight: 16,
                      color: "white",
                      userSelect: "none",
                      includeFontPadding: false,
                      paddingRight: 6,
                    }}
                    numberOfLines={1}
                  >
                    ClavisPass
                  </Text>
                </Animated.View>
              )}
              {!isCompactHeader ? (
                <Searchbar
                  ref={searchRef}
                  inputStyle={{
                    height: 34,
                    minHeight: 34,
                    fontSize: 13,
                    color: "white",
                  }}
                  style={{
                    height: 34,
                    width: Math.min(340, Math.max(200, width * 0.32)),
                    borderRadius: 12,
                    backgroundColor: "rgba(217, 217, 217, 0.18)",
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.14)",
                    position: "relative",
                    zIndex: 5,
                    ...webNoDragStyle,
                  }}
                  placeholder={t("home:search")}
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                  loading={false}
                  iconColor={"#ffffff80"}
                  placeholderTextColor={"#ffffff80"}
                  right={() =>
                    searchQuery ? (
                      <IconButton
                        accessibilityLabel={t("common:reset")}
                        icon="close"
                        iconColor="#ffffff80"
                        size={18}
                        onPress={() => {
                          setSearchQuery("");
                          searchRef.current?.focus?.();
                        }}
                        style={{
                          marginVertical: 0,
                          marginLeft: 0,
                          marginRight: 1,
                          ...webNoDragStyle,
                        }}
                      />
                    ) : null
                  }
                />
              ) : null}
              {isCompactHeader ? (
                <IconButton
                  accessibilityLabel={
                    searchHeaderVisible ? t("home:closeSearch") : t("home:search")
                  }
                  icon={searchHeaderVisible ? "close" : "magnify"}
                  iconColor="white"
                  size={22}
                  onPress={
                    searchHeaderVisible ? closeHeaderSearch : openHeaderSearch
                  }
                  style={{
                    margin: 0,
                    width: 36,
                    height: 36,
                    position: "relative",
                    zIndex: 5,
                    ...webNoDragStyle,
                  }}
                />
              ) : (
                <View style={{ flex: 1 }} />
              )}
            </Animated.View>
          </LinearGradient>
          <Sync
            refreshData={refreshData}
            refreshing={refreshing}
            setRefreshing={setRefreshing}
          />
          <View
            style={{
              flex: 1,
              width: "100%",
              paddingTop: 0,
              paddingBottom: 4,
              paddingRight: 0,
              paddingLeft: width > 600 ? 0 : 4,
              flexDirection: width > 600 ? "row-reverse" : "column",
            }}
          >
            {isFocused && homeContentVisible ? (
              <>
                <View style={{ flex: 1, width: "100%" }}>
                  {renderHomeActionChips()}
                  {renderFlashList()}
                </View>
                <PerfProfiler id="HomeScreen.FolderFilter" minDurationMs={8}>
                  <FolderFilter
                    folder={vaultData?.folder}
                    selectedFav={selectedFav}
                    setSelectedFav={saveSelectedFavState}
                    selectedFolder={selectedFolder}
                    setSelectedFolder={saveSelectedFolderState}
                    setFolderModalVisible={setFolderModalVisible}
                    selected2FA={selected2FA}
                    setSelected2FA={saveSelected2FAState}
                    selectedCard={selectedCard}
                    setSelectedCard={saveSelectedCardState}
                    moduleFilters={moduleFilters}
                    selectedModuleFilters={selectedModuleFilters}
                    toggleModuleFilter={toggleModuleFilter}
                    removeModuleFilter={removeModuleFilter}
                    openModuleFilterModal={openModuleFilterModal}
                  />
                </PerfProfiler>
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
            openEditFolder={() => setFolderModalVisible(true)}
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
                <View style={{ marginTop: 8, marginBottom: 10 }}>
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

export default HomeScreen;
