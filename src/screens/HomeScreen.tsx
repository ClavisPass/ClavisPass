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
  StyleSheet,
} from "react-native";
import { Searchbar, IconButton, Badge, Button, Icon } from "react-native-paper";

import { Text } from "react-native-paper";

import { FlashList } from "@shopify/flash-list";
import type { RenderItemParams } from "react-native-draggable-flatlist";

import { LinearGradient } from "expo-linear-gradient";
import ListItem from "../features/vault/components/items/ListItem";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import getColors from "../shared/ui/linearGradient";
import WebSpecific from "../infrastructure/platform/WebSpecific";
import HomeFilterMenu from "../features/vault/components/menus/HomeFilterMenu";
import Blur from "../shared/components/Blur";
import FolderFilter from "../features/vault/components/FolderFilter";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import { useFocusEffect, useScrollToTop } from "@react-navigation/native";
import { TITLEBAR_HEIGHT } from "../shared/components/CustomTitlebar";
import FolderModal from "../features/vault/components/modals/FolderModal";
import SearchShortcut from "../shared/components/shortcuts/SearchShortcut";
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
import type ExpiryModuleType from "../features/vault/model/modules/ExpiryModuleType";
import { getRelativeInfo, getStatus } from "../features/vault/utils/expiry";
import { formatAbsoluteLocal } from "../shared/utils/Timestamp";
import { buildEntryMeta } from "../features/vault/utils/modulePolicy";
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

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, "Home">;

