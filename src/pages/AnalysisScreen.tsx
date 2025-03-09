import Constants from "expo-constants";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Text, TextInput, TouchableRipple } from "react-native-paper";
import { TitlebarHeight } from "../components/CustomTitlebar";
import { StatusBar } from "expo-status-bar";
import AnimatedContainer from "../components/container/AnimatedContainer";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useData } from "../contexts/DataProvider";
import { ValuesListType } from "../types/ValuesType";
import ModulesEnum from "../enums/ModulesEnum";
import { ModuleType } from "../types/ModulesType";
import WifiModuleType from "../types/modules/WifiModuleType";
import { useTheme } from "../contexts/ThemeProvider";
import passwordEntropy from "../utils/Entropy";
import AnalysisEntry from "../components/AnalysisEntry";
import AnalysisEntryGradient from "../components/AnalysisEntryGradient";
import Divider from "../components/Divider";

export type CachedPasswordsType = {
  title: string;
  password: string;
  entropy: number;
  type: ModulesEnum;
};

function AnalysisScreen({ navigation }: { navigation: any }) {
  const data = useData();
  const { theme, globalStyles } = useTheme();

  const [cachedPasswordList, setCachedPasswordList] = React.useState<
    CachedPasswordsType[] | null
  >(null);

  const [averageEntropy, setAverageEntropy] = useState(0);
  const [averageEntropyPercentage, setAverageEntropyPercentage] = useState(0);
  const [strong, setStrong] = useState(0);
  const [medium, setMedium] = useState(0);
  const [weak, setWeak] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredValues = useMemo(() => {
    return cachedPasswordList?.filter((item) => {
      return item.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [cachedPasswordList, searchQuery]);

  const findPasswords = (values: any) => {
    let cachedPasswords: CachedPasswordsType[] = [];
    if (values) {
      let cachedData = [...values] as ValuesListType;

      let weakCount = 0;
      let mediumCount = 0;
      let strongCount = 0;

      cachedData.forEach((item) => {
        const getallPasswords = item.modules.filter(
          (module) => module.module === ModulesEnum.PASSWORD
        );
        getallPasswords.forEach((module: ModuleType) => {
          const entropy = passwordEntropy(module.value);
          const percentage = entropy / 200;
          if (percentage < 0.4) {
            weakCount++;
            console.log("Counts updated:", weakCount);
          } else if (percentage < 0.55) {
            mediumCount++;
            console.log("Counts updated:", mediumCount);
          } else {
            strongCount++;
            console.log("Counts updated:", strongCount);
          }
          cachedPasswords = [
            ...(cachedPasswords ? cachedPasswords : []),
            {
              title: item.title,
              password: module.value,
              entropy: entropy,
              type: ModulesEnum.PASSWORD,
            },
          ];
        });

        const getallWifiPasswords = item.modules.filter(
          (module) => module.module === ModulesEnum.WIFI
        );

        getallWifiPasswords.forEach((module: ModuleType) => {
          const transform = module as WifiModuleType;
          const entropy = passwordEntropy(transform.value);
          const percentage = entropy / 200;
          if (percentage < 0.4) {
            weakCount++;
            console.log("Counts updated:", weakCount);
          } else if (percentage < 0.55) {
            mediumCount++;
            console.log("Counts updated:", mediumCount);
          } else {
            strongCount++;
            console.log("Counts updated:", strongCount);
          }
          cachedPasswords = [
            ...(cachedPasswords ? cachedPasswords : []),
            {
              title: transform.wifiName,
              password: transform.value,
              entropy: entropy,
              type: ModulesEnum.WIFI,
            },
          ];
        });
      });
      setWeak(weakCount);
      setMedium(mediumCount);
      setStrong(strongCount);
    }

    return cachedPasswords;
  };

  const calculateAverageEntropy = (passwords: CachedPasswordsType[]) => {
    if (passwords.length === 0) return 0;
    const totalEntropy = passwords
      .map((item) => item.entropy)
      .reduce((sum, current) => sum + current, 0);

    const entropy = totalEntropy / passwords.length;
    setAverageEntropy(Math.floor(entropy));
    setAverageEntropyPercentage((entropy / 200) * 100);
  };

  useEffect(() => {
    if (data?.data?.values) {
      const passwords = findPasswords(data?.data?.values);
      setCachedPasswordList(passwords);
      calculateAverageEntropy(passwords);
    }
  }, [data?.data?.values]);

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
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <View
          style={{
            margin: 8,
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              height: 80,
              gap: 8,
            }}
          >
            <AnalysisEntryGradient
              name={"avg. Entropy"}
              number={averageEntropy}
              percentage={averageEntropyPercentage}
            />
            <AnalysisEntry
              name={"Strong"}
              number={strong}
              percentage={
                cachedPasswordList
                  ? (strong / cachedPasswordList.length) * 100
                  : 0
              }
            />
          </View>
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              height: 80,
              gap: 8,
            }}
          >
            <AnalysisEntry
              name={"Medium"}
              number={medium}
              percentage={
                cachedPasswordList
                  ? (medium / cachedPasswordList.length) * 100
                  : 0
              }
            />
            <AnalysisEntry
              name={"Weak"}
              number={weak}
              percentage={
                cachedPasswordList
                  ? (weak / cachedPasswordList.length) * 100
                  : 0
              }
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            borderRadius: 16,
            padding: 12,
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            margin: 8,
            marginTop: 0,
          }}
        >
          <View style={{ height: 40 }}>
            <TextInput
              placeholder="Search"
              placeholderTextColor={"lightgray"}
              outlineStyle={[
                globalStyles.outlineStyle,
                {
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                  backgroundColor: "transparent",
                },
              ]}
              style={[
                globalStyles.textInputStyle,
                {
                  borderColor: theme.colors.primary,
                  borderBottomWidth: 1,
                  backgroundColor: "transparent",
                },
              ]}
              value={searchQuery}
              mode="flat"
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
          </View>
          <FlashList
            data={filteredValues}
            ItemSeparatorComponent={() => <Divider />}
            renderItem={({ item, index }) => (
              <View
                style={{
                  borderRadius: 8,
                  marginBottom: 0,
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
