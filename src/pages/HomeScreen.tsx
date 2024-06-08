import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Searchbar, Divider, IconButton } from "react-native-paper";

import { Chip } from "react-native-paper";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { List } from "react-native-paper";

import { FlashList } from "@shopify/flash-list";

import { getData } from "../api/getData";

const DATA = getData();

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import globalStyles from "../ui/globalStyles";
import { useData } from "../contexts/DataProvider";
import { LinearGradient } from "expo-linear-gradient";
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import ListItem from "../components/ListItem";
import theme from "../ui/theme";

const FILTER = [
  {
    title: "Fav",
    icon: "star",
  },
  {
    title: "YEE",
    icon: "folder",
  },
  {
    title: "KP",
    icon: "folder",
  },
  {
    title: "ggggggggeefefeg",
    icon: "folder",
  },
  {
    title: "ggggggggeefefeg",
    icon: "folder",
  },
  {
    title: "ggggggggeefefeg",
    icon: "folder",
  },
];

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
  const [searchQuery, setSearchQuery] = React.useState("");

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
    <View style={globalStyles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={{
          height: 70,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 10,
          paddingTop: 20,
          paddingBottom: 20,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          marginBottom: 10,
        }}
        end={{ x: 0.1, y: 0.2 }}
      >
        <IconButton
          icon="plus"
          size={25}
          onPress={() => console.log("Pressed")}
          iconColor="white"
        />
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
          loading={true}
        />
        <IconButton
          icon="dots-vertical"
          size={25}
          onPress={() => console.log("Pressed")}
          iconColor="white"
        />
      </LinearGradient>
      <View style={{ flex: 1, width: "100%" }}>
        <FlashList
          data={data.data?.values}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              onPress={() => {
                navigation.navigate("Edit", {
                  modules: item.modules,
                  fav: item.fav,
                  created: item.created,
                  lastUpdated: item.lastUpdated,
                  folder: item.folder,
                });
              }}
            />
          )}
          estimatedItemSize={200}
        />
      </View>
      <View style={{ padding: 4, width: "100%", maxHeight: 50 }}>
        <FlashList
          data={FILTER}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              icon={item.icon}
              onPress={() => console.log("Pressed")}
              style={styles.chip}
            >
              {item.title}
            </Chip>
          )}
          estimatedItemSize={5}
        />
      </View>
    </View>
  );
}

export default HomeScreen;
