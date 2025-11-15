import React, {
  useEffect,
  useMemo,
  useState,
  useDeferredValue,
  startTransition,
} from "react";
import {
  InteractionManager,
  ScrollView,
  useWindowDimensions,
  View,
  StyleSheet,
} from "react-native";
import { Icon, IconButton, Searchbar, Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import AnimatedContainer from "../components/container/AnimatedContainer";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useData } from "../contexts/DataProvider";
import { ValuesListType } from "../types/ValuesType";
import ModulesEnum from "../enums/ModulesEnum";
import WifiModuleType from "../types/modules/WifiModuleType";
import { useTheme } from "../contexts/ThemeProvider";
import passwordEntropy from "../utils/Entropy";
import AnalysisEntry from "../components/AnalysisEntry";
import AnalysisEntryGradient from "../components/AnalysisEntryGradient";
import PasswordStrengthLevel from "../enums/PasswordStrengthLevel";
import getPasswordStrengthColor from "../utils/getPasswordStrengthColor";
import getPasswordStrengthIcon from "../utils/getPasswordStrengthIcon";
import Header from "../components/Header";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../ui/linearGradient";
import FilterAnalysisModal from "../components/modals/FilterAnalysisModal";
import { StackScreenProps } from "@react-navigation/stack/lib/typescript/src/types";
import { RootStackParamList } from "../stacks/Stack";
import AnimatedPressable from "../components/AnimatedPressable";
import { useTranslation } from "react-i18next";
import Animated, { FadeInDown } from "react-native-reanimated";

export type CachedPasswordsType = {
  title: string;
  normalizedTitle: string;
  password: string;
  entropy: number;
  type: ModulesEnum;
  passwordStrengthLevel: PasswordStrengthLevel;
};

type AnalysisScreenProps = StackScreenProps<RootStackParamList, "Analysis">;

type CacheResult = {
  list: CachedPasswordsType[];
  counts: { weak: number; medium: number; strong: number };
  avgEntropy: number;
  avgEntropyPct: number;
};

const normalize = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

