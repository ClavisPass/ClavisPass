import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Platform, RefreshControl } from "react-native";
import { Searchbar, IconButton, TouchableRipple } from "react-native-paper";

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
import AnimatedContainer from "../components/containers/AnimatedContainer";
import ContentProtection from "../components/ContentProtection";
import { useFocusEffect } from "@react-navigation/native";
import { TITLEBAR_HEIGHT } from "../components/CustomTitlebar";
import theme from "../ui/theme";
import FolderModal from "../components/modals/FolderModal";
import DataType from "../types/DataType";
import SearchShortcut from "../components/shortcuts/SearchShortcut";
import AddValueModal from "../components/modals/AddValueModal";
import uploadData from "../api/uploadData";
import { useToken } from "../contexts/TokenProvider";
import fetchData from "../api/fetchData";
import { encrypt } from "../utils/CryptoLayer";
import { useAuth } from "../contexts/AuthProvider";

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
  const auth = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedFav, setSelectedFav] = useState(false);

  const [refreshing, setRefreshing] = useState(true);

  const [showMenu, setShowMenu] = useState(false);
  const [showSave, setShowSave] = useState(true);

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

  /*useEffect(() => {
    setRefreshing(true);
  }, []);*/

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData(token, tokenType, "clavispass.lock").then((response) => {
      setRefreshing(false);
      //data.setData(response);
      
    });
  }, [refreshing]);

  const [statusbarStyle, setStatusbarStyle] = useState<"dark" | "light">(
    "light"
  );

  const searchRef = useRef<any>();

  const changeFolder = (folder: string[]) => {
    let newData = { ...data.data } as DataType;
    if (newData) {
      newData.folder = folder;
    }
    data.setData(newData);
  };

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
      <View style={{ flex: 1, width: "100%", padding: 4 }}>
        {showSave && (
          <View
            style={{
              height: 40,
              width: "100%",
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <View style={{ backgroundColor: "#00000017" }}>
              <TouchableRipple
                onPress={() => {
                  uploadData(token, tokenType, encrypt(data.data, auth.master?auth.master:""), "clavispass.lock");
                }}
                rippleColor="rgba(0, 0, 0, .32)"
                style={{
                  height: 40,
                  width: 80,
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
              onPress={() => {
                setRefreshing(true);
              }}
              rippleColor="rgba(0, 0, 0, .32)"
              style={{
                height: 40,
                width: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Text
                variant="bodyLarge"
                style={{ textDecorationLine: "underline", userSelect: "none" }}
              >
                Reset
              </Text>
            </TouchableRipple>
          </View>
        )}
        <FlashList
          refreshControl={
            <RefreshControl
              //colors={[color.blue]}
              progressBackgroundColor="#2e2e2e"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={filteredValues}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              onPress={() => {
                navigation.navigate("Edit", {
                  value: item,
                  changeFolder: changeFolder,
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
      />

      <FolderModal
        visible={folderModalVisible}
        setVisible={setFolderModalVisible}
        folder={data?.data ? data.data.folder : []}
        setFolder={changeFolder}
      />
      <AddValueModal
        visible={valueModalVisible}
        setVisible={setValueModalVisible}
        navigation={navigation}
        changeFolder={changeFolder}
      />
    </AnimatedContainer>
  );
}

export default HomeScreen;
