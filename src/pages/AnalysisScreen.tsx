import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, TextInput, TouchableRipple } from "react-native-paper";
import { TitlebarHeight } from "../components/CustomTitlebar";
import { StatusBar } from "expo-status-bar";
import AnimatedContainer from "../components/container/AnimatedContainer";
import { useFocusEffect } from "@react-navigation/native";
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
import CircularProgressBar from "../components/CircularProgressBar";
import AnalysisEntryContainer from "../components/AnalysisEntry";

function Test() {
  return (
    <View style={{ width: "100%", height: 100 }}>
      <LinearGradient
        colors={getColors()}
        dither={true}
        style={{
          margin: 4,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 10,
          paddingTop: Constants.statusBarHeight,
          borderRadius: 16,
        }}
        end={{ x: 0.1, y: 0.2 }}
      >
        <CircularProgressBar fill={40} maxValue={100} color={"white"} />
      </LinearGradient>
    </View>
  );
}

export type CachedPasswordsType = {
  title: string;
  password: string;
  entropy: number;
  type: ModulesEnum;
};

function AnalysisScreen({ navigation }: { navigation: any }) {
  const data = useData();
  const { theme, globalStyles } = useTheme();

  const [value, setValue] = useState("");

  const [cachedPasswordList, setCachedPasswordList] = React.useState<
    CachedPasswordsType[] | null
  >(null);

  const findPasswords = (values: any) => {
    let cachedPasswords: CachedPasswordsType[] = [];
    if (values) {
      let cachedData = [...values] as ValuesListType;
      cachedData.forEach((item) => {
        const getallPasswords = item.modules.filter(
          (module) => module.module === ModulesEnum.PASSWORD
        );
        getallPasswords.forEach((module: ModuleType) => {
          cachedPasswords = [
            ...(cachedPasswords ? cachedPasswords : []),
            {
              title: item.title,
              password: module.value,
              entropy: passwordEntropy(module.value),
              type: ModulesEnum.PASSWORD,
            },
          ];
        });

        const getallWifiPasswords = item.modules.filter(
          (module) => module.module === ModulesEnum.WIFI
        );
        getallWifiPasswords.forEach((module: ModuleType) => {
          const transform = module as WifiModuleType;
          cachedPasswords = [
            ...(cachedPasswords ? cachedPasswords : []),
            {
              title: transform.wifiName,
              password: transform.value,
              entropy: passwordEntropy(transform.value),
              type: ModulesEnum.WIFI,
            },
          ];
        });
      });
    }

    return cachedPasswords;
  };

  useEffect(() => {
    if (data?.data?.values)
      setCachedPasswordList(findPasswords(data?.data?.values));
  }, [data?.data?.values]);

  return (
    <AnimatedContainer style={{ marginTop: Constants.statusBarHeight }} useFocusEffect={useFocusEffect}>
      <StatusBar
        animated={true}
        style="dark"
        backgroundColor="transparent"
        translucent={true}
      />
      <TitlebarHeight />
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Text variant="bodySmall" style={{ marginLeft: 6, userSelect: "none" }}>
          Statistics
        </Text>
        <Test />
        <Text
          variant="bodySmall"
          style={{ marginTop: 10, marginLeft: 6, userSelect: "none" }}
        >
          Your Entries
        </Text>
        <View style={{ width: "100%", flex: 1, padding: 6 }}>
          <View>
            <TextInput
              placeholder="Search"
              outlineStyle={[globalStyles.outlineStyle, {borderColor: theme.colors.primary, borderWidth: 2}]}
              style={[globalStyles.textInputStyle, {borderColor: theme.colors.primary, borderBottomWidth: 1}]}
              value={value}
              mode="flat"
              onChangeText={(text) => setValue(text)}
              autoCapitalize="none"
            />
          </View>
          <FlashList
            data={cachedPasswordList}
            renderItem={({ item, index }) => (
              <View
                style={{
                  borderRadius: 8,
                  marginBottom: 0,
                  backgroundColor: theme.colors.background,
                  gap: 4,
                  marginTop: 4,
                  overflow: "hidden",
                }}
              >
                <TouchableRipple
                  rippleColor="rgba(0, 0, 0, .32)"
                  onPress={() => {
                    navigation.navigate("AnalysisDetail", {
                      value: item,
                    });
                  }}
                >
                  <View
                    style={{
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
                      <Text
                        style={{
                          color: theme.colors.primary,
                          userSelect: "none",
                        }}
                      >
                        {index + 1 + "."}
                      </Text>
                      <Text style={{ userSelect: "none" }}>{item.title}</Text>
                    </View>
                    <Text style={{ userSelect: "none" }}>
                      {"Entropy: " + item.entropy}
                    </Text>
                  </View>
                </TouchableRipple>
              </View>
            )}
            estimatedItemSize={200}
          />
        </View>
      </View>
    </AnimatedContainer>
  );
}

export default AnalysisScreen;
