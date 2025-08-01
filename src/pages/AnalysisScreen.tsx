import Constants from "expo-constants";
import React, { useEffect, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import {
  Icon,
  IconButton,
  Searchbar,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
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
import PasswordStrengthLevel from "../enums/PasswordStrengthLevel";
import getPasswordStrengthColor from "../utils/getPasswordStrengthColor";
import getPasswordStrengthIcon from "../utils/getPasswordStrengthIcon";
import Header from "../components/Header";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../ui/linearGradient";
import FilterAnalysisModal from "../components/modals/FilterAnalysisModal";

export type CachedPasswordsType = {
  title: string;
  password: string;
  entropy: number;
  type: ModulesEnum;
  passwordStrengthLevel: PasswordStrengthLevel;
};

function AnalysisScreen({ navigation }: { navigation: any }) {
  const data = useData();
  const { theme, headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } =
    useTheme();

  const [FilterAnalysisModalVisible, setFilterAnalysisModalVisible] =
    useState(false);

  const { width } = useWindowDimensions();

  const [cachedPasswordList, setCachedPasswordList] = React.useState<
    CachedPasswordsType[] | null
  >(null);

  const [averageEntropy, setAverageEntropy] = useState(0);
  const [averageEntropyPercentage, setAverageEntropyPercentage] = useState(0);
  const [strong, setStrong] = useState(0);
  const [medium, setMedium] = useState(0);
  const [weak, setWeak] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  const [showStrong, setShowStrong] = useState(true);
  const [showMedium, setShowMedium] = useState(true);
  const [showWeak, setShowWeak] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setHeaderWhite(false);
    }, [])
  );

  const filteredValues = useMemo(() => {
    return cachedPasswordList?.filter((item) => {
      const matchesQuery = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const strength = item.passwordStrengthLevel;
      const matchesStrength =
        (strength === PasswordStrengthLevel.STRONG && showStrong) ||
        (strength === PasswordStrengthLevel.MEDIUM && showMedium) ||
        (strength === PasswordStrengthLevel.WEAK && showWeak);

      return matchesQuery && matchesStrength;
    });
  }, [cachedPasswordList, searchQuery, showStrong, showMedium, showWeak]);

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
          let passwordStrengthLevel: PasswordStrengthLevel;
          if (percentage < 0.4) {
            passwordStrengthLevel = PasswordStrengthLevel.WEAK;
            weakCount++;
          } else if (percentage < 0.55) {
            passwordStrengthLevel = PasswordStrengthLevel.MEDIUM;
            mediumCount++;
          } else {
            passwordStrengthLevel = PasswordStrengthLevel.STRONG;
            strongCount++;
          }
          cachedPasswords = [
            ...(cachedPasswords ? cachedPasswords : []),
            {
              title: item.title,
              password: module.value,
              entropy: entropy,
              type: ModulesEnum.PASSWORD,
              passwordStrengthLevel: passwordStrengthLevel,
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
          let passwordStrengthLevel: PasswordStrengthLevel;
          if (percentage < 0.4) {
            passwordStrengthLevel = PasswordStrengthLevel.WEAK;
            weakCount++;
          } else if (percentage < 0.55) {
            passwordStrengthLevel = PasswordStrengthLevel.MEDIUM;
            mediumCount++;
          } else {
            passwordStrengthLevel = PasswordStrengthLevel.STRONG;
            strongCount++;
          }
          cachedPasswords = [
            ...(cachedPasswords ? cachedPasswords : []),
            {
              title: transform.wifiName,
              password: transform.value,
              entropy: entropy,
              type: ModulesEnum.WIFI,
              passwordStrengthLevel: passwordStrengthLevel,
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
    <AnimatedContainer useFocusEffect={useFocusEffect}>
      <StatusBar
        animated={true}
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent={true}
      />
      <Header title="Analysis" />
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: width > 600 ? "row-reverse" : "column",
          width: "100%",
        }}
      >
        <View
          style={{
            margin: 8,
            marginLeft: width > 600 ? 0 : 8,
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: width > 600 ? "column" : "row",
              justifyContent: "space-evenly",
              height: width > 600 ? undefined : 80,
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
              flexDirection: width > 600 ? "column" : "row",
              justifyContent: "space-evenly",
              height: width > 600 ? undefined : 80,
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
            padding: 0,
          }}
        >
          <LinearGradient
            colors={getColors()}
            dither={true}
            style={{
              display: "flex",
              flexDirection: "row",
              padding: 10,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 6,
              elevation: 5,
              margin: 8,
              marginTop: 0,
              alignItems: "center",
            }}
            end={{ x: 0.1, y: 0.2 }}
          >
            <Searchbar
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
              icon="filter-variant"
              size={25}
              onPress={() => {
                setFilterAnalysisModalVisible(true);
              }}
              iconColor="white"
              style={{ marginTop: 0, marginBottom: 0, marginRight: 0 }}
            />
          </LinearGradient>
          <FlashList
            data={filteredValues}
            renderItem={({ item, index }) => (
              <View
                style={{
                  borderRadius: 12,
                  margin: 8,
                  marginBottom: 4,
                  marginTop: 0,
                  overflow: "hidden",
                  //width: "100%",
                  backgroundColor: theme.colors?.background,
                  boxShadow: theme.colors?.shadow,
                  height: 40,
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

                    <Icon
                      source={getPasswordStrengthIcon(
                        item.passwordStrengthLevel
                      )}
                      size={20}
                      color={getPasswordStrengthColor(
                        item.passwordStrengthLevel
                      )}
                    />
                  </View>
                </TouchableRipple>
              </View>
            )}
            estimatedItemSize={200}
          />
        </View>
      </View>
      <FilterAnalysisModal
        visible={FilterAnalysisModalVisible}
        setVisible={setFilterAnalysisModalVisible}
        strong={showStrong}
        setStrong={setShowStrong}
        medium={showMedium}
        setMedium={setShowMedium}
        weak={showWeak}
        setWeak={setShowWeak}
      />
    </AnimatedContainer>
  );
}

export default AnalysisScreen;