function buildCache(values: ValuesListType): CacheResult {
  const out: CachedPasswordsType[] = [];
  let weak = 0,
    medium = 0,
    strong = 0,
    entropySum = 0;

  for (const item of values) {
    const normalizedItemTitle = normalize(item.title);

    for (const mod of item.modules) {
      const isPwd = mod.module === ModulesEnum.PASSWORD;
      const isWifi = mod.module === ModulesEnum.WIFI;
      if (!isPwd && !isWifi) continue;

      const pwd = isPwd ? String(mod.value) : (mod as WifiModuleType).value;
      const title = isPwd
        ? item.title
        : ((mod as WifiModuleType).wifiName ?? item.title);
      const normalizedTitle = isPwd ? normalizedItemTitle : normalize(title);

      const entropy = passwordEntropy(pwd);
      entropySum += entropy;
      const p = entropy / 200;

      let level: PasswordStrengthLevel;
      if (p < 0.4) {
        level = PasswordStrengthLevel.WEAK;
        weak++;
      } else if (p < 0.55) {
        level = PasswordStrengthLevel.MEDIUM;
        medium++;
      } else {
        level = PasswordStrengthLevel.STRONG;
        strong++;
      }

      out.push({
        title,
        normalizedTitle,
        password: pwd,
        entropy,
        type: isPwd ? ModulesEnum.PASSWORD : ModulesEnum.WIFI,
        passwordStrengthLevel: level,
      });
    }
  }

  const avg = out.length ? entropySum / out.length : 0;
  return {
    list: out,
    counts: { weak, medium, strong },
    avgEntropy: Math.floor(avg),
    avgEntropyPct: (avg / 200) * 100,
  };
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ navigation }) => {
  const data = useData();
  const { theme, headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } =
    useTheme();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [cache, setCache] = useState<CacheResult | null>(null);

  const [showStrong, setShowStrong] = useState(true);
  const [showMedium, setShowMedium] = useState(true);
  const [showWeak, setShowWeak] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery.trim());

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setHeaderWhite(false);
    }, [setHeaderSpacing, setHeaderWhite])
  );

  useEffect(() => {
    if (!data?.data?.values) return;
    let cancelled = false;

    InteractionManager.runAfterInteractions(() => {
      if (cancelled) return;
      if (data?.data?.values) {
        const result = buildCache(data.data.values as ValuesListType);
        startTransition(() => {
          if (!cancelled) setCache(result);
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [data?.data?.values]);

  const filteredValues = useMemo(() => {
    if (!cache) return [];
    const q = deferredQuery ? normalize(deferredQuery) : "";

    const matchesStrength = (lvl: PasswordStrengthLevel) =>
      (lvl === PasswordStrengthLevel.STRONG && showStrong) ||
      (lvl === PasswordStrengthLevel.MEDIUM && showMedium) ||
      (lvl === PasswordStrengthLevel.WEAK && showWeak);

    // Relevanz-basiertes Filtern/Sortieren
    const mapped = cache.list.map((it) => {
      if (!q) return { it, rel: 0 };
      if (!matchesStrength(it.passwordStrengthLevel))
        return { it, rel: Infinity };
      const t = it.normalizedTitle;
      if (t.startsWith(q)) return { it, rel: 0 };
      const idx = t.indexOf(q);
      return { it, rel: idx === -1 ? Infinity : idx + 1 };
    });

    return mapped
      .filter((x) => x.rel !== Infinity)
      .sort((a, b) => a.rel - b.rel)
      .map((x) => x.it);
  }, [cache, deferredQuery, showStrong, showMedium, showWeak]);

  const total = cache?.list.length ?? 0;
  const strongCount = cache?.counts.strong ?? 0;
  const mediumCount = cache?.counts.medium ?? 0;
  const weakCount = cache?.counts.weak ?? 0;

  return (
    <AnimatedContainer useFocusEffect={useFocusEffect}>
      <StatusBar
        animated
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent
      />
      <Header title={t("bar:Analysis")} />
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: width > 600 ? "row-reverse" : "column",
          width: "100%",
        }}
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{
            maxWidth: width > 600 ? 180 : undefined,
            margin: 8,
            marginLeft: width > 600 ? 0 : 8,
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flexGrow: 0,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: width > 600 ? "column" : "row",
              justifyContent: "space-evenly",
              height: width > 600 ? undefined : 80,
              gap: 8,
              marginBottom: 8,
            }}
          >
            <AnalysisEntryGradient
              name={t("analysis:averageEntropy")}
              number={cache?.avgEntropy ?? 0}
              percentage={cache?.avgEntropyPct ?? 0}
            />
            <AnalysisEntry
              name={t("analysis:strong")}
              number={strongCount}
              percentage={total ? (strongCount / total) * 100 : 0}
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
              name={t("analysis:medium")}
              number={mediumCount}
              percentage={total ? (mediumCount / total) * 100 : 0}
            />
            <AnalysisEntry
              name={t("analysis:weak")}
              number={weakCount}
              percentage={total ? (weakCount / total) * 100 : 0}
            />
          </View>
        </ScrollView>
        <View style={{ flex: 1, padding: 0 }}>
          <LinearGradient
            colors={getColors()}
            dither
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
              onChangeText={(t) => startTransition(() => setSearchQuery(t))}
              value={searchQuery}
              iconColor={"#ffffff80"}
              placeholderTextColor={"#ffffff80"}
            />
            <IconButton
              icon="filter-variant"
              size={25}
              onPress={() => setFilterModalVisible(true)}
              iconColor="white"
              style={{ marginTop: 0, marginBottom: 0, marginRight: 0 }}
            />
          </LinearGradient>
          <FlashList
            data={filteredValues}
            keyExtractor={(item, idx) => `${item.title}:${idx}:${item.type}`}
            removeClippedSubviews
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInDown.delay(index * 50).duration(250)}
                style={{
                  borderRadius: 12,
                  margin: 8,
                  marginBottom: 4,
                  marginTop: 0,
                  overflow: "hidden",
                  backgroundColor: theme.colors?.background,
                  boxShadow: theme.colors?.shadow,
                  height: 40,
                  borderColor: theme.colors.outlineVariant,
                  borderWidth: StyleSheet.hairlineWidth,
                }}
              >
                <AnimatedPressable
                  onPress={() => {
                    navigation.navigate("AnalysisDetail", { value: item });
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
                        {index + 1}.
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
                </AnimatedPressable>
              </Animated.View>
            )}
            ListEmptyComponent={
              <>
                {cache ? (
                  <View style={{ alignItems: "center", marginTop: 32 }}>
                    <Text style={{ opacity: 0.6 }}>No results</Text>
                  </View>
                ) : null}
              </>
            }
          />
        </View>
      </View>

      <FilterAnalysisModal
        visible={filterModalVisible}
        setVisible={setFilterModalVisible}
        strong={showStrong}
        setStrong={(v) => startTransition(() => setShowStrong(v))}
        medium={showMedium}
        setMedium={(v) => startTransition(() => setShowMedium(v))}
        weak={showWeak}
        setWeak={(v) => startTransition(() => setShowWeak(v))}
      />
    </AnimatedContainer>
  );
};

export default AnalysisScreen;
