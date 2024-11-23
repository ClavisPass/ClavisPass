import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Platform, RefreshControl } from "react-native";
import {
  Searchbar,
  IconButton,
  TouchableRipple,
  ActivityIndicator,
} from "react-native-paper";

import { Text } from "react-native-paper";

import { FlashList } from "@shopify/flash-list";

//import { getData } from "../api/getData";

//const DATA = getData();

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
import theme from "../ui/theme";
import FolderModal from "../components/modals/FolderModal";
import DataType, { DataTypeSchema } from "../types/DataType";
import SearchShortcut from "../components/shortcuts/SearchShortcut";
import AddValueModal from "../components/modals/AddValueModal";
import uploadData from "../api/uploadData";
import { useToken } from "../contexts/TokenProvider";
import fetchData from "../api/fetchData";
import { decrypt, encrypt } from "../utils/CryptoLayer";
import { useAuth } from "../contexts/AuthProvider";
import changeFolder from "../utils/changeFolder";
import { CryptoTypeSchema } from "../types/CryptoType";

type Props = {
  setShowMenu: (boolean: boolean) => void;
  setValueModalVisible: (boolean: boolean) => void;
};

function Tools(props: Props) {
  return (
    <>
      <IconButton
        icon="plus"
        size={25}
        onPress={() => props.setValueModalVisible(true)}
        iconColor="white"
      />

      <IconButton
        icon="sort-variant"
        size={25}
        onPress={() => {
          props.setShowMenu(true);
        }}
        iconColor="white"
      />
    </>
  );
}

function HomeScreen({ navigation }: { navigation: any }) {
  const didMount = useRef(false);
  const auth = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedFav, setSelectedFav] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [valueModalVisible, setValueModalVisible] = useState(false);

  const data = useData();
  const { token, tokenType } = useToken();

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
          setRefreshing(false);
          data.setShowSave(false);
        }
      });
    } else {
      setRefreshing(false);
    }
  };

  const [statusbarStyle, setStatusbarStyle] = useState<"dark" | "light">(
    "light"
  );

  const searchRef = useRef<any>();

  return (
    <AnimatedContainer
      style={{ display: "flex", justifyContent: "center" }}
      useFocusEffect={useFocusEffect}
    >
      <StatusBar
        animated={true}
        style={statusbarStyle}
        backgroundColor="transparent"
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
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
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
            marginTop: 16,
          }}
        >
          <Text
            variant="titleMedium"
            style={{ color: "white", userSelect: "none" }}
          >
            ClavisPass
          </Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <WebSpecific notIn={true}>
              <Tools
                setShowMenu={setShowMenu}
                setValueModalVisible={setValueModalVisible}
              />
            </WebSpecific>
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
              backgroundColor: "rgba(217, 217, 217, 0.21)",
            }}
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            loading={false}
            iconColor={"#ffffff80"}
            placeholderTextColor={"#ffffff80"}
          />
          <WebSpecific>
            <Tools
              setShowMenu={setShowMenu}
              setValueModalVisible={setValueModalVisible}
            />
          </WebSpecific>
        </View>
      </LinearGradient>
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
                    onPress={() => {
                      setRefreshing(true);
                      uploadData(
                        token,
                        tokenType,
                        encrypt(data.data, auth.master ? auth.master : ""),
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
      <View style={{ flex: 1, width: "100%", padding: 4 }}>
        <FlashList
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
        <WebSpecific>
          <Blur />
        </WebSpecific>
      </View>
      <FolderFilter
        folder={data.data?.folder}
        selectedFav={selectedFav}
        setSelectedFav={setSelectedFav}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        setFolderModalVisible={setFolderModalVisible}
      />
      <HomeFilterMenu
        visible={showMenu}
        setVisible={setShowMenu}
        data={data.data}
        setData={data.setData}
        positionY={
          Constants.statusBarHeight +
          TITLEBAR_HEIGHT +
          (Platform.OS === "web" ? 48 : 66)
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
}

export default HomeScreen;
