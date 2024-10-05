import Constants from "expo-constants";
import React, { useRef, useState } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { Chip, Text } from "react-native-paper";
import { TitlebarHeight } from "../components/CustomTitlebar";
import { StatusBar } from "expo-status-bar";
import AnimatedContainer from "../components/containers/AnimatedContainer";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../ui/linearGradient";
import { FlashList } from "@shopify/flash-list";
import { useData } from "../contexts/DataProvider";
import { ValuesListType } from "../types/ValuesType";
import ModulesEnum from "../enums/ModulesEnum";
import { ModuleType } from "../types/ModulesType";
import WifiModuleType from "../types/modules/WifiModuleType";
import { useTheme } from "../contexts/ThemeProvider";
import passwordEntropy from "../utils/Entropy";
import { PieChart } from "react-native-chart-kit";

const styles = StyleSheet.create({
  chip: {
    marginRight: 4,
    borderRadius: 15,
  },
});

const { width } = Dimensions.get("window");
const height = width * 0.6;

const data = [
  {
    name: "Seoul",
    population: 21500000,
    color: "rgba(126, 194, 0, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Beijing",
    population: 527612,
    color: "#fbff00",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Toronto",
    population: 2800000,
    color: "#F00",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
];

function Test() {
  return (
    <View style={{ width: width, height: height }}>
      <LinearGradient
        colors={getColors()}
        dither={true}
        style={{
          margin: 6,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 10,
          marginBottom: 4,
          paddingTop: Constants.statusBarHeight,
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 5,
        }}
        end={{ x: 0.1, y: 0.2 }}
      >
        <PieChart
          data={data}
          width={width - 50}
          height={height - 30}
          chartConfig={{
            //backgroundColor: "#e26a00",
            //backgroundGradientFrom: "#fb8c00",
            //backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `white`,
            labelColor: (opacity = 1) => `white`,
            style: {
              borderRadius: 16,
              marginTop: 50,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "6",
              stroke: "red",
            },
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[0, 0]}
          absolute
        />
      </LinearGradient>
    </View>
  );
}

type cachedPasswordsType = {
  title: string;
  password: string;
  entropy: number;
}[];

function AnalysisScreen({ navigation }: { navigation: any }) {
  const data = useData();
  const { theme } = useTheme();

  const ScrollViewRef: any = useRef<ScrollView>(null);

  const [active, setActive] = React.useState(0);

  const findPasswords = () => {
    let cachedPasswords: cachedPasswordsType = [];
    const values = data?.data?.values;
    if (values) {
      let cachedData = [...values] as ValuesListType;
      cachedData.forEach((item) => {
        const getallPasswords = item.modules.filter(
          (module) => module.module === ModulesEnum.PASSWORD
        );
        getallPasswords.forEach((module: ModuleType) => {
          cachedPasswords = [
            ...cachedPasswords,
            {
              title: item.title,
              password: module.value,
              entropy: passwordEntropy(module.value),
            },
          ];
        });

        const getallWifiPasswords = item.modules.filter(
          (module) => module.module === ModulesEnum.WIFI
        );
        getallWifiPasswords.forEach((module: ModuleType) => {
          const transform = module as WifiModuleType;
          cachedPasswords = [
            ...cachedPasswords,
            {
              title: transform.wifiName,
              password: transform.value,
              entropy: passwordEntropy(transform.value),
            },
          ];
        });
      });
    }

    return cachedPasswords;
  };

  const [cachedPasswordList, setCachedPasswordList] =
    React.useState<cachedPasswordsType>(findPasswords());

  const change = ({ nativeEvent }: any) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );
    if (slide !== active) {
      setActive(slide);
    }
  };
  return (
    <AnimatedContainer
      style={{ marginTop: Constants.statusBarHeight }}
      useFocusEffect={useFocusEffect}
    >
      <StatusBar
        animated={true}
        style="dark"
        backgroundColor="transparent"
        translucent={true}
      />
      <TitlebarHeight />
      <View style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
          <Chip
            onPress={() => {
              ScrollViewRef?.current?.scrollTo({
                animated: true,
                y: 0,
                x: 0,
              });
            }}
            style={styles.chip}
          >
            {"Entropy"}
          </Chip>
          <Chip
            onPress={() => {
              ScrollViewRef?.current?.scrollTo({
                animated: true,
                y: 0,
                x: width,
              });
            }}
            style={styles.chip}
          >
            {"KP"}
          </Chip>
        </View>
        <View style={{ width: width, flex: 1 }}>
          <ScrollView
            ref={ScrollViewRef}
            pagingEnabled
            horizontal
            onScroll={change}
            showsHorizontalScrollIndicator={false}
            //style={{ backgroundColor: "green" }}
          >
            <View style={{ flex: 1, width: "100%" }}>
              <Test />
              <FlashList
                data={cachedPasswordList}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      borderRadius: 8,
                      margin: 6,
                      marginBottom: 0,
                      backgroundColor: theme.colors?.background,
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 4,
                      padding: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 6 }}
                    >
                      <Text style={{ color: theme.colors.primary }}>
                        {index + 1 + "."}
                      </Text>
                      <Text>{item.title}</Text>
                    </View>
                    <Text>{"Entropy: " + item.entropy}</Text>
                  </View>
                )}
                estimatedItemSize={200}
              />
            </View>
            <View style={{ flex: 1, width: "100%" }}>
              <Test />
              <FlashList
                data={cachedPasswordList}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      borderRadius: 8,
                      margin: 6,
                      marginBottom: 0,
                      backgroundColor: theme.colors?.background,
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 4,
                      padding: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 6 }}
                    >
                      <Text style={{ color: theme.colors.primary }}>
                        {index + 1 + "."}
                      </Text>
                      <Text>{item.title}</Text>
                    </View>
                    <Text>{"Entropy: " + item.entropy}</Text>
                  </View>
                )}
                estimatedItemSize={200}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </AnimatedContainer>
  );
}

export default AnalysisScreen;
