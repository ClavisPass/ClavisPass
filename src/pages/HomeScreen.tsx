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
      <View
        style={{
          height: 40,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          icon="plus"
          size={25}
          onPress={() => console.log("Pressed")}
        />
        <Searchbar
          inputStyle={{ height: 40, minHeight: 40 }}
          style={{ height: 40, flex: 1 }}
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          loading={true}
        />
        <IconButton
          icon="dots-vertical"
          size={25}
          onPress={() => console.log("Pressed")}
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
      <View style={{ flex: 1, width: "100%" }}>
        <FlashList
          data={data.data?.values}
          renderItem={({ item }) => (
            <>
              <List.Item
                title={item.modules[0].value}
                description="Item description"
                left={(props) => (
                  <Icon color={"#808080"} name={item.icon} size={30} />
                )}
                right={(props) => (
                  <Icon color={"#808080"} name={"chevron-right"} size={30} />
                )}
                onPress={() =>
                  navigation.navigate("Edit", {
                    modules: item.modules,
                    fav: item.fav,
                    created: item.created,
                    lastUpdated: item.lastUpdated,
                    folder: item.folder,
                  })
                }
              />
              <Divider />
            </>
          )}
          estimatedItemSize={200}
        />
      </View>
    </View>
  );
}

export default HomeScreen;
