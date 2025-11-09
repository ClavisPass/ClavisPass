import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Platform,
  useWindowDimensions,
  Animated,
  InteractionManager,
} from "react-native";
import {
  Searchbar,
  IconButton,
  ActivityIndicator,
  Icon,
} from "react-native-paper";

import { Text } from "react-native-paper";

import { FlashList } from "@shopify/flash-list";

import { useData } from "../contexts/DataProvider";
import { LinearGradient } from "expo-linear-gradient";
import ListItem from "../components/items/ListItem";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import getColors from "../ui/linearGradient";
import WebSpecific from "../components/platformSpecific/WebSpecific";
import HomeFilterMenu from "../components/menus/HomeFilterMenu";
import Blur from "../components/Blur";
import FolderFilter from "../components/FolderFilter";
import AnimatedContainer from "../components/container/AnimatedContainer";
import ContentProtection from "../components/ContentProtection";
import { useFocusEffect } from "@react-navigation/native";
import { TITLEBAR_HEIGHT } from "../components/CustomTitlebar";
import FolderModal from "../components/modals/FolderModal";
import { DataTypeSchema } from "../types/DataType";
import SearchShortcut from "../components/shortcuts/SearchShortcut";
import AddValueModal from "../components/modals/AddValueModal";
import uploadData from "../api/uploadData/uploadData";
import { useToken } from "../contexts/TokenProvider";
import fetchData from "../api/fetchData/fetchData";
import { decrypt, encrypt } from "../utils/CryptoLayer";
import { useAuth } from "../contexts/AuthProvider";
import { CryptoTypeSchema } from "../types/CryptoType";
import { useTheme } from "../contexts/ThemeProvider";

import {
  useFonts,
  LexendExa_400Regular,
  LexendExa_700Bold,
} from "@expo-google-fonts/lexend-exa";
import { getDateTime } from "../utils/Timestamp";
import LogoColored from "../ui/LogoColored";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../stacks/Stack";
import { useOnline } from "../contexts/OnlineProvider";
import { saveBackup } from "../utils/Backup";
import FolderType from "../types/FolderType";
import AnimatedPressable from "../components/AnimatedPressable";
import { useTranslation } from "react-i18next";

import * as store from "../utils/store";
import TotpItem from "../components/items/TotpItem";
import ModulesEnum from "../enums/ModulesEnum";
import CardItem from "../components/items/CardItem";
import DigitalCardModuleType from "../types/modules/DigitalCardModuleType";

