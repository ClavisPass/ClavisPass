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
  ViewStyle,
  StyleProp,
} from "react-native";
import { Chip, Divider, Icon, Searchbar, Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useTheme } from "../app/providers/ThemeProvider";
import Header from "../shared/components/Header";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../shared/ui/linearGradient";
import AnimatedPressable from "../shared/components/AnimatedPressable";
import { useTranslation } from "react-i18next";

import getPasswordStrengthColor from "../features/analysis/utils/getPasswordStrengthColor";
import getPasswordStrengthIcon from "../features/analysis/utils/getPasswordStrengthIcon";

import {
  buildAnalysisCache,
  normalize,
  deriveAnalysisPepperFromMaster,
} from "../features/analysis/utils/analysisEngine";

import { RootStackParamList } from "../app/navigation/stacks/Stack";
import { useAuth } from "../app/providers/AuthProvider";
import CacheResult from "../features/analysis/model/CacheResult";
import PasswordStrengthLevel from "../features/analysis/model/PasswordStrengthLevel";
import { useVault } from "../app/providers/VaultProvider";


type AnalysisScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Analysis"
>;

type FindingKey = string;

type StrengthSelection = {
  strong: boolean;
  medium: boolean;
  weak: boolean;
};

const normalizeStrengthSelection = (
  s: StrengthSelection
): StrengthSelection => {
  if (s.strong && s.medium && s.weak) {
    return { strong: false, medium: false, weak: false };
  }
  return s;
};

const isNoStrengthFilter = (s: StrengthSelection) => {
  const allOff = !s.strong && !s.medium && !s.weak;
  const allOn = s.strong && s.medium && s.weak;
  return allOff || allOn;
};

