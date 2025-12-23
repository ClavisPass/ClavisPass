// AnalysisDetailScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation, CommonActions } from "@react-navigation/native";

import { ScrollView, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  Chip,
  Divider,
  Icon,
  List,
  Text,
  TextInput,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import Header from "../shared/components/Header";

import { useTheme } from "../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from "../app/providers/AuthProvider";
import { useVault } from "../app/providers/VaultProvider";

import ModulesEnum from "../features/vault/model/ModulesEnum";
import WifiModuleType from "../features/vault/model/modules/WifiModuleType";
import AnalysisRef from "../features/analysis/model/AnalysisRef";
import PasswordStrengthLevel from "../features/analysis/model/PasswordStrengthLevel";

import passwordEntropy from "../features/analysis/utils/Entropy";
import {
  canonicalizeForVariants,
  deriveAnalysisPepperFromMaster,
  fingerprintPassword,
  findSequentialTriples,
  hasRepeatedChars,
  strengthFromEntropyBits,
} from "../features/analysis/utils/analysisEngine";

import getPasswordStrengthColor from "../features/analysis/utils/getPasswordStrengthColor";
import getPasswordStrengthIcon from "../features/analysis/utils/getPasswordStrengthIcon";
import { MODULE_ICON } from "../features/vault/model/ModuleIconsEnum";
import {
  AnalysisStackParamList,
  AppTabsParamList,
} from "../app/navigation/model/types";

type AnalysisDetailScreenProps = NativeStackScreenProps<
  AnalysisStackParamList,
  "AnalysisDetail"
>;

type CharacterAnalysis = {
  letters: number;
  lettersPercent: number;
  digits: number;
  digitsPercent: number;
  specialCharacters: number;
  specialCharactersPercent: number;
};

type DetailComputed = {
  entropyBits: number;
  strength: PasswordStrengthLevel;

  length: number;
  pattern: string;
  sequentialTriples: string[];
  repeated: boolean;
  charAnalysis: CharacterAnalysis;

  reuseCount: number; // incl. this
  variantCount: number; // incl. this
};

type Resolved = {
  title: string;
  password: string;
  typeIcon: any;
  kind: "password" | "wifi";
};

type WhyItem = {
  key: string;
  severity: "high" | "medium" | "low";
  text: string;
};

const MIN_LENGTH = 12;
const GAP = 8;

function classifyPattern(password: string): string {
  const regexMap: { [key: string]: RegExp } = {
    a: /[a-z]/,
    A: /[A-Z]/,
    1: /[0-9]/,
    "!": /[^a-zA-Z0-9]/,
  };

  let pattern = "";
  for (const char of password) {
    for (const [key, regex] of Object.entries(regexMap)) {
      if (regex.test(char)) {
        pattern += key;
        break;
      }
    }
  }
  return pattern;
}

function analyzeCharacterComposition(input: string): CharacterAnalysis {
  let letters = 0,
    digits = 0,
    specialCharacters = 0;

  for (const char of input) {
    if (/[a-zA-Z]/.test(char)) letters++;
    else if (/[0-9]/.test(char)) digits++;
    else specialCharacters++;
  }

  const total = input.length || 1;
  return {
    letters,
    lettersPercent: (letters / total) * 100,
    digits,
    digitsPercent: (digits / total) * 100,
    specialCharacters,
    specialCharactersPercent: (specialCharacters / total) * 100,
  };
}

function resolveById(values: any[], ref: AnalysisRef): Resolved | null {
  const value = values.find((v) => v.id === ref.valueId);
  if (!value) return null;

  const mod = value.modules.find((m: any) => m.id === ref.moduleId);
  if (!mod) return null;

  if (ref.type === ModulesEnum.PASSWORD) {
    return {
      title: value.title,
      password: String((mod as any).value),
      typeIcon: MODULE_ICON[ModulesEnum.PASSWORD],
      kind: "password",
    };
  }

  if (ref.type === ModulesEnum.WIFI) {
    const wifi = mod as WifiModuleType;
    return {
      title: wifi.wifiName ?? value.title,
      password: wifi.value,
      typeIcon: MODULE_ICON[ModulesEnum.WIFI],
      kind: "wifi",
    };
  }

  return null;
}

function severityLabel(s: WhyItem["severity"]) {
  if (s === "high") return "High";
  if (s === "medium") return "Medium";
  return "Low";
}

function buildWhyRisky(computed: DetailComputed | null): WhyItem[] {
  if (!computed) return [];

  const reuseOthers = Math.max(0, (computed.reuseCount ?? 0) - 1);
  const variantOthers = Math.max(0, (computed.variantCount ?? 0) - 1);

  const tooShort = computed.length > 0 && computed.length < MIN_LENGTH;
  const weak = computed.strength === PasswordStrengthLevel.WEAK;
  const sequential = (computed.sequentialTriples?.length ?? 0) > 0;
  const repeated = computed.repeated;

  const out: WhyItem[] = [];

  if ((computed.reuseCount ?? 0) >= 2) {
    out.push({
      key: "reused",
      severity: "high",
      text: `Reused in ${reuseOthers} other entr${reuseOthers === 1 ? "y" : "ies"}.`,
    });
  }

  if (weak) {
    out.push({
      key: "weak",
      severity: "high",
      text: "Weak and likely guessable. Replace with a generated password.",
    });
  }

  if (tooShort) {
    out.push({
      key: "short",
      severity: "medium",
      text: `Too short (${computed.length}). Aim for ${MIN_LENGTH}+ characters.`,
    });
  }

  if ((computed.variantCount ?? 0) >= 2) {
    out.push({
      key: "similar",
      severity: "medium",
      text: `Similar to ${variantOthers} other entr${
        variantOthers === 1 ? "y" : "ies"
      }. Consider unique passwords per site.`,
    });
  }

  if (sequential) {
    out.push({
      key: "sequential",
      severity: "low",
      text: `Contains sequential patterns (${computed.sequentialTriples.join(", ")}).`,
    });
  }

  if (repeated) {
    out.push({
      key: "repeated",
      severity: "low",
      text: "Contains repeated characters.",
    });
  }

  if (out.length === 0) {
    out.push({
      key: "ok",
      severity: "low",
      text: "No notable issues detected.",
    });
  }

  return out;
}

const AnalysisDetailScreen: React.FC<AnalysisDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { ref } = route.params;

  const tabNav = useNavigation<BottomTabNavigationProp<AppTabsParamList>>();

  const vault = useVault();
  const { getMaster } = useAuth();
  const {
    globalStyles,
    theme,
    headerWhite,
    setHeaderWhite,
    darkmode,
    setHeaderSpacing,
  } = useTheme();
  const { t } = useTranslation();

  const values = useMemo(() => {
    if (!vault.isUnlocked) return undefined;
    try {
      return vault.exportFullData().values ?? [];
    } catch {
      return undefined;
    }
  }, [vault.isUnlocked, vault.dirty, vault]);

  // valueItem is the actual entry object expected by EditScreen (same as HomeScreen)
  const valueItem = useMemo(() => {
    if (!values) return null;
    return values.find((v: any) => v.id === ref.valueId) ?? null;
  }, [values, ref.valueId]);

  const resolved = useMemo(() => {
    if (!values) return null;
    return resolveById(values, ref);
  }, [values, ref]);

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [passwordPlain, setPasswordPlain] = useState<string | null>(null);
  const [computed, setComputed] = useState<DetailComputed | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(40);
      setHeaderWhite(false);

      return () => {
        setSecureTextEntry(true);
        setPasswordPlain(null);
        setComputed(null);
      };
    }, [setHeaderSpacing, setHeaderWhite])
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const master = getMaster();
      if (!resolved || !values || !master) {
        setComputed(null);
        return;
      }

      const pw = String(resolved.password ?? "");
      const entropyBits = passwordEntropy(pw);
      const strength = strengthFromEntropyBits(
        entropyBits
      ) as PasswordStrengthLevel;

      const length = pw.length;
      const pattern = classifyPattern(pw);
      const sequentialTriples = findSequentialTriples(pw);
      const repeated = hasRepeatedChars(pw);
      const charAnalysis = analyzeCharacterComposition(pw);

      const pepper = await deriveAnalysisPepperFromMaster(master);
      const fp = await fingerprintPassword(pepper, pw);
      const canonical = canonicalizeForVariants(pw);

      let reuseCount = 0;
      let variantCount = 0;

      for (const v of values) {
        for (const m of v.modules) {
          const isPwd = m.module === ModulesEnum.PASSWORD;
          const isWifi = m.module === ModulesEnum.WIFI;
          if (!isPwd && !isWifi) continue;

          const otherPw = isPwd
            ? String((m as any).value ?? "")
            : String((m as WifiModuleType).value ?? "");

          // ignore empty secrets
          if (!otherPw.trim()) continue;

          const otherFp = await fingerprintPassword(pepper, otherPw);
          if (otherFp === fp) reuseCount++;

          const otherCanonical = canonicalizeForVariants(otherPw);
          if (
            canonical &&
            canonical.length >= 4 &&
            otherCanonical === canonical
          ) {
            variantCount++;
          }
        }
      }

      if (cancelled) return;

      setComputed({
        entropyBits,
        strength,
        length,
        pattern,
        sequentialTriples,
        repeated,
        charAnalysis,
        reuseCount,
        variantCount,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [resolved, values, getMaster]);

  const onToggleEye = () => {
    if (!resolved) return;

    if (secureTextEntry) {
      setPasswordPlain(resolved.password);
      setSecureTextEntry(false);
    } else {
      setSecureTextEntry(true);
      setPasswordPlain(null);
    }
  };

  const shownPassword = secureTextEntry
    ? "••••••••••••"
    : (passwordPlain ?? "");
  const strength = computed?.strength ?? null;
  const why = useMemo(() => buildWhyRisky(computed), [computed]);

  const showReused = (computed?.reuseCount ?? 0) >= 2;
  const showSimilar = (computed?.variantCount ?? 0) >= 2;
  const showShort =
    (computed?.length ?? 0) > 0 && (computed?.length ?? 0) < MIN_LENGTH;
  const showSequential = (computed?.sequentialTriples?.length ?? 0) > 0;
  const showRepeated = computed?.repeated ?? false;

  const strengthPillBg = strength
    ? getPasswordStrengthColor(strength as any)
    : theme.colors.primary;

  const secretTypeLabel =
    resolved?.kind === "wifi"
      ? t("common:wifi", { defaultValue: "Wi-Fi" })
      : t("common:password", { defaultValue: "Password" });

  const goToEdit = () => {
    if (!valueItem) return;

    tabNav.dispatch(
      CommonActions.navigate({
        name: "HomeStack",
        params: {
          screen: "Edit",
          params: { value: valueItem },
        },
      })
    );
  };

  return (
    <AnimatedContainer style={globalStyles.container}>
      <StatusBar
        animated
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent
      />

      <Header
        onPress={() => navigation.goBack()}
        title={
          resolved?.title ??
          t("analysisDetail:title", { defaultValue: "Analysis" })
        }
      />

      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ padding: 8 }}
      >
        <View style={{ gap: GAP }}>
          <View style={{ height: GAP }} />

          {/* Top row: Secret type chip + Strength pill */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
            }}
          >
            {resolved ? (
              <Chip
                icon={() => (
                  <Icon
                    source={resolved.typeIcon}
                    size={18}
                    color={theme.colors.primary}
                  />
                )}
              >
                {secretTypeLabel}
              </Chip>
            ) : null}

            {strength ? (
              <View
                style={[
                  styles.pill,
                  {
                    backgroundColor: strengthPillBg,
                    borderColor: "transparent",
                  },
                ]}
              >
                <Icon
                  source={getPasswordStrengthIcon(strength as any)}
                  size={18}
                  color={"white"}
                />
                <Text style={{ color: "white", fontWeight: "800" }}>
                  {t(`analysis:${String(strength).toLowerCase()}`, {
                    defaultValue: String(strength),
                  })}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Password textbox block */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.background,
                borderColor: darkmode ? theme.colors.outlineVariant : "white",
                padding: 10,
              },
            ]}
          >
            <Text
              variant="labelSmall"
              style={{ opacity: 0.7, marginBottom: 6 }}
            >
              {t("analysisDetail:yourPassword", {
                defaultValue: "Your password",
              })}
            </Text>

            <TextInput
              outlineStyle={[
                globalStyles.outlineStyle,
                {
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                },
              ]}
              style={[globalStyles.textInputStyle, { userSelect: "none" }]}
              value={shownPassword}
              mode="outlined"
              secureTextEntry={secureTextEntry}
              readOnly
              right={
                <TextInput.Icon
                  animated
                  icon={secureTextEntry ? "eye" : "eye-off"}
                  color={theme.colors.primary}
                  onPress={onToggleEye}
                />
              }
            />

            {/* Findings badges */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 10,
              }}
            >
              {showReused ? (
                <Chip compact style={{ borderRadius: 12 }}>
                  {t("analysis:badge.reused", { defaultValue: "Reused" })}
                </Chip>
              ) : null}
              {showSimilar ? (
                <Chip compact style={{ borderRadius: 12 }}>
                  {t("analysis:badge.similar", { defaultValue: "Similar" })}
                </Chip>
              ) : null}
              {showShort ? (
                <Chip compact style={{ borderRadius: 12 }}>
                  {t("analysis:badge.short", { defaultValue: "Too short" })}
                </Chip>
              ) : null}
              {showSequential ? (
                <Chip compact style={{ borderRadius: 12 }}>
                  {t("analysis:badge.sequential", {
                    defaultValue: "Sequential",
                  })}
                </Chip>
              ) : null}
              {showRepeated ? (
                <Chip compact style={{ borderRadius: 12 }}>
                  {t("analysis:badge.repeated", { defaultValue: "Repeated" })}
                </Chip>
              ) : null}
            </View>

            <Divider style={{ marginVertical: 10 }} />

            <Button mode="outlined" onPress={goToEdit} disabled={!valueItem}>
              {t("analysisDetail:editEntry", { defaultValue: "Edit entry" })}
            </Button>
          </View>

          {/* Why risky with dividers between items */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.background,
                borderColor: darkmode ? theme.colors.outlineVariant : "white",
                padding: 10,
              },
            ]}
          >
            <Text style={{ fontWeight: "900", marginBottom: 8 }}>
              {t("analysisDetail:whyRisky", {
                defaultValue: "Why this is risky",
              })}
            </Text>

            <View style={{ borderRadius: 12, overflow: "hidden" }}>
              {why.map((w, idx) => (
                <View key={w.key}>
                  {idx !== 0 ? <Divider /> : null}
                  <View
                    style={{
                      paddingVertical: 10,
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <Chip compact>{severityLabel(w.severity)}</Chip>
                    <Text style={{ flex: 1, opacity: 0.85 }}>{w.text}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Text variant="bodySmall" style={{ opacity: 0.65, marginTop: 10 }}>
              {t("analysisDetail:whyHint", {
                defaultValue: "Prioritize reused and weak passwords first.",
              })}
            </Text>
          </View>

          {/* Advanced details compact accordion */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.background,
                borderColor: darkmode ? theme.colors.outlineVariant : "white",
                padding: 0,
                overflow: "hidden",
              },
            ]}
          >
            <List.Accordion
              title={t("analysisDetail:advanced", {
                defaultValue: "Advanced details",
              })}
              style={{ paddingHorizontal: 8, paddingVertical: 0 }}
              titleStyle={{ fontWeight: "800" }}
            >
              <View
                style={{ paddingHorizontal: 10, paddingBottom: 10, gap: 10 }}
              >
                <View style={styles.kvRow}>
                  <Text style={styles.kvKey}>Entropy</Text>
                  <Text style={styles.kvVal}>
                    {Math.floor(computed?.entropyBits ?? 0)} bits
                  </Text>
                </View>

                <View style={styles.kvRow}>
                  <Text style={styles.kvKey}>Length</Text>
                  <Text style={styles.kvVal}>{computed?.length ?? 0}</Text>
                </View>

                <Divider />

                <View style={styles.kvRow}>
                  <Text style={styles.kvKey}>Pattern</Text>
                  <Text style={styles.kvVal}>{computed?.pattern ?? "-"}</Text>
                </View>

                <View style={styles.kvRow}>
                  <Text style={styles.kvKey}>Letters</Text>
                  <Text style={styles.kvVal}>
                    {computed?.charAnalysis?.letters ?? 0} (
                    {Math.round(computed?.charAnalysis?.lettersPercent ?? 0)}%)
                  </Text>
                </View>

                <View style={styles.kvRow}>
                  <Text style={styles.kvKey}>Digits</Text>
                  <Text style={styles.kvVal}>
                    {computed?.charAnalysis?.digits ?? 0} (
                    {Math.round(computed?.charAnalysis?.digitsPercent ?? 0)}%)
                  </Text>
                </View>

                <View style={styles.kvRow}>
                  <Text style={styles.kvKey}>Symbols</Text>
                  <Text style={styles.kvVal}>
                    {computed?.charAnalysis?.specialCharacters ?? 0} (
                    {Math.round(
                      computed?.charAnalysis?.specialCharactersPercent ?? 0
                    )}
                    %)
                  </Text>
                </View>

                {(computed?.sequentialTriples?.length ?? 0) > 0 ? (
                  <>
                    <Divider />
                    <View style={styles.kvRow}>
                      <Text style={styles.kvKey}>Sequential</Text>
                      <Text style={styles.kvVal}>
                        {computed?.sequentialTriples.join(", ")}
                      </Text>
                    </View>
                  </>
                ) : null}
              </View>
            </List.Accordion>
          </View>

          <View style={{ height: GAP }} />
        </View>
      </ScrollView>
    </AnimatedContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  kvRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  kvKey: {
    opacity: 0.7,
    fontWeight: "700",
  },
  kvVal: {
    opacity: 0.9,
    flex: 1,
    textAlign: "right",
  },
});

export default AnalysisDetailScreen;