const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
  const triggerAdd = route.params?.triggerAdd ?? false;

  const { headerWhite, setHeaderWhite, darkmode, setHeaderSpacing, theme } =
    useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const auth = useAuth();
  const vault = useVault();

  const [searchQuery, setSearchQuery] = useState("");
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
  const [valueModalVisible, setValueModalVisible] = useState(false);
  const [expiryModalVisible, setExpiryModalVisible] = useState(false);
  const [systemAuthPromptVisible, setSystemAuthPromptVisible] = useState(false);
  const { provider, accessToken, ensureFreshAccessToken } = useToken();

  const saveSelectedFavState = (fav: boolean) => {
    setSelectedFav(fav);
  };

  const saveSelected2FAState = (twoFA: boolean) => {
    setSearchQuery("");
    setSelected2FA(twoFA);
  };

  const saveSelectedCardState = (card: boolean) => {
    setSearchQuery("");
    setSelectedCard(card);
  };

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
      let task = InteractionManager.runAfterInteractions(() => {
        setHeaderSpacing(0);
        setHeaderWhite(true);
      });
      return () => task?.cancel?.();
    }, []),
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

    const prefiltered = values.filter((item) => {
      if (hasQuery) return true;

      const folderMatch =
        selectedFolder === null || item.folder?.id === selectedFolder.id;
      const favMatch = !selectedFav || item.fav;
      return folderMatch && favMatch;
    });

    const withRelevance = prefiltered.map((item) => {
      if (!hasQuery) return { ...item, _relevance: 0 as number };

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

    const result = hasQuery
      ? withRelevance
          .filter((item) => item._relevance !== Infinity)
          .sort((a, b) => a._relevance - b._relevance)
      : withRelevance;

    return result;
  }, [vaultData, searchQuery, selectedFolder, selectedFav]);

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

  const refreshData = () => {
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
      } catch (error) {
        logger.error("[Home] Error during refreshData:", error);
      } finally {
        setRefreshing(false);
      }
    })();
  };

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
        refreshing={false}
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

  const canReorderEntries =
    searchQuery.trim() === "" && !selected2FA && !selectedCard;

  const moveEntryAfterPreviousVisibleId = (
    values: ValuesType[],
    movedId: string,
    previousVisibleId: string | null,
  ): ValuesType[] => {
    if (movedId === previousVisibleId) return values;

    const moved = values.find((entry) => entry.id === movedId);
    if (!moved) return values;

    const valuesWithoutMoved = values.filter((entry) => entry.id !== movedId);

    if (previousVisibleId === null) {
      return [moved, ...valuesWithoutMoved];
    }

    const previousIndex = valuesWithoutMoved.findIndex(
      (entry) => entry.id === previousVisibleId,
    );

    if (previousIndex < 0) return values;

    return [
      ...valuesWithoutMoved.slice(0, previousIndex + 1),
      moved,
      ...valuesWithoutMoved.slice(previousIndex + 1),
    ];
  };

  const reorderVisibleValues = (
    values: ValuesType[],
    sourceIndex: number,
    destinationIndex: number,
  ) => {
    const result = [...values];
    const [removed] = result.splice(sourceIndex, 1);
    if (!removed) return result;
    result.splice(destinationIndex, 0, removed);
    return result;
  };

  const applyVisibleReorder = (
    movedId: string | undefined,
    reorderedVisibleValues: ValuesType[],
    destinationIndex: number,
  ) => {
    if (!movedId) return;

    const previousVisibleId =
      destinationIndex <= 0
        ? null
        : (reorderedVisibleValues[destinationIndex - 1]?.id ?? null);

    vault.update((draft) => {
      draft.values = moveEntryAfterPreviousVisibleId(
        draft.values ?? [],
        movedId,
        previousVisibleId,
      );
    });
  };

  const renderReorderListItem = useCallback(
    (
      item: ValuesType,
      index: number,
      onDragStart?: () => void,
      dragHandleProps?: any,
    ) => (
      <ListItem
        item={item}
        index={index}
        reorderMode
        onDragStart={onDragStart}
        dragHandleProps={dragHandleProps}
        onPress={() => {
          navigation.navigate("Edit", {
            value: item,
          });
        }}
      />
    ),
    [navigation],
  );

  const renderWebReorderList = () =>
    (() => {
      const {
        DragDropContext,
        Droppable,
        Draggable,
      } = require("@hello-pangea/dnd");

      return (
        <DragDropContext
          onDragEnd={(result: any) => {
            if (!result.destination) return;
            if (result.source.index === result.destination.index) return;

            const movedId = filteredValues[result.source.index]?.id;
            const reordered = reorderVisibleValues(
              filteredValues,
              result.source.index,
              result.destination.index,
            );

            applyVisibleReorder(
              movedId,
              reordered,
              result.destination.index,
            );
          }}
        >
          <Droppable droppableId="home-values-reorder">
            {(provided: any) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  flex: 1,
                  width: "100%",
                  overflow: "auto",
                  paddingRight: 4,
                }}
              >
                {filteredValues.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(draggableProvided: any) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        style={{
                          userSelect: "none",
                          position: "static",
                          top: "auto",
                          left: "auto",
                          ...draggableProvided.draggableProps.style,
                          marginBottom: 4,
                        }}
                      >
                        {renderReorderListItem(
                          item,
                          index,
                          undefined,
                          draggableProvided.dragHandleProps,
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      );
    })();

  const renderNativeReorderList = () =>
    (() => {
      const draggableFlatListModule = require("react-native-draggable-flatlist");
      const DraggableFlatList =
        draggableFlatListModule.default ?? draggableFlatListModule;

      return (
        <DraggableFlatList
          ref={setActiveListRef}
          refreshControl={refreshControl}
          contentContainerStyle={{ paddingRight: 4 }}
          data={filteredValues}
          keyExtractor={(item: ValuesType) => item.id}
          activationDistance={8}
          initialNumToRender={16}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          removeClippedSubviews
          renderItem={({
            item,
            getIndex,
            drag,
          }: RenderItemParams<ValuesType>) =>
            renderReorderListItem(item, getIndex?.() ?? 0, drag)
          }
          onDragEnd={({
            data,
            from,
            to,
          }: {
            data: ValuesType[];
            from: number;
            to: number;
          }) => {
            if (from === to) return;

            const movedId = filteredValues[from]?.id;
            applyVisibleReorder(movedId, data, to);
          }}
        />
      );
    })();

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
        <FlashList
          ref={setActiveListRef}
          refreshControl={refreshControl}
          contentContainerStyle={{ paddingRight: 4 }}
          drawDistance={600}
          data={cardEntries}
          renderItem={({ item, index }) => (
            <CardItem
              title={item.title}
              value={item.value}
              type={item.type}
              item={item.item}
              sourceUrl={item.sourceUrl}
              index={index}
              onPressEdit={() => {
                navigation.navigate("Edit", {
                  value: item.item,
                });
              }}
              onPress={({ accentColor, sourceUrl, faviconUrl }) => {
                navigation.navigate("CardDetails", {
                  value: item.value,
                  title: item.title,
                  type: item.type,
                  sourceUrl: sourceUrl ?? item.sourceUrl,
                  faviconUrl: faviconUrl ?? null,
                  accentColor: accentColor ?? null,
                });
              }}
            />
          )}
        />
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
        <FlashList
          ref={setActiveListRef}
          refreshControl={refreshControl}
          contentContainerStyle={{ paddingRight: 4 }}
          drawDistance={600}
          data={totpEntries}
          renderItem={({ item, index }) => (
            <TotpItem
              value={item.value}
              item={item.item}
              index={index}
              onPress={() => {
                navigation.navigate("Edit", {
                  value: item.item,
                });
              }}
            />
          )}
        />
      );
    }
    if (canReorderEntries && filteredValues.length > 1) {
      const reorderList =
        Platform.OS === "web"
          ? renderWebReorderList()
          : renderNativeReorderList();

      return <View style={{ flex: 1, width: "100%" }}>{reorderList}</View>;
    }
    const flashList = (
      <FlashList
        ref={setActiveListRef}
        refreshControl={refreshControl}
        contentContainerStyle={{ paddingRight: 4 }}
        drawDistance={600}
        data={filteredValues}
        renderItem={({ item, index }) => (
          <ListItem
            item={item}
            index={index}
            onPress={() => {
              navigation.navigate("Edit", {
                value: item,
              });
            }}
          />
        )}
      />
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
          <WebSpecific>
            <SearchShortcut searchRef={searchRef} />
          </WebSpecific>
          <LinearGradient
            colors={getColors()}
            dither={true}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 10,
              marginBottom: 4,
              paddingTop: Constants.statusBarHeight,
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 12,
                marginBottom: 8,
                marginLeft: 4,
                width: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <LogoColored width={20} height={20} />
                <Text
                  style={{
                    fontFamily: "LexendExa_400Regular",
                    fontSize: 16,
                    lineHeight: 22,
                    color: "white",
                    userSelect: "none",
                    includeFontPadding: false,
                    paddingRight: 6,
                  }}
                >
                  ClavisPass
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Searchbar
                ref={searchRef}
                inputStyle={{ height: 40, minHeight: 40, color: "white" }}
                style={{
                  height: 40,
                  flex: 1,
                  borderRadius: 10,
                  backgroundColor: "rgba(217, 217, 217, 0.21)",
                }}
                placeholder={t("home:search")}
                onChangeText={setSearchQuery}
                value={searchQuery}
                loading={false}
                iconColor={"#ffffff80"}
                placeholderTextColor={"#ffffff80"}
              />
              <IconButton
                icon="sort-variant"
                size={25}
                onPress={() => {
                  setShowMenu(true);
                }}
                iconColor="white"
                style={{ marginTop: 0, marginBottom: 0, marginRight: 0 }}
              />
              {expiryEntries.length > 0 ? (
                <View style={{ position: "relative" }}>
                  <IconButton
                    icon="calendar-clock"
                    size={24}
                    onPress={() => {
                      setExpiryModalVisible(true);
                    }}
                    iconColor="white"
                    style={{ marginTop: 0, marginBottom: 0, marginRight: 0 }}
                  />
                  <Badge
                    size={18}
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      backgroundColor: theme.colors.primary,
                      color: "white",
                    }}
                  >
                    {expiryEntries.length > 99
                      ? "99+"
                      : String(expiryEntries.length)}
                  </Badge>
                </View>
              ) : null}
            </View>
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
              padding: 4,
              paddingRight: 0,
              paddingLeft: width > 600 ? 0 : 4,
              flexDirection: width > 600 ? "row-reverse" : "column",
            }}
          >
            {renderFlashList()}
            <FolderFilter
              folder={vaultData?.folder}
              selectedFav={selectedFav}
              setSelectedFav={saveSelectedFavState}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
              setFolderModalVisible={setFolderModalVisible}
              selected2FA={selected2FA}
              setSelected2FA={saveSelected2FAState}
              selectedCard={selectedCard}
              setSelectedCard={saveSelectedCardState}
            />
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
            refreshData={refreshData}
          />

          <FolderModal
            visible={folderModalVisible}
            setVisible={setFolderModalVisible}
            folder={vaultData?.folder ?? []}
          />
          <ExpiryOverviewModal
            visible={expiryModalVisible}
            setVisible={setExpiryModalVisible}
            positionY={
              Constants.statusBarHeight +
              TITLEBAR_HEIGHT +
              (Platform.OS === "web" ? 48 : 90)
            }
            items={expiryEntries.map((entry) => ({
              key: entry.key,
              title: entry.title,
              absoluteLabel: entry.absoluteLabel,
              relativeLabel: entry.relativeLabel,
              statusLabel: entry.statusLabel,
              status: entry.status,
              onPress: () => {
                setExpiryModalVisible(false);
                navigation.navigate("Edit", {
                  value: entry.item,
                });
              },
            }))}
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