type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
  const triggerAdd = route.params?.triggerAdd ?? false;

  const { theme, headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } =
    useTheme();
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const auth = useAuth();
  const { isOnline } = useOnline();

  const [fontsLoaded] = useFonts({
    LexendExa_400Regular,
    LexendExa_700Bold,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  const [selectedFav, setSelectedFav] = useState(false);
  const [selected2FA, setSelected2FA] = useState(false);
  const [selectedCard, setSelectedCard] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [valueModalVisible, setValueModalVisible] = useState(false);

  const data = useData();
  const { token, tokenType } = useToken();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    store.get("FAVORITE_FILTER").then((stored) => {
      setSelectedFav(stored);
    });
    store.get("TWOFA_FILTER").then((stored) => {
      setSelected2FA(stored);
    });
    store.get("CARD_FILTER").then((stored) => {
      setSelectedCard(stored);
    });
  }, []);

  const saveSelectedFavState = (fav: boolean) => {
    setSelectedFav(fav);
    store.set("FAVORITE_FILTER", fav);
  };

  const saveSelected2FAState = (twoFA: boolean) => {
    setSelected2FA(twoFA);
    store.set("TWOFA_FILTER", twoFA);
  };

  const saveSelectedCardState = (card: boolean) => {
    setSelectedCard(card);
    store.set("CARD_FILTER", card);
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
    if (data.showSave) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 48,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [data.showSave]);

  const filteredValues = useMemo(() => {
  const values = data.data?.values ?? [];

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  const normalizedQuery = normalizeText(searchQuery.trim());
  const hasQuery = normalizedQuery.length > 0;

  // 1) Wenn es eine Query gibt: NICHT nach fav/folder filtern (alles durchsuchen)
  // 2) Wenn es KEINE Query gibt: normal nach fav/folder filtern
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
}, [data.data, searchQuery, selectedFolder, selectedFav]);


  const refreshData = () => {
    const master = auth.master;
    if (token && tokenType && master) {
      data.setShowSave(true);
      setRefreshing(true);
      fetchData(token, tokenType, "clavispass.lock").then((response) => {
        if (response == null) {
          setRefreshing(false);
        } else {
          const parsedCryptoData = CryptoTypeSchema.parse(JSON.parse(response));
          const decryptedData = decrypt(parsedCryptoData, master);
          const jsonData = JSON.parse(decryptedData);

          const parsedData = DataTypeSchema.parse(jsonData);
          data.setData(parsedData);
          data.setLastUpdated(parsedCryptoData.lastUpdated);
          setRefreshing(false);
          data.setShowSave(false);

          setSelectedFolder(null);
          saveSelectedFavState(false);
          saveSelected2FAState(false);
          saveSelectedCardState(false);
        }
      });
    } else {
      setRefreshing(false);
    }
  };

  const searchRef = useRef<any>(null);

  function renderFlashList() {
    if (selectedCard && searchQuery === "") {
      let cardEntries = [];
      if (data.data?.values) {
        for (const item of data.data.values) {
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
          contentContainerStyle={{ paddingRight: 4 }}
          refreshing={false}
          onRefresh={refreshData}
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
      let totpEntries = [];
      if (data.data?.values) {
        for (const item of data.data.values) {
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
          contentContainerStyle={{ paddingRight: 4 }}
          refreshing={false}
          onRefresh={refreshData}
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
        contentContainerStyle={{ paddingRight: 4 }}
        refreshing={false}
        onRefresh={refreshData}
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
    <AnimatedContainer
      style={{ display: "flex", justifyContent: "center" }}
      useFocusEffect={useFocusEffect}
    >
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
      <Animated.View
        style={{
          height: slideAnim,
          opacity: fadeAnim,
          width: "100%",
          padding: 0,
          margin: 0,
          overflow: "hidden",
        }}
      >
        {data.showSave && (
          <View
            style={{
              height: 48,
              width: "100%",
              padding: 4,
              paddingLeft: 8,
              paddingRight: 8,
            }}
          >
            <View
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: 8,
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {refreshing ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  {isOnline ? (
                    <>
                      <View style={{ backgroundColor: "#00000017" }}>
                        <AnimatedPressable
                          onPress={async () => {
                            setRefreshing(true);
                            const lastUpdated = getDateTime();
                            const encryptedData = await encrypt(
                              data.data,
                              auth.master ? auth.master : "",
                              lastUpdated
                            );
                            uploadData(
                              token,
                              tokenType,
                              encryptedData,
                              "clavispass.lock",
                              () => {
                                saveBackup(encryptedData);
                                data.setShowSave(false);
                                setRefreshing(false);
                              }
                            );
                          }}
                          style={{
                            height: 40,
                            width: 100,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            variant="bodyLarge"
                            style={{ color: "white", userSelect: "none" }}
                          >
                            Save
                          </Text>
                        </AnimatedPressable>
                      </View>
                      <AnimatedPressable
                        onPress={refreshData}
                        style={{
                          height: 40,
                          width: 100,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Text
                          variant="bodyLarge"
                          style={{
                            textDecorationLine: "underline",
                            color: "white",
                            userSelect: "none",
                          }}
                        >
                          Reset
                        </Text>
                      </AnimatedPressable>
                    </>
                  ) : (
                    <Icon source="cloud-off-outline" color="white" size={20} />
                  )}
                </>
              )}
            </View>
          </View>
        )}
      </Animated.View>
      <View
        style={{
          flex: 1,
          width: "100%",
          padding: 4,
          paddingRight: 0,
          flexDirection: width > 600 ? "row-reverse" : "column",
        }}
      >
        {renderFlashList()}
        <FolderFilter
          folder={data.data?.folder}
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
        data={data.data}
        setData={data.setData}
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
        folder={data?.data ? data.data.folder : []}
      />
      <AddValueModal
        visible={valueModalVisible}
        setVisible={setValueModalVisible}
        navigation={navigation}
        favorite={selectedFav}
        folder={selectedFolder}
      />
    </AnimatedContainer>
  );
};

export default HomeScreen;
