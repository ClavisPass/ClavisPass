import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Searchbar, IconButton } from "react-native-paper";

import { Chip, Text } from "react-native-paper";

import { FlashList } from "@shopify/flash-list";

import { getData } from "../api/getData";

const DATA = getData();

import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import globalStyles from "../ui/globalStyles";
import { useData } from "../contexts/DataProvider";
import { LinearGradient } from "expo-linear-gradient";
import ListItem from "../components/ListItem";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import getColors from "../ui/linearGradient";
import { FlatList } from "react-native-gesture-handler";
import WebSpecific from "../components/platformSpecific/WebSpecific";
import HomeFilterMenu from "../components/menus/HomeFilterMenu";

const styles = StyleSheet.create({
  box: {
    width: "100%",
    height: 80,
    backgroundColor: "black",
    margin: 30,
  },
  chip: {
    marginRight: 4,
    borderRadius: 15,
  },
});

function HomeScreen({ navigation }: { navigation: any }) {
  const flatListRef = useRef<FlatList>(null);
  const [flatListOffset, setFlatListOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const data = useData();

  let animatedHeight = useSharedValue(0);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      height: withTiming(animatedHeight.value, config),
    };
  });

  useEffect(() => {
    data.setData(DATA);
  }, []);

  return (
    <View
      style={[
        globalStyles.container,
        { display: "flex", justifyContent: "center" },
      ]}
    >
      <StatusBar
        animated={true}
        style="light"
        backgroundColor="transparent"
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
          padding: 10,
          marginBottom: 4,
          paddingTop: Constants.statusBarHeight,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
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
              <IconButton
                icon="plus"
                size={25}
                onPress={() => console.log("Pressed")}
                iconColor="white"
              />
              <HomeFilterMenu values={data.data?.values} />
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
          />
          <WebSpecific>
            <IconButton
              icon="plus"
              size={25}
              onPress={() => console.log("Pressed")}
              iconColor="white"
            />
            <HomeFilterMenu values={data.data?.values} />
          </WebSpecific>
        </View>
      </LinearGradient>
      <View style={{ flex: 1, width: "100%" }}>
        <FlashList
          data={data.data?.values}
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
      </View>
      <View
        style={{
          padding: 4,
          maxHeight: 50,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <WebSpecific>
          <IconButton
            icon={"chevron-left"}
            style={{ margin: 0 }}
            onPress={() => {
              const offset = flatListOffset - 200;
              setFlatListOffset(offset);
              flatListRef?.current?.scrollToOffset({
                animated: true,
                offset: offset,
              });
            }}
            size={12}
          />
        </WebSpecific>
        <View style={{ flexBasis: "auto", flexShrink: 1 }}>
          <FlatList
            ref={flatListRef}
            data={data.data?.folder}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 1 }}
            ListHeaderComponent={() => {
              return (
                <Chip
                  icon={"star"}
                  onPress={() => console.log("Pressed")}
                  style={styles.chip}
                >
                  {"Favorite"}
                </Chip>
              );
            }}
            renderItem={({ item }) => (
              <Chip
                icon={"folder"}
                onPress={() => console.log("Pressed")}
                style={styles.chip}
              >
                {item}
              </Chip>
            )}
          />
        </View>
        <WebSpecific>
          <IconButton
            icon={"chevron-right"}
            style={{ margin: 0 }}
            onPress={() => {
              const offset = flatListOffset + 200;
              setFlatListOffset(offset);
              flatListRef?.current?.scrollToOffset({
                animated: true,
                offset: offset,
              });
            }}
            size={12}
          />
        </WebSpecific>
      </View>
    </View>
  );
}

export default HomeScreen;
