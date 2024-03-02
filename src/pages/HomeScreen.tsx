import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Searchbar, Text, Button, Divider } from "react-native-paper";

import { Chip } from "react-native-paper";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { List } from "react-native-paper";

import { StatusBar } from "expo-status-bar";
import { FlashList } from "@shopify/flash-list";

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import globalStyles from "../ui/globalStyles";

const DATA = [
  {
    title: "First Item",
    icon: "wifi",
  },
  {
    title: "Second Item",
    icon: "lock",
  },
  {
    title: "3 Item",
    icon: "wifi",
  },
  {
    title: "4 Item",
    icon: "wifi",
  },
  {
    title: "5 Item",
    icon: "wifi",
  },
  {
    title: "6 Item",
    icon: "wifi",
  },
  {
    title: "7 Item",
    icon: "wifi",
  },
  {
    title: "8 Item",
    icon: "wifi",
  },
  {
    title: "9 Item",
    icon: "wifi",
  },
];

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

  return (
    <View style={globalStyles.container}>
      {/*<Animated.View style={[styles.box, style]}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          //mode={"view"}
        />
  </Animated.View>*/}
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        loading={true}
        //mode={"view"}
      />
      <View style={{ height: 40, width: "100%" }}>
        <FlashList
          data={FILTER}
          horizontal={true}
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
          data={DATA}
          renderItem={({ item }) => (
            <>
              <List.Item
                title={item.title}
                description="Item description"
                left={(props) => <Icon name={item.icon} size={30} />}
                right={(props) => <Icon name={"chevron-right"} size={30} />}
                onPress={() => navigation.navigate("Edit")}
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