const truthy = (v: any) => v === true;

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ navigation }) => {
  const vault = useVault();
  const { getMaster } = useAuth();

  const { theme, headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } =
    useTheme();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const [cache, setCache] = useState<CacheResult | null>(null);

  const [strengthSel, setStrengthSel] = useState<StrengthSelection>({
    strong: false,
    medium: false,
    weak: false,
  });

  const [activeFindingKey, setActiveFindingKey] = useState<FindingKey | null>(
    null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery.trim());

  const [maxFindingWidth, setMaxFindingWidth] = useState<number | null>(null);

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 12,
    boxShadow: theme.colors.shadow as any,
    flex: 1,
    minWidth: 0,
  };

  const isSelected = (key: keyof StrengthSelection) => strengthSel[key];

  const strengthCardStyle = (selected: boolean): StyleProp<ViewStyle> => [
    cardStyle,
    selected
      ? {
          backgroundColor:
            theme.colors.surfaceVariant ?? theme.colors.background,
          opacity: 0.9,
        }
      : undefined,
  ];

  const findingCardStyle = (
    selected: boolean,
    extra?: StyleProp<ViewStyle>
  ): StyleProp<ViewStyle> => [
    {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 12,
      boxShadow: theme.colors.shadow as any,
    },
    selected
      ? {
          backgroundColor:
            theme.colors.surfaceVariant ?? theme.colors.background,
          opacity: 0.9,
        }
      : undefined,
    {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: darkmode ? theme.colors.outlineVariant : "white",
    },
    extra,
  ];

  const toggleFinding = (key: FindingKey) => {
    setActiveFindingKey((prev) => (prev === key ? null : key));
  };

  const toggleStrength = (key: keyof StrengthSelection) => {
    setStrengthSel((prev) =>
      normalizeStrengthSelection({ ...prev, [key]: !prev[key] })
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setHeaderWhite(false);
    }, [setHeaderSpacing, setHeaderWhite])
  );

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

          const pepper = await deriveAnalysisPepperFromMaster(master);
          const result = await buildAnalysisCache(values, pepper);

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

  useEffect(() => {
    setMaxFindingWidth(null);
  }, [cache?.findings?.length]);

  const filteredValues = useMemo(() => {
    if (!cache) return [];
    const q = deferredQuery ? normalize(deferredQuery) : "";

    const matchesStrength = (lvl: PasswordStrengthLevel) => {
      if (isNoStrengthFilter(strengthSel)) return true;
      return (
        (lvl === PasswordStrengthLevel.STRONG && strengthSel.strong) ||
        (lvl === PasswordStrengthLevel.MEDIUM && strengthSel.medium) ||
        (lvl === PasswordStrengthLevel.WEAK && strengthSel.weak)
      );
    };

    const matchesFinding = (it: any) => {
      if (!activeFindingKey) return true;

      const key = String(activeFindingKey).toLowerCase();
      const flags = it?.flags ?? {};

      if (key === "reused" || key.includes("reuse")) {
        return (flags?.reuseGroupSize ?? 0) >= 2;
      }
      if (key === "variants" || key.includes("variant")) {
        return (flags?.variantGroupSize ?? 0) >= 2;
      }

      if (key === "weak" || key.includes("weak")) {
        return it.strength === PasswordStrengthLevel.WEAK;
      }
      if (key === "medium" || key.includes("medium")) {
        return it.strength === PasswordStrengthLevel.MEDIUM;
      }
      if (key === "strong" || key.includes("strong")) {
        return it.strength === PasswordStrengthLevel.STRONG;
      }

      if (
        key === "short" ||
        key.includes("short") ||
        key.includes("too_short")
      ) {
        if (
          truthy(flags?.short) ||
          truthy(flags?.isShort) ||
          truthy(flags?.tooShort)
        )
          return true;

        const len =
          (typeof flags?.length === "number" ? flags.length : undefined) ??
          (typeof it?.passwordLength === "number"
            ? it.passwordLength
            : undefined) ??
          (typeof it?.stats?.length === "number" ? it.stats.length : undefined);

        if (typeof len === "number") return len < 12;
        return false;
      }

      if (key === "sequential" || key.includes("sequen")) {
        if (
          truthy(flags?.sequential) ||
          truthy(flags?.hasSequential) ||
          truthy(flags?.isSequential)
        )
          return true;

        const seqCount =
          (typeof flags?.sequentialCount === "number"
            ? flags.sequentialCount
            : 0) ?? 0;

        const triples = Array.isArray(flags?.sequentialTriples)
          ? flags.sequentialTriples
          : null;

        if (seqCount > 0) return true;
        if (triples && triples.length > 0) return true;

        const altTriples = Array.isArray(it?.sequentialTriples)
          ? it.sequentialTriples
          : null;
        if (altTriples && altTriples.length > 0) return true;

        return false;
      }

      return true;
    };

    const mapped = cache.list.map((it: any) => {
      if (!matchesStrength(it.strength)) return { it, rel: Infinity };
      if (!matchesFinding(it)) return { it, rel: Infinity };

      if (!q) return { it, rel: 0 };
      const tt = it.normalizedTitle;
      if (tt.startsWith(q)) return { it, rel: 0 };
      const idx = tt.indexOf(q);
      return { it, rel: idx === -1 ? Infinity : idx + 1 };
    });

    return mapped
      .filter((x) => x.rel !== Infinity)
      .sort((a, b) => a.rel - b.rel)
      .map((x) => x.it);
  }, [cache, deferredQuery, strengthSel, activeFindingKey]);

  const counts = cache?.counts ?? {
    weak: 0,
    medium: 0,
    strong: 0,
    reused: 0,
    variants: 0,
    short: 0,
    sequential: 0,
  };

  return (
    <AnimatedContainer>
      <StatusBar
        animated
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent
      />
      <Header title={t("bar:Analysis")} />

      <View
        style={{
          flex: 1,
          flexDirection: width > 600 ? "row" : "column",
          width: "100%",
          alignItems: "stretch",
        }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            variant="labelSmall"
            style={{ opacity: 0.7, marginLeft: 14, userSelect: "none" }}
          >
            {t("analysis:strengthDistribution", {
              defaultValue: "Strength distribution",
            })}
          </Text>

          <View style={{ flexDirection: "row", margin: 8, gap: 8 }}>
            <AnimatedPressable
              onPress={() => startTransition(() => toggleStrength("strong"))}
              style={strengthCardStyle(isSelected("strong"))}
            >
              <View>
                <Text style={{ fontWeight: "700", userSelect: "none" }}>
                  {counts.strong}
                </Text>
                <Text style={{ opacity: 0.8, userSelect: "none" }}>
                  {t("analysis:strong")}
                </Text>
              </View>
            </AnimatedPressable>

            <AnimatedPressable
              onPress={() => startTransition(() => toggleStrength("medium"))}
              style={strengthCardStyle(isSelected("medium"))}
            >
              <View>
                <Text style={{ fontWeight: "700", userSelect: "none" }}>
                  {counts.medium}
                </Text>
                <Text style={{ opacity: 0.8, userSelect: "none" }}>
                  {t("analysis:medium")}
                </Text>
              </View>
            </AnimatedPressable>

            <AnimatedPressable
              onPress={() => startTransition(() => toggleStrength("weak"))}
              style={strengthCardStyle(isSelected("weak"))}
            >
              <View>
                <Text style={{ fontWeight: "700", userSelect: "none" }}>
                  {counts.weak}
                </Text>
                <Text style={{ opacity: 0.8, userSelect: "none" }}>
                  {t("analysis:weak")}
                </Text>
              </View>
            </AnimatedPressable>
          </View>

          {width <= 600 ? (
            <>
              <Text
                variant="labelSmall"
                style={{ opacity: 0.7, marginLeft: 14, userSelect: "none" }}
              >
                {t("analysis:topFindings", { defaultValue: "Top findings" })}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  alignSelf: "flex-start",
                  flexGrow: 0,
                  flexShrink: 0,
                }}
                contentContainerStyle={{
                  padding: 8,
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                {(cache?.findings?.length ?? 0) > 0 ? (
                  cache!.findings.slice(0, 5).map((f: any, index: number) => (
                    <AnimatedPressable
                      key={f.key}
                      onPress={() =>
                        startTransition(() => toggleFinding(f.key))
                      }
                      style={findingCardStyle(activeFindingKey === f.key, {
                        marginRight: index === 4 ? 0 : 8,
                        minWidth: 160,
                        alignSelf: "flex-start",
                      })}
                    >
                      <View>
                        <Text style={{ fontWeight: "700", userSelect: "none" }}>
                          {f.count}
                        </Text>
                        <Text
                          style={{ opacity: 0.8, userSelect: "none" }}
                          numberOfLines={2}
                        >
                          {t(`analysis:finding.${f.key}`, {
                            defaultValue: f.key,
                          })}
                        </Text>
                      </View>
                    </AnimatedPressable>
                  ))
                ) : (
                  <View style={{ padding: 12, opacity: 0.7 }}>
                    <Text>
                      {t("analysis:noFindings", {
                        defaultValue: "No findings.",
                      })}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </>
          ) : null}

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
              marginTop: width > 600 ? 8 : 0,
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
              placeholder={t("common:search", { defaultValue: "Search" })}
              onChangeText={(txt) => startTransition(() => setSearchQuery(txt))}
              value={searchQuery}
              iconColor={"#ffffff80"}
              placeholderTextColor={"#ffffff80"}
            />
          </LinearGradient>

          {activeFindingKey ? (
            <View
              style={{ marginHorizontal: 8, marginTop: -4, marginBottom: 4 }}
            >
              <Text style={{ opacity: 0.7 }}>
                {t("analysis:activeFilter", { defaultValue: "Active filter:" })}{" "}
                {t(`analysis:finding.${activeFindingKey}`, {
                  defaultValue: activeFindingKey,
                })}{" "}
                <Text
                  style={{ color: theme.colors.primary }}
                  onPress={() => setActiveFindingKey(null)}
                >
                  {t("common:clear", { defaultValue: "Clear" })}
                </Text>
              </Text>
            </View>
          ) : null}

          <View style={{ flex: 1, minWidth: 0 }}>
            <FlashList
              data={filteredValues}
              keyExtractor={(item: any) =>
                `${item.ref.valueId}:${item.ref.moduleId}:${item.ref.type}`
              }
              removeClippedSubviews
              renderItem={({ item, index }: any) => (
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
                    height: 44,
                    borderColor: darkmode
                      ? theme.colors.outlineVariant
                      : "white",
                    borderWidth: StyleSheet.hairlineWidth,
                  }}
                >
                  <AnimatedPressable
                    onPress={() =>
                      navigation.navigate("AnalysisDetail", { ref: item.ref })
                    }
                  >
                    <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        height: 44,
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 6,
                          flex: 1,
                          alignItems: "center",
                          minWidth: 0,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.primary,
                            userSelect: "none",
                          }}
                        >
                          {index + 1}.
                        </Text>
                        <Text
                          style={{ userSelect: "none", flex: 1 }}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>

                        {(item.flags?.variantGroupSize ?? 0) >= 2 ? (
                          <Chip style={{ borderRadius: 12 }}>
                            {t("analysis:badge.variant", {
                              defaultValue: "Variant",
                            })}
                          </Chip>
                        ) : null}
                        {(item.flags?.reuseGroupSize ?? 0) >= 2 ? (
                          <Chip style={{ borderRadius: 12 }}>
                            {t("analysis:badge.reused", {
                              defaultValue: "Reused",
                            })}
                          </Chip>
                        ) : null}
                      </View>
                      <Divider
                        style={{
                          height: 24,
                          width: StyleSheet.hairlineWidth,
                          marginHorizontal: 6,
                        }}
                      />
                      <Icon
                        source={getPasswordStrengthIcon(item.strength as any)}
                        size={20}
                        color={getPasswordStrengthColor(item.strength as any)}
                      />
                    </View>
                  </AnimatedPressable>
                </Animated.View>
              )}
              ListEmptyComponent={
                cache ? (
                  <View style={{ alignItems: "center", marginTop: 32 }}>
                    <Text style={{ opacity: 0.6 }}>
                      {t("common:noResults", { defaultValue: "No results" })}
                    </Text>
                  </View>
                ) : null
              }
            />
          </View>
        </View>

        {width > 600 ? (
          <View
            style={{
              width: StyleSheet.hairlineWidth,
              alignSelf: "stretch",
              backgroundColor: theme.colors.outlineVariant,
              flexShrink: 0,
            }}
          />
        ) : null}

        {width > 600 ? (
          <View>
            <Text
              variant="labelSmall"
              style={{ opacity: 0.7, marginLeft: 6, userSelect: "none" }}
            >
              {t("analysis:topFindings", { defaultValue: "Top findings" })}
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                padding: 8,
                paddingTop: 8,
                gap: 8,
                alignSelf: "flex-start",
              }}
              style={{
                alignSelf: "flex-start",
                flexShrink: 0,
              }}
            >
              {(cache?.findings?.length ?? 0) > 0 ? (
                cache!.findings.slice(0, 8).map((f: any) => (
                  <AnimatedPressable
                    key={f.key}
                    onPress={() => startTransition(() => toggleFinding(f.key))}
                    onLayout={(e) => {
                      if (maxFindingWidth != null) return;
                      const w = e.nativeEvent.layout.width;
                      setMaxFindingWidth((prev) =>
                        prev == null ? w : Math.max(prev, w)
                      );
                    }}
                    style={findingCardStyle(activeFindingKey === f.key, [
                      maxFindingWidth != null
                        ? { width: maxFindingWidth }
                        : null,
                      { alignSelf: "flex-start" },
                    ])}
                  >
                    <View>
                      <Text style={{ fontWeight: "700", userSelect: "none" }}>
                        {f.count}
                      </Text>
                      <Text style={{ opacity: 0.8, userSelect: "none" }}>
                        {t(`analysis:finding.${f.key}`, {
                          defaultValue: f.key,
                        })}
                      </Text>
                    </View>
                  </AnimatedPressable>
                ))
              ) : (
                <View
                  style={{
                    padding: 12,
                    opacity: 0.7,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text>
                    {t("analysis:noFindings", { defaultValue: "No findings." })}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        ) : null}
      </View>
    </AnimatedContainer>
  );
};

export default AnalysisScreen;
