import React, {
  useEffect,
  useMemo,
  useState,
  useDeferredValue,
  startTransition,
} from "react";
import {
  InteractionManager,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Chip, Divider, Searchbar, Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";

import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import Header from "../shared/components/Header";
import AnimatedPressable from "../shared/components/AnimatedPressable";
import getColors from "../shared/ui/linearGradient";

import { useTheme } from "../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";

import {
  buildAnalysisCache,
  normalize,
  deriveAnalysisPepperFromMaster,
} from "../features/analysis/utils/analysisEngine";

import { useAuth } from "../app/providers/AuthProvider";
import CacheResult from "../features/analysis/model/CacheResult";
import PasswordStrengthLevel from "../features/analysis/model/PasswordStrengthLevel";
import { useVault } from "../app/providers/VaultProvider";

import ModulesEnum from "../features/vault/model/ModulesEnum";
import WifiModuleType from "../features/vault/model/modules/WifiModuleType";
import { AnalysisStackParamList } from "../app/navigation/model/types";
import { FiltersNarrow, FiltersWide } from "../features/analysis/components/Filter";

import {
  riskScoreFromCached,
  severityForRiskScore,
} from "../features/analysis/utils/riskModel";

type AnalysisScreenProps = NativeStackScreenProps<
  AnalysisStackParamList,
  "Analysis"
>;

type RiskBucket = "all" | "itemsToFix" | "reused" | "weak" | "similar";
type FilterItem = { key: RiskBucket; title: string };

const GAP = 8;

const styles = StyleSheet.create({
  chip: {
    marginRight: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
});

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

  const reused = (flags.reuseGroupSize ?? 0) >= 2;
  const similar = (flags.variantGroupSize ?? 0) >= 2;
  const tooShort = !!flags.isShort;
  const sequential = !!flags.hasSequential;
  const repeated = !!flags.hasRepeatedChars;
  const weak = strength === PasswordStrengthLevel.WEAK;

  return {
    reused,
    similar,
    weak,
    tooShort,
    sequential,
    repeated,
    weight: riskScore,
  };
}

function matchesBucket(it: any, bucket: RiskBucket) {
  const r = getItemRisk(it);

  if (bucket === "all") return true;
  if (bucket === "itemsToFix") return r.weight > 0;
  if (bucket === "reused") return r.reused;
  if (bucket === "similar") return r.similar;
  if (bucket === "weak") return r.weak || r.tooShort || r.sequential || r.repeated;

  return true;
}

function sortByRiskThenTitle(a: any, b: any) {
  const ra = getItemRisk(a).weight;
  const rb = getItemRisk(b).weight;
  if (rb !== ra) return rb - ra;
  return String(a?.title ?? "").localeCompare(String(b?.title ?? ""));
}

function computeSecurityScore(list: any[]) {
  const items = list ?? [];
  if (items.length === 0) return 100;

  let total = 0;
  for (const it of items) total += Math.min(100, getItemRisk(it).weight);

  const max = items.length * 100;
  const ratio = max > 0 ? total / max : 0;
  const score = Math.round(100 * (1 - ratio * ratio));
  return Math.max(0, Math.min(100, score));
}

type Severity = "Critical" | "High" | "Medium" | "Low" | "OK";

function riskProgress(weight: number) {
  return Math.min(1, Math.max(0, weight / 100));
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ navigation }) => {
  const vault = useVault();
  const { getMaster } = useAuth();
  const { theme, headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } =
    useTheme();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const isWide = width > 600;

  const SIDEBAR_MAX = 280;
  const sidebarWidth = Math.min(
    SIDEBAR_MAX,
    Math.max(200, Math.floor(width * 0.26))
  );

  const [cache, setCache] = useState<CacheResult | null>(null);
  const [bucket, setBucket] = useState<RiskBucket>("itemsToFix");

  const [searchQuery, setSearchQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const deferredAppliedQuery = useDeferredValue(appliedQuery.trim());

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
      setCache(null);
      return;
    }

    let cancelled = false;

    InteractionManager.runAfterInteractions(() => {
      if (cancelled) return;

      (async () => {
        try {
          const full = vault.exportFullData();
          const values = full?.values ?? [];
          const filteredValues = filterValuesWithNonEmptySecrets(values);

          const pepper = await deriveAnalysisPepperFromMaster(master);
          const result = await buildAnalysisCache(filteredValues, pepper);

          startTransition(() => {
            if (!cancelled) setCache(result);
          });
        } catch {
          if (!cancelled) setCache(null);
        }
      })();
    });

    return () => {
      cancelled = true;
    };
  }, [vault.dirty, vault.isUnlocked, getMaster, vault]);

  const list = cache?.list ?? [];
  const score = useMemo(() => computeSecurityScore(list), [list]);

  const bucketCounts = useMemo(() => {
    const total = list.length;

    let itemsToFix = 0;
    let reused = 0;
    let similar = 0;
    let weakish = 0;

    for (const it of list) {
      const r = getItemRisk(it);
      if (r.weight > 0) itemsToFix++;
      if (r.reused) reused++;
      if (r.similar) similar++;
      if (r.weak || r.tooShort || r.sequential || r.repeated) weakish++;
    }

    return { total, itemsToFix, reused, similar, weakish };
  }, [list]);

  const filterItems: FilterItem[] = useMemo(() => {
    const allTitle = t("analysis:all", { defaultValue: "All" });
    const fixTitle = t("analysis:itemsToFix", { defaultValue: "Items to fix" });
    const reusedTitle = t("analysis:reused", { defaultValue: "Reused" });
    const weakTitle = t("analysis:weak", { defaultValue: "Weak" });
    const similarTitle = t("analysis:similar", { defaultValue: "Similar" });

    return [
      { key: "all", title: `${allTitle} · ${bucketCounts.total}` },
      { key: "itemsToFix", title: `${fixTitle} · ${bucketCounts.itemsToFix}` },
      { key: "reused", title: `${reusedTitle} · ${bucketCounts.reused}` },
      { key: "weak", title: `${weakTitle} · ${bucketCounts.weakish}` },
      { key: "similar", title: `${similarTitle} · ${bucketCounts.similar}` },
    ];
  }, [bucketCounts, t]);

  const filteredValues = useMemo(() => {
    if (!cache) return [];
    const q = deferredAppliedQuery ? normalize(deferredAppliedQuery) : "";

    return list
      .filter((it: any) => matchesBucket(it, bucket))
      .filter((it: any) => {
        if (!q) return true;
        const tt = String(it?.normalizedTitle ?? "");
        return tt.includes(q);
      })
      .sort(sortByRiskThenTitle);
  }, [cache, list, deferredAppliedQuery, bucket]);

  const counts = cache?.counts ?? { weak: 0, medium: 0, strong: 0 };

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 12,
    boxShadow: theme.colors.shadow as any,
  };

  const pillCardStyle = (selected: boolean): StyleProp<ViewStyle> => [
    cardStyle,
    selected
      ? {
          backgroundColor: theme.colors.surfaceVariant ?? theme.colors.background,
          opacity: 0.95,
        }
      : undefined,
    {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: darkmode ? theme.colors.outlineVariant : "white",
    },
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

  const ScoreBlock = ({ compact }: { compact: boolean }) => (
    <AnimatedPressable style={[pillCardStyle(false), { padding: 0 }]}>
      <LinearGradient
        colors={getColors()}
        dither
        style={{
          borderRadius: 12,
          padding: compact ? 10 : 12,
          overflow: "hidden",
        }}
        end={{ x: 0.1, y: 0.2 }}
      >
        <View style={{ gap: compact ? 8 : 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ fontWeight: "800", userSelect: "none", color: "white" }}>
                {t("analysis:securityScore", { defaultValue: "Security score" })}
              </Text>
              {!compact ? (
                <Text style={{ opacity: 0.85, userSelect: "none", marginTop: 2, color: "white" }}>
                  {t("analysis:scoreHint", {
                    defaultValue: "Fix the items below to improve your score.",
                  })}
                </Text>
              ) : null}
            </View>

            <Text
              style={{
                fontWeight: "900",
                fontSize: compact ? 18 : 22,
                userSelect: "none",
                color: "white",
              }}
            >
              {score}
            </Text>
          </View>

          <View
            style={{
              height: compact ? 8 : 10,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.22)",
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${score}%`,
                height: "100%",
                backgroundColor: "rgba(255,255,255,0.85)",
              }}
            />
          </View>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );

  const renderListItem = ({ item, index }: any) => {
    const r = getItemRisk(item);
    const sev = severityForRiskScore(r.weight);
    const pct = riskProgress(r.weight);

    const fill = severityColor(sev);
    const track = progressTrackColor(sev);

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 40).duration(220)}
        style={{
          borderRadius: 12,
          marginHorizontal: 8,
          marginBottom: 4,
          overflow: "hidden",
          backgroundColor: theme.colors?.background,
          boxShadow: theme.colors?.shadow,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
          borderWidth: StyleSheet.hairlineWidth,
        }}
      >
        <AnimatedPressable
          onPress={() => navigation.navigate("AnalysisDetail", { ref: item.ref })}
        >
          <View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
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
                  {r.reused ? (
                    <Chip compact style={{ borderRadius: 12 }}>
                      {t("analysis:badge.reused", { defaultValue: "Reused" })}
                    </Chip>
                  ) : null}
                  {r.similar ? (
                    <Chip compact style={{ borderRadius: 12 }}>
                      {t("analysis:badge.similar", { defaultValue: "Similar" })}
                    </Chip>
                  ) : null}
                  {r.tooShort ? (
                    <Chip compact style={{ borderRadius: 12 }}>
                      {t("analysis:badge.short", { defaultValue: "Too short" })}
                    </Chip>
                  ) : null}
                  {r.sequential ? (
                    <Chip compact style={{ borderRadius: 12 }}>
                      {t("analysis:badge.sequential", { defaultValue: "Sequential" })}
                    </Chip>
                  ) : null}
                  {r.repeated ? (
                    <Chip compact style={{ borderRadius: 12 }}>
                      {t("analysis:badge.repeated", { defaultValue: "Repeated" })}
                    </Chip>
                  ) : null}
                </View>
              </View>
            </View>

            <Divider />

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <Text style={{ fontWeight: "800", opacity: 0.9, userSelect: "none", color: fill }}>
                {sev}
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
                <View style={{ width: `${pct * 100}%`, height: "100%", backgroundColor: fill }} />
              </View>
            </View>
          </View>
        </AnimatedPressable>
      </Animated.View>
    );
  };

  return (
    <AnimatedContainer>
      <StatusBar
        animated
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent
      />

      <Header title={t("bar:Analysis", { defaultValue: "Analysis" })} />

      <View
        style={{
          flex: 1,
          flexDirection: isWide ? "row" : "column",
          width: "100%",
          alignItems: "stretch",
        }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          {!isWide ? (
            <View style={{ marginHorizontal: 8 }}>
              <ScoreBlock compact={false} />
            </View>
          ) : null}
          {!isWide ? <View style={{ height: GAP }} /> : null}

          <View style={{ flexDirection: "row", marginHorizontal: 8, gap: 8 }}>
            <View style={[pillCardStyle(false) as any, { flex: 1, minWidth: 0 }]}>
              <Text style={{ fontWeight: "700", userSelect: "none" }}>{counts.strong}</Text>
              <Text style={{ opacity: 0.8, userSelect: "none" }}>
                {t("analysis:strong", { defaultValue: "Strong" })}
              </Text>
            </View>

            <View style={[pillCardStyle(false) as any, { flex: 1, minWidth: 0 }]}>
              <Text style={{ fontWeight: "700", userSelect: "none" }}>{counts.medium}</Text>
              <Text style={{ opacity: 0.8, userSelect: "none" }}>
                {t("analysis:medium", { defaultValue: "Medium" })}
              </Text>
            </View>

            <View style={[pillCardStyle(false) as any, { flex: 1, minWidth: 0 }]}>
              <Text style={{ fontWeight: "700", userSelect: "none" }}>{counts.weak}</Text>
              <Text style={{ opacity: 0.8, userSelect: "none" }}>
                {t("analysis:weak", { defaultValue: "Weak" })}
              </Text>
            </View>
          </View>

          <View style={{ height: GAP }} />

          {/* Search */}
          <View
            style={{
              marginHorizontal: 8,
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
              placeholder={t("common:search", { defaultValue: "Search" })}
              onChangeText={(txt) => setSearchQuery(txt)}
              value={searchQuery}
            />
          </View>

          {!isWide ? (
            <FiltersNarrow
              filterItems={filterItems}
              bucket={bucket}
              setBucket={setBucket}
              // if your FiltersNarrow uses onMomentumScrollEnd etc, you can forward these:
              // listRef={filterListRef}
              // onMomentumScrollEnd={onFilterScrollEnd}
            />
          ) : null}

          <View style={{ flex: 1, minWidth: 0, marginTop: GAP }}>
            <FlashList
              data={filteredValues}
              keyExtractor={(x: any) =>
                `${x.ref.valueId}:${x.ref.moduleId}:${x.ref.type}`
              }
              removeClippedSubviews
              renderItem={renderListItem}
            />
          </View>
        </View>

        {isWide ? (
          <View
            style={{
              width: StyleSheet.hairlineWidth,
              alignSelf: "stretch",
              backgroundColor: theme.colors.outlineVariant,
              flexShrink: 0,
            }}
          />
        ) : null}

        {isWide ? (
          <View
            style={{
              width: sidebarWidth,
              maxWidth: SIDEBAR_MAX,
              paddingTop: 0,
              paddingLeft: GAP,
              paddingRight: 8,
            }}
          >
            <ScoreBlock compact={true} />
            <FiltersWide filterItems={filterItems} bucket={bucket} setBucket={setBucket} />
          </View>
        ) : null}
      </View>
    </AnimatedContainer>
  );
};

export default AnalysisScreen;
