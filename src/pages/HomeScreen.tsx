import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Platform, useWindowDimensions, Animated } from "react-native";
import {
  Searchbar,
  IconButton,
  TouchableRipple,
  ActivityIndicator,
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
import uploadData from "../api/uploadData";
import { useToken } from "../contexts/TokenProvider";
import fetchData from "../api/fetchData";
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

type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
  const triggerAdd = route.params?.triggerAdd ?? false;

  const { theme, headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } = useTheme();
  const { width, height } = useWindowDimensions();
  const auth = useAuth();

  const [fontsLoaded] = useFonts({
    LexendExa_400Regular,
    LexendExa_700Bold,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedFav, setSelectedFav] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [valueModalVisible, setValueModalVisible] = useState(false);

  const data = useData();
  const { token, tokenType } = useToken();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (triggerAdd) {
      console.log("Add-Aktion aus HomeScreen erkannt!");
      setValueModalVisible(true);

      // Zustand resetten
      navigation.setParams({ triggerAdd: undefined });
    }
  }, [triggerAdd]);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setHeaderWhite(true);
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
    return data.data?.values.filter((item) => {
      let folderFilter = false;
      if (selectedFolder != "") {
        if (item.folder == selectedFolder) {
          folderFilter = true;
        }
      } else {
        folderFilter = true;
      }
      let favFilter = false;
      if (selectedFav) {
        if (item.fav) {
          favFilter = true;
        }
      } else {
        favFilter = true;
      }
      return (
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        folderFilter &&
        favFilter
      );
    });
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
        }
      });
    } else {
      setRefreshing(false);
    }
  };

  const searchRef = useRef<any>(null);

  function renderFlashList() {
    return (
      <FlashList
        refreshing={false}
        onRefresh={refreshData}
        data={filteredValues}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            onPress={() => {
              navigation.navigate("Edit", {
                value: item,
              });
            }}
          />
        )}
        estimatedItemSize={200}
      />
    );
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
            placeholder="Search"
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
            style={{marginTop: 0, marginBottom: 0, marginRight: 0 }}
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
                  <View style={{ backgroundColor: "#00000017" }}>
                    <TouchableRipple
                      onPress={async () => {
                        setRefreshing(true);
                        const lastUpdated = getDateTime();
                        uploadData(
                          token,
                          tokenType,
                          await encrypt(
                            data.data,
                            auth.master ? auth.master : "",
                            lastUpdated
                          ),
                          "clavispass.lock",
                          () => {
                            data.setShowSave(false);
                            setRefreshing(false);
                          }
                        );
                      }}
                      rippleColor="rgba(0, 0, 0, .32)"
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
                    </TouchableRipple>
                  </View>
                  <TouchableRipple
                    onPress={refreshData}
                    rippleColor="rgba(0, 0, 0, .32)"
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
                  </TouchableRipple>
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
          flexDirection: width > 600 ? "row-reverse" : "column",
        }}
      >
        {Platform.OS === "web" ? (
          <Blur>{renderFlashList()}</Blur>
        ) : (
          renderFlashList()
        )}
        <FolderFilter
          folder={data.data?.folder}
          selectedFav={selectedFav}
          setSelectedFav={setSelectedFav}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          setFolderModalVisible={setFolderModalVisible}
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
          (Platform.OS === "web" ? 48 : 100)
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
      />
    </AnimatedContainer>
  );
};

export default HomeScreen;
