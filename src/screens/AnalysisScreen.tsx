import React, {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  InteractionManager,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useScrollToTop } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ActivityIndicator,
  Chip,
  Divider,
  Icon,
  Searchbar,
  Text,
} from "react-native-paper";

import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import AnimatedPressable from "../shared/components/AnimatedPressable";
import Header from "../shared/components/Header";

import { useAuthMaster } from "../app/providers/AuthProvider";
import { useOnline } from "../app/providers/OnlineProvider";
import { useTheme } from "../app/providers/ThemeProvider";
import { useVault } from "../app/providers/VaultProvider";
import { useTranslation } from "react-i18next";

import {
  buildAnalysisCache,
  deriveAnalysisPepperFromMaster,
  normalize,
} from "../features/analysis/utils/analysisEngine";
import {
  riskScoreFromCached,
  severityForRiskScore,
} from "../features/analysis/utils/riskModel";
import getPasswordStrengthColor from "../features/analysis/utils/getPasswordStrengthColor";
import getPasswordStrengthIcon from "../features/analysis/utils/getPasswordStrengthIcon";
import PasswordStrengthLevel from "../features/analysis/model/PasswordStrengthLevel";
import ModulesEnum from "../features/vault/model/ModulesEnum";
import WifiModuleType from "../features/vault/model/modules/WifiModuleType";
import { AnalysisStackParamList } from "../app/navigation/model/types";
import { FiltersNarrow } from "../features/analysis/components/Filter";

type AnalysisScreenProps = NativeStackScreenProps<
  AnalysisStackParamList,
  "Analysis"
>;

type RiskBucket =
  | "all"
  | "itemsToFix"
  | "compromised"
  | "reused"
  | "weak"
  | "similar";
type QualityBucket = "all" | "strong" | "medium" | "weak";
type AnalysisTab = "quality" | "risk";
type FilterItem = { key: string; title: string };
type Severity = "Critical" | "High" | "Medium" | "Low" | "OK";

const GAP = 8;

function filterValuesWithNonEmptySecrets(values: any[]) {
  const out: any[] = [];

  for (const v of values ?? []) {
    if (!v?.modules || !Array.isArray(v.modules)) continue;

    const keptModules = v.modules.filter((m: any) => {
      const isPwd = m?.module === ModulesEnum.PASSWORD;
      const isWifi = m?.module === ModulesEnum.WIFI;
      if (!isPwd && !isWifi) return false;

      const secret = isPwd
        ? String((m as any)?.value ?? "")
        : String(((m as WifiModuleType)?.value ?? ""));

      return secret.trim().length > 0;
    });

    if (keptModules.length === 0) continue;
    out.push({ ...v, modules: keptModules });
  }

  return out;
}

function getItemRisk(it: any) {
  const flags = it?.flags ?? {};
  const strength = it?.strength as PasswordStrengthLevel;
  const riskScore = riskScoreFromCached(strength, flags);

  const compromised = !!flags.isCompromised;
  const reused = (flags.reuseGroupSize ?? 0) >= 2;
  const similar = (flags.variantGroupSize ?? 0) >= 2;
  const tooShort = !!flags.isShort;
  const sequential = !!flags.hasSequential;
  const repeated = !!flags.hasRepeatedChars;
  const weak = strength === PasswordStrengthLevel.WEAK;

  return {
    compromised,
    reused,
    similar,
    weak,
    tooShort,
    sequential,
    repeated,
    weight: riskScore,
  };
}

function matchesRiskBucket(it: any, bucket: RiskBucket) {
  const risk = getItemRisk(it);

  if (bucket === "all") return true;
  if (bucket === "itemsToFix") return risk.weight > 0;
  if (bucket === "compromised") return risk.compromised;
  if (bucket === "reused") return risk.reused;
  if (bucket === "similar") return risk.similar;
  if (bucket === "weak")
    return risk.weak || risk.tooShort || risk.sequential || risk.repeated;

  return true;
}

function matchesQualityBucket(it: any, bucket: QualityBucket) {
  const strength = it?.strength as PasswordStrengthLevel;
  if (bucket === "all") return true;
  if (bucket === "strong") return strength === PasswordStrengthLevel.STRONG;
  if (bucket === "medium") return strength === PasswordStrengthLevel.MEDIUM;
  return strength === PasswordStrengthLevel.WEAK;
}

