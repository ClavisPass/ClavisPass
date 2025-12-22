import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Platform,
  useWindowDimensions,
  InteractionManager,
  RefreshControl,
} from "react-native";
import { Searchbar, IconButton } from "react-native-paper";

import { Text } from "react-native-paper";

import { FlashList } from "@shopify/flash-list";

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
import ContentProtection from "../shared/components/ContentProtection";
import { useFocusEffect } from "@react-navigation/native";
import { TITLEBAR_HEIGHT } from "../shared/components/CustomTitlebar";
import FolderModal from "../features/vault/components/modals/FolderModal";
import { VaultDataTypeSchema } from "../features/vault/model/VaultDataType";
import SearchShortcut from "../shared/components/shortcuts/SearchShortcut";
import AddValueModal from "../features/vault/components/modals/AddValueModal";
import { decrypt } from "../infrastructure/crypto/CryptoLayer";
import { useAuth } from "../app/providers/AuthProvider";
import { CryptoTypeSchema } from "../infrastructure/crypto/CryptoType";
import { useTheme } from "../app/providers/ThemeProvider";

import {
  useFonts,
  LexendExa_400Regular,
  LexendExa_700Bold,
} from "@expo-google-fonts/lexend-exa";
import LogoColored from "../shared/ui/LogoColored";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigation/stacks/Stack";
import FolderType from "../features/vault/model/FolderType";
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

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
  const triggerAdd = route.params?.triggerAdd ?? false;

  const { headerWhite, setHeaderWhite, darkmode, setHeaderSpacing, theme } =
    useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const auth = useAuth();
  const vault = useVault();

  const [fontsLoaded] = useFonts({
    LexendExa_400Regular,
    LexendExa_700Bold,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  const { value: selectedFav, setValue: setSelectedFav } =
    useSetting("FAVORITE_FILTER");
  const { value: selected2FA, setValue: setSelected2FA } =
    useSetting("TWOFA_FILTER");
  const { value: selectedCard, setValue: setSelectedCard } =
    useSetting("CARD_FILTER");

  const [refreshing, setRefreshing] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [valueModalVisible, setValueModalVisible] = useState(false);
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
  }, [triggerAdd]);

  useFocusEffect(
    React.useCallback(() => {
      let task = InteractionManager.runAfterInteractions(() => {
        setHeaderSpacing(0);
        setHeaderWhite(true);
      });
      return () => task?.cancel?.();
    }, [])
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

    const normalizedQuery = normalizeText(searchQuery.trim());
    const hasQuery = normalizedQuery.length > 0;

    const prefiltered = values.filter((item) => {
      if (hasQuery) return true;

      const folderMatch =
        selectedFolder === null || item.folder?.id === selectedFolder.id;
      const favMatch = !selectedFav || item.fav;
      return folderMatch && favMatch;
    });

    const withRelevance = prefiltered.map((item) => {
      if (!hasQuery) return { ...item, _relevance: 0 as number };

      const title = normalizeText(item.title);

      let relevance = Infinity;
      if (title.startsWith(normalizedQuery)) {
        relevance = 0;
      } else {
        const index = title.indexOf(normalizedQuery);
        if (index !== -1) {
          relevance = index + 1;
        }
      }

      return { ...item, _relevance: relevance };
    });

    const result = hasQuery
      ? withRelevance
          .filter((item) => item._relevance !== Infinity)
          .sort((a, b) => a._relevance - b._relevance)
      : withRelevance;

    return result;
  }, [vaultData, searchQuery, selectedFolder, selectedFav]);

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
            result.cause
          );
          setRefreshing(false);
          return;
        }

        if (result.status === "not_found") {
          logger.info("[Home] No vault found during refreshData.");
          setRefreshing(false);
          return;
        }

        const parsedCryptoData = CryptoTypeSchema.parse(
          JSON.parse(result.content)
        );
        const decryptedData = decrypt(parsedCryptoData, master);
        const jsonData = JSON.parse(decryptedData);

        const parsedData = VaultDataTypeSchema.parse(jsonData);
        if (!parsedData) {
          setRefreshing(false);
          return;
        }

        vault.unlockWithDecryptedVault(parsedData);
        vault.markSaved();

        setSelectedFolder(null);
        saveSelectedFavState(false);
        saveSelected2FAState(false);
        saveSelectedCardState(false);

        setRefreshing(false);
      } catch (error) {
        logger.error("[Home] Error during refreshData:", error);
        setRefreshing(false);
      }
    })();
  };

  const searchRef = useRef<any>(null);

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
    [refreshing, refreshData, theme.colors.primary, theme.colors.background, t]
  );

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
            });
          }
        }
      }
      return (
        <FlashList
          refreshControl={refreshControl}
          contentContainerStyle={{ paddingRight: 4 }}
          data={cardEntries}
          renderItem={({ item, index }) => (
            <CardItem
              title={item.title}
              value={item.value}
              type={item.type}
              item={item.item}
              index={index}
              onPressEdit={() => {
                navigation.navigate("Edit", {
                  value: item.item,
                });
              }}
              onPress={() => {
                navigation.navigate("CardDetails", {
                  value: item.value,
                  title: item.title,
                  type: item.type,
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
          refreshControl={refreshControl}
          contentContainerStyle={{ paddingRight: 4 }}
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
    const flashList = (
      <FlashList
        refreshControl={refreshControl}
        contentContainerStyle={{ paddingRight: 4 }}
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
          <ContentProtection enabled={true} />
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
                    color: "white",
                    userSelect: "none",
                    width: 110,
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
          <AddValueModal
            visible={valueModalVisible}
            setVisible={setValueModalVisible}
            navigation={navigation}
            favorite={selectedFav}
            folder={selectedFolder}
          />
        </View>
      </BottomSheetModalProvider>
    </AnimatedContainer>
  );
};

export default HomeScreen;