function strengthRank(strength: PasswordStrengthLevel) {
  if (strength === PasswordStrengthLevel.WEAK) return 0;
  if (strength === PasswordStrengthLevel.MEDIUM) return 1;
  return 2;
}

function sortByRiskThenTitle(a: any, b: any) {
  const ra = getItemRisk(a).weight;
  const rb = getItemRisk(b).weight;
  if (rb !== ra) return rb - ra;
  return String(a?.title ?? "").localeCompare(String(b?.title ?? ""));
}

function sortByStrengthThenTitle(a: any, b: any) {
  const strengthDelta = strengthRank(a.strength) - strengthRank(b.strength);
  if (strengthDelta !== 0) return strengthDelta;
  if (a.entropyBits !== b.entropyBits) return a.entropyBits - b.entropyBits;
  return String(a?.title ?? "").localeCompare(String(b?.title ?? ""));
}

function riskProgress(weight: number) {
  return Math.min(1, Math.max(0, weight / 100));
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ navigation }) => {
  const vault = useVault();
  const { getMaster } = useAuthMaster();
  const { isCloudOnline } = useOnline();
  const { theme, headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } =
    useTheme();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const isWide = width > 720;

  const [cache, setCache] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AnalysisTab>("quality");
  const [qualityBucket, setQualityBucket] = useState<QualityBucket>("all");
  const [riskBucket, setRiskBucket] = useState<RiskBucket>("itemsToFix");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");

  const deferredAppliedQuery = useDeferredValue(appliedQuery.trim());
  const scrollRef = React.useRef<ScrollView>(null);

  useScrollToTop(
    React.useRef({
      scrollToTop: () => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      },
    })
  );

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setHeaderWhite(false);
    }, [setHeaderSpacing, setHeaderWhite])
  );

  useEffect(() => {
    const id = setTimeout(() => {
      startTransition(() => setAppliedQuery(searchQuery));
    }, Platform.OS === "web" ? 80 : 140);

    return () => clearTimeout(id);
  }, [searchQuery]);

  useEffect(() => {
    const master = getMaster();
    if (!master || !vault.isUnlocked) {
      setIsLoading(false);
      setCache(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    InteractionManager.runAfterInteractions(() => {
      if (cancelled) return;

      (async () => {
        try {
          const full = vault.exportFullData();
          const filteredValues = filterValuesWithNonEmptySecrets(
            full?.values ?? []
          );
          const pepper = await deriveAnalysisPepperFromMaster(master);
          const result = await buildAnalysisCache(filteredValues, pepper, {
            includePwned: isCloudOnline,
          });

          startTransition(() => {
            if (!cancelled) {
              setCache(result);
              setIsLoading(false);
            }
          });
        } catch {
          if (!cancelled) {
            setCache(null);
            setIsLoading(false);
          }
        }
      })();
    });

    return () => {
      cancelled = true;
    };
  }, [vault.dirty, vault.isUnlocked, getMaster, isCloudOnline]);

  const list = cache?.list ?? [];
  const counts = cache?.counts ?? {
    weak: 0,
    medium: 0,
    strong: 0,
    reused: 0,
    variants: 0,
    short: 0,
    sequential: 0,
    compromised: 0,
  };

  const qualityCounts = useMemo(
    () => ({
      all: list.length,
      weak: counts.weak,
      medium: counts.medium,
      strong: counts.strong,
    }),
    [counts.medium, counts.strong, counts.weak, list.length]
  );

  const riskCounts = useMemo(() => {
    let risky = 0;
    for (const item of list) {
      if (getItemRisk(item).weight > 0) risky++;
    }

    return {
      all: list.length,
      itemsToFix: risky,
      compromised: counts.compromised,
      reused: counts.reused,
      weak:
        list.filter((item: any) => {
          const risk = getItemRisk(item);
          return (
            risk.weak ||
            risk.tooShort ||
            risk.sequential ||
            risk.repeated
          );
        }).length,
      similar: counts.variants,
    };
  }, [counts.compromised, counts.reused, counts.variants, list]);

  const qualityFilters = useMemo<FilterItem[]>(
    () => [
      { key: "all", title: `${t("analysis:all")} · ${qualityCounts.all}` },
      { key: "weak", title: `${t("analysis:weak")} · ${qualityCounts.weak}` },
      {
        key: "medium",
        title: `${t("analysis:medium")} · ${qualityCounts.medium}`,
      },
      {
        key: "strong",
        title: `${t("analysis:strong")} · ${qualityCounts.strong}`,
      },
    ],
    [qualityCounts, t]
  );

  const riskFilters = useMemo<FilterItem[]>(
    () => [
      { key: "all", title: `${t("analysis:all")} · ${riskCounts.all}` },
      {
        key: "itemsToFix",
        title: `${t("analysis:risky")} · ${riskCounts.itemsToFix}`,
      },
      {
        key: "compromised",
        title: `${t("analysis:compromised")} · ${riskCounts.compromised}`,
      },
      {
        key: "reused",
        title: `${t("analysis:reused")} · ${riskCounts.reused}`,
      },
      { key: "weak", title: `${t("analysis:weak")} · ${riskCounts.weak}` },
      {
        key: "similar",
        title: `${t("analysis:similar")} · ${riskCounts.similar}`,
      },
    ],
    [riskCounts, t]
  );

  const query = deferredAppliedQuery ? normalize(deferredAppliedQuery) : "";

  const qualityValues = useMemo(() => {
    if (isLoading || activeTab !== "quality") return [];

    return list
      .filter((item: any) => matchesQualityBucket(item, qualityBucket))
      .filter((item: any) => {
        if (!query) return true;
        return String(item?.normalizedTitle ?? "").includes(query);
      })
      .sort(sortByStrengthThenTitle);
  }, [activeTab, isLoading, list, qualityBucket, query]);

  const riskValues = useMemo(() => {
    if (isLoading || activeTab !== "risk") return [];

    return list
      .filter((item: any) => matchesRiskBucket(item, riskBucket))
      .filter((item: any) => {
        if (!query) return true;
        return String(item?.normalizedTitle ?? "").includes(query);
      })
      .sort(sortByRiskThenTitle);
  }, [activeTab, isLoading, list, query, riskBucket]);

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 12,
    boxShadow: theme.colors.shadow as any,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: darkmode ? theme.colors.outlineVariant : "white",
  };

  const pillCardStyle = (selected: boolean): StyleProp<ViewStyle> => [
    cardStyle,
    selected
      ? {
          backgroundColor:
            theme.colors.surfaceVariant ?? theme.colors.background,
          opacity: 0.95,
        }
      : undefined,
  ];

  const severityColor = (sev: Severity) => {
    if (sev === "Critical") return "#D32F2F";
    if (sev === "High") return "#F57C00";
    if (sev === "Medium") return "#FBC02D";
    if (sev === "Low") return "#1976D2";
    return "#2E7D32";
  };

  const progressTrackColor = (sev: Severity) => {
    if (sev === "Critical") return "rgba(211,47,47,0.18)";
    if (sev === "High") return "rgba(245,124,0,0.18)";
    if (sev === "Medium") return "rgba(251,192,45,0.18)";
    if (sev === "Low") return "rgba(25,118,210,0.16)";
    return "rgba(46,125,50,0.16)";
  };

  const SummaryGrid = ({
    items,
  }: {
    items: Array<{ key: string; value: number; label: string }>;
  }) => (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {items.map((item) => (
        <View
          key={item.key}
          style={[pillCardStyle(false) as any, { flex: 1, minWidth: 0 }]}
        >
          <Text style={{ fontWeight: "700", userSelect: "none" }}>
            {item.value}
          </Text>
          <Text style={{ opacity: 0.8, userSelect: "none" }}>{item.label}</Text>
        </View>
      ))}
    </View>
  );

  const renderQualityItem = (item: any, index: number) => {
    const strength = item.strength as PasswordStrengthLevel;
    const strengthColor = getPasswordStrengthColor(strength);
    const strengthIcon = getPasswordStrengthIcon(strength);
    const compromised = !!item?.flags?.isCompromised;

    return (
      <Animated.View
        key={`${item.ref.valueId}:${item.ref.moduleId}:${item.ref.type}`}
        entering={FadeInDown.delay(Math.min(index, 8) * 35).duration(220)}
        style={{
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: theme.colors.background,
          boxShadow: theme.colors.shadow,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
          borderWidth: StyleSheet.hairlineWidth,
        }}
      >
        <AnimatedPressable
          onPress={() => navigation.navigate("AnalysisDetail", { ref: item.ref })}
        >
          <View style={{ padding: 10, gap: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                <Text style={{ color: theme.colors.primary, userSelect: "none" }}>
                  {index + 1}.
                </Text>
                <Text style={{ flex: 1, userSelect: "none" }} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>

              <Chip
                compact
                style={{ borderRadius: 12, backgroundColor: strengthColor }}
                textStyle={{ color: "white", fontWeight: "800" }}
                icon={() => (
                  <Icon source={strengthIcon} size={18} color="white" />
                )}
              >
                {t(`analysis:${String(strength).toLowerCase()}`)}
              </Chip>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {compromised ? (
                <Chip compact style={{ borderRadius: 12 }}>
                  {t("analysis:badge.compromised")}
                </Chip>
              ) : null}
              <Chip compact style={{ borderRadius: 12 }}>
                {t("analysisDetail:bitsValue", {
                  bits: Math.floor(item.entropyBits),
                })}
              </Chip>
            </View>
          </View>
        </AnimatedPressable>
      </Animated.View>
    );
  };

  const renderRiskItem = (item: any, index: number) => {
    const risk = getItemRisk(item);
    const severity = severityForRiskScore(risk.weight);
    const pct = riskProgress(risk.weight);
    const fill = severityColor(severity);
    const track = progressTrackColor(severity);

    return (
      <Animated.View
        key={`${item.ref.valueId}:${item.ref.moduleId}:${item.ref.type}`}
        entering={FadeInDown.delay(Math.min(index, 8) * 35).duration(220)}
        style={{
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: theme.colors.background,
          boxShadow: theme.colors.shadow,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
          borderWidth: StyleSheet.hairlineWidth,
        }}
      >
        <AnimatedPressable
          onPress={() => navigation.navigate("AnalysisDetail", { ref: item.ref })}
        >
          <View style={{ paddingVertical: 8, gap: 8 }}>
            <View
              style={{
                flexDirection: isWide ? "row" : "column",
                alignItems: isWide ? "center" : "flex-start",
                gap: 10,
                paddingHorizontal: 8,
              }}
            >
              <View
                style={{
                  flex: 1,
                  minWidth: 0,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Text style={{ color: theme.colors.primary, userSelect: "none" }}>
                  {index + 1}.
                </Text>
                <Text style={{ userSelect: "none", flex: 1 }} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 6,
                  justifyContent: "flex-end",
                }}
              >
                {risk.compromised ? (
                  <Chip compact style={{ borderRadius: 12 }}>
                    {t("analysis:badge.compromised")}
                  </Chip>
                ) : null}
                {risk.reused ? (
                  <Chip compact style={{ borderRadius: 12 }}>
                    {t("analysis:badge.reused")}
                  </Chip>
                ) : null}
                {risk.similar ? (
                  <Chip compact style={{ borderRadius: 12 }}>
                    {t("analysis:badge.similar")}
                  </Chip>
                ) : null}
                {risk.tooShort ? (
                  <Chip compact style={{ borderRadius: 12 }}>
                    {t("analysis:badge.short")}
                  </Chip>
                ) : null}
                {risk.sequential ? (
                  <Chip compact style={{ borderRadius: 12 }}>
                    {t("analysis:badge.sequential")}
                  </Chip>
                ) : null}
                {risk.repeated ? (
                  <Chip compact style={{ borderRadius: 12 }}>
                    {t("analysis:badge.repeated")}
                  </Chip>
                ) : null}
              </View>
            </View>

            <Divider />

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <Text
                style={{
                  fontWeight: "800",
                  opacity: 0.9,
                  userSelect: "none",
                  color: fill,
                }}
              >
                {t(`analysisDetail:risk${severity}`, {
                  defaultValue: severity,
                })}
              </Text>

              <View
                style={{
                  flex: 1,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: track,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${pct * 100}%`,
                    height: "100%",
                    backgroundColor: fill,
                  }}
                />
              </View>
            </View>
          </View>
        </AnimatedPressable>
      </Animated.View>
    );
  };

  const SectionCard = ({
    summary,
    filters,
    bucket,
    setBucket,
    data,
    emptyLabel,
    renderItem,
  }: {
    summary: React.ReactNode;
    filters: FilterItem[];
    bucket: string;
    setBucket: (value: string) => void;
    data: any[];
    emptyLabel: string;
    renderItem: (item: any, index: number) => React.ReactNode;
  }) => (
    <View style={{ gap: 10 }}>
      {summary}

      <FiltersNarrow
        filterItems={filters}
        bucket={bucket}
        setBucket={setBucket}
      />

      <View style={{ gap: 8 }}>
        {data.length > 0 ? (
          data.map((item, index) => renderItem(item, index))
        ) : (
          <View
            style={{
              paddingVertical: 14,
              paddingHorizontal: 6,
            }}
          >
            <Text style={{ opacity: 0.7, userSelect: "none" }}>{emptyLabel}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const LoadingCard = () => (
    <View
      style={[
        cardStyle,
        {
          paddingVertical: 18,
          alignItems: "center",
          gap: 10,
        },
      ]}
    >
      <ActivityIndicator animating color={theme.colors.primary} />
      <Text style={{ fontWeight: "800", userSelect: "none" }}>
        {t("analysis:loadingTitle")}
      </Text>
      <Text style={{ opacity: 0.72, textAlign: "center", userSelect: "none" }}>
        {t("analysis:loadingHint")}
      </Text>
    </View>
  );

  const tabItems: Array<{
    key: AnalysisTab;
    title: string;
    count: number;
  }> = [
    {
      key: "quality",
      title: t("analysis:qualityTitle"),
      count: qualityCounts.all,
    },
    {
      key: "risk",
      title: t("analysis:riskTitle"),
      count: riskCounts.itemsToFix,
    },
  ];

  return (
    <AnimatedContainer>
      <StatusBar
        animated
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent
      />

      <Header title={t("bar:Analysis")} />

      <ScrollView
        ref={scrollRef}
        style={{ width: "100%" }}
        contentContainerStyle={{
          padding: 8,
          paddingTop: 0,
          gap: GAP,
          alignSelf: "center",
          width: "100%",
          maxWidth: 1100,
        }}
      >
        <View
          style={{
            borderRadius: 12,
            backgroundColor: theme.colors.background,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: darkmode ? theme.colors.outlineVariant : "white",
            padding: 6,
            boxShadow: theme.colors.shadow as any,
          }}
        >
          <Searchbar
            inputStyle={{ height: 40, minHeight: 40 }}
            style={{
              height: 40,
              borderRadius: 10,
              backgroundColor: theme.colors.background,
            }}
            placeholder={t("analysis:searchHint")}
            onChangeText={(txt) => setSearchQuery(txt)}
            value={searchQuery}
          />
        </View>

        {isLoading ? (
          <LoadingCard />
        ) : (
          <>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 2, marginBottom: 2 }}>
              {tabItems.map((tab) => (
                <AnimatedPressable
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={[
                    pillCardStyle(activeTab === tab.key) as any,
                    {
                      flex: 1,
                      minWidth: 0,
                      paddingVertical: 8,
                    },
                  ]}
                >
                  <View style={{ gap: 2 }}>
                    <Text style={{ fontWeight: "800", userSelect: "none" }}>
                      {tab.title}
                    </Text>
                    <Text style={{ opacity: 0.72, userSelect: "none" }}>
                      {tab.count}
                    </Text>
                  </View>
                </AnimatedPressable>
              ))}
            </View>

            {activeTab === "quality" ? (
              <SectionCard
                summary={
                  <SummaryGrid
                    items={[
                      {
                        key: "strong",
                        value: counts.strong,
                        label: t("analysis:strong"),
                      },
                      {
                        key: "medium",
                        value: counts.medium,
                        label: t("analysis:medium"),
                      },
                      {
                        key: "weak",
                        value: counts.weak,
                        label: t("analysis:weak"),
                      },
                    ]}
                  />
                }
                filters={qualityFilters}
                bucket={qualityBucket}
                setBucket={(value) => setQualityBucket(value as QualityBucket)}
                data={qualityValues}
                emptyLabel={t("analysis:noQualityMatches")}
                renderItem={renderQualityItem}
              />
            ) : (
              <SectionCard
                summary={
                  <SummaryGrid
                    items={[
                      {
                        key: "risky",
                        value: riskCounts.itemsToFix,
                        label: t("analysis:risky"),
                      },
                      {
                        key: "compromised",
                        value: counts.compromised,
                        label: t("analysis:compromised"),
                      },
                      {
                        key: "reused",
                        value: counts.reused,
                        label: t("analysis:reused"),
                      },
                    ]}
                  />
                }
                filters={riskFilters}
                bucket={riskBucket}
                setBucket={(value) => setRiskBucket(value as RiskBucket)}
                data={riskValues}
                emptyLabel={t("analysis:noRiskMatches")}
                renderItem={renderRiskItem}
              />
            )}
          </>
        )}
      </ScrollView>
    </AnimatedContainer>
  );
};

export default AnalysisScreen;
