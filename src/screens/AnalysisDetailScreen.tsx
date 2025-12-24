// AnalysisDetailScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation, CommonActions } from "@react-navigation/native";

import { ScrollView, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, Chip, Divider, Icon, List, Text, TextInput } from "react-native-paper";
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

import {
  canonicalizeForVariants,
  deriveAnalysisPepperFromMaster,
  fingerprintPassword,
} from "../features/analysis/utils/analysisEngine";

import getPasswordStrengthColor from "../features/analysis/utils/getPasswordStrengthColor";
import getPasswordStrengthIcon from "../features/analysis/utils/getPasswordStrengthIcon";
import { MODULE_ICON } from "../features/vault/model/ModuleIconsEnum";
import { AnalysisStackParamList, AppTabsParamList } from "../app/navigation/model/types";

import { evaluatePasswordForDetail } from "../features/analysis/utils/riskModel";

type AnalysisDetailScreenProps = NativeStackScreenProps<AnalysisStackParamList, "AnalysisDetail">;

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

  riskScore: number;
  riskSeverity: "Critical" | "High" | "Medium" | "Low" | "OK";

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
  let letters = 0;
  let digits = 0;
  let specialCharacters = 0;

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

function severityLabelKey(severity: WhyItem["severity"]) {
  if (severity === "high") return "analysisDetail:severity.high";
  if (severity === "medium") return "analysisDetail:severity.medium";
  return "analysisDetail:severity.low";
}

function buildWhyRisky(computed: DetailComputed | null, t: (k: string, o?: any) => string): WhyItem[] {
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
      text: t("analysisDetail:why.reused", {
        defaultValue: "Reused in {{count}} other entries.",
        count: reuseOthers,
      }),
    });
  }

  if (weak) {
    out.push({
      key: "weak",
      severity: "high",
      text: t("analysisDetail:why.weak", {
        defaultValue: "Weak and likely guessable. Replace with a generated password.",
      }),
    });
  }

  if (tooShort) {
    out.push({
      key: "short",
      severity: "medium",
      text: t("analysisDetail:why.short", {
        defaultValue: "Too short ({{length}}). Aim for {{min}}+ characters.",
        length: computed.length,
        min: MIN_LENGTH,
      }),
    });
  }

  if ((computed.variantCount ?? 0) >= 2) {
    out.push({
      key: "similar",
      severity: "medium",
      text: t("analysisDetail:why.similar", {
        defaultValue: "Similar to {{count}} other entries. Consider unique passwords per site.",
        count: variantOthers,
      }),
    });
  }

  if (sequential) {
    out.push({
      key: "sequential",
      severity: "low",
      text: t("analysisDetail:why.sequential", {
        defaultValue: "Contains sequential patterns ({{seq}}).",
        seq: computed.sequentialTriples.join(", "),
      }),
    });
  }

  if (repeated) {
    out.push({
      key: "repeated",
      severity: "low",
      text: t("analysisDetail:why.repeated", {
        defaultValue: "Contains repeated characters.",
      }),
    });
  }

  if (out.length === 0) {
    out.push({
      key: "ok",
      severity: "low",
      text: t("analysisDetail:why.ok", {
        defaultValue: "No notable issues detected.",
      }),
    });
  }

  return out;
}

function strengthLabelKey(strength: PasswordStrengthLevel) {
  // you already use `analysis:weak|medium|strong` elsewhere, so keep consistent
  return `analysis:${String(strength).toLowerCase()}`;
}

function riskSeverityLabelKey(sev: DetailComputed["riskSeverity"]) {
  return `analysisDetail:risk.${String(sev).toLowerCase()}`;
}

function buildStrengthVsRiskExplanation(
  computed: DetailComputed | null,
  t: (k: string, o?: any) => string
): string | null {
  if (!computed) return null;
  if (computed.riskSeverity === "OK") return null;

  const reuseOthers = Math.max(0, (computed.reuseCount ?? 0) - 1);
  const variantOthers = Math.max(0, (computed.variantCount ?? 0) - 1);

  // build “drivers” in a translated way
  const drivers: string[] = [];

  if ((computed.reuseCount ?? 0) >= 2) {
    drivers.push(
      t("analysisDetail:svr.driver.reused", {
        defaultValue: "reused {{count}} time(s)",
        count: reuseOthers,
      })
    );
  }
  if ((computed.variantCount ?? 0) >= 2) {
    drivers.push(
      t("analysisDetail:svr.driver.similar", {
        defaultValue: "similar to {{count}} other entry/entries",
        count: variantOthers,
      })
    );
  }
  if (computed.length > 0 && computed.length < MIN_LENGTH) {
    drivers.push(
      t("analysisDetail:svr.driver.short", {
        defaultValue: "too short ({{length}})",
        length: computed.length,
      })
    );
  }
  if ((computed.sequentialTriples?.length ?? 0) > 0) {
    drivers.push(
      t("analysisDetail:svr.driver.sequential", {
        defaultValue: "sequential patterns",
      })
    );
  }
  if (computed.repeated) {
    drivers.push(
      t("analysisDetail:svr.driver.repeated", {
        defaultValue: "repeated characters",
      })
    );
  }

  const base = t("analysisDetail:svr.base", {
    defaultValue:
      "Strength measures guessability (entropy). Risk also considers exposure and patterns like reuse, similarity, and short/predictable structures.",
  });

  const driversLine =
    drivers.length > 0
      ? t("analysisDetail:svr.drivers", {
          defaultValue: "This password is risky mainly because it is {{drivers}}.",
          drivers: drivers.join(", "),
        })
      : t("analysisDetail:svr.driversFallback", {
          defaultValue: "This password is risky due to contextual risk factors.",
        });

  const note =
    computed.strength === PasswordStrengthLevel.STRONG && computed.riskScore > 0
      ? t("analysisDetail:svr.noteStrongButRisky", {
          defaultValue: "So it can be strong and still risky if it is exposed (for example by reuse).",
        })
      : "";

  return [base, driversLine, note].filter(Boolean).join(" ");
}

const AnalysisDetailScreen: React.FC<AnalysisDetailScreenProps> = ({ route, navigation }) => {
  const { ref } = route.params;

  const tabNav = useNavigation<BottomTabNavigationProp<AppTabsParamList>>();

  const vault = useVault();
  const { getMaster } = useAuth();
  const { globalStyles, theme, headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } = useTheme();
  const { t } = useTranslation();

  const values = useMemo(() => {
    if (!vault.isUnlocked) return undefined;
    try {
      return vault.exportFullData().values ?? [];
    } catch {
      return undefined;
    }
  }, [vault.isUnlocked, vault.dirty, vault]);

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

      const length = pw.length;
      const pattern = classifyPattern(pw);
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

          if (!otherPw.trim()) continue;

          const otherFp = await fingerprintPassword(pepper, otherPw);
          if (otherFp === fp) reuseCount++;

          const otherCanonical = canonicalizeForVariants(otherPw);
          if (canonical && canonical.length >= 4 && otherCanonical === canonical) {
            variantCount++;
          }
        }
      }

      if (cancelled) return;

      const ev = evaluatePasswordForDetail(pw, reuseCount, variantCount);

      setComputed({
        entropyBits: ev.entropyBits,
        strength: ev.strength,

        riskScore: ev.riskScore,
        riskSeverity: ev.severity,

        length,
        pattern,
        sequentialTriples: ev.sequentialTriples,
        repeated: ev.repeated,
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

  const shownPassword = secureTextEntry ? "••••••••••••" : passwordPlain ?? "";

  const strength = computed?.strength ?? null;
  const riskSeverity = computed?.riskSeverity ?? null;

  const why = useMemo(() => buildWhyRisky(computed, t), [computed, t]);
  const strengthVsRiskText = useMemo(() => buildStrengthVsRiskExplanation(computed, t), [computed, t]);

  const showReused = (computed?.reuseCount ?? 0) >= 2;
  const showSimilar = (computed?.variantCount ?? 0) >= 2;
  const showShort = (computed?.length ?? 0) > 0 && (computed?.length ?? 0) < MIN_LENGTH;
  const showSequential = (computed?.sequentialTriples?.length ?? 0) > 0;
  const showRepeated = computed?.repeated ?? false;

  const strengthPillBg = strength ? getPasswordStrengthColor(strength as any) : theme.colors.primary;

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
      <StatusBar animated style={headerWhite ? "light" : darkmode ? "light" : "dark"} translucent />

      <Header
        onPress={() => navigation.goBack()}
        title={resolved?.title ?? t("analysisDetail:title", { defaultValue: "Analysis" })}
      />

      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ padding: 8, paddingTop: 0 }}>
        <View style={{ gap: 8 }}>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {resolved ? (
              <Chip
                icon={() => <Icon source={resolved.typeIcon} size={18} color={theme.colors.primary} />}
                style={{ borderRadius: 12}}
              >
                {secretTypeLabel}
              </Chip>
            ) : null}

            {strength ? (
              <Chip
                style={{ borderRadius: 12, backgroundColor: strengthPillBg }}
                textStyle={{ color: "white", fontWeight: "800" }}
                icon={() => <Icon source={getPasswordStrengthIcon(strength as any)} size={18} color="white" />}
              >
                {t(strengthLabelKey(strength), { defaultValue: String(strength) })}
              </Chip>
            ) : null}

            {riskSeverity ? (
              <Chip
                style={{
                  borderRadius: 12,
                  
                }}
              >
                {t(riskSeverityLabelKey(riskSeverity), { defaultValue: String(riskSeverity) })}
              </Chip>
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
            <Text variant="labelSmall" style={{ opacity: 0.7, marginBottom: 6 }}>
              {t("analysisDetail:yourPassword", { defaultValue: "Your password" })}
            </Text>

            <TextInput
              outlineStyle={[
                globalStyles.outlineStyle,
                { borderColor: theme.colors.primary, borderWidth: 2 },
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
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
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
                  {t("analysis:badge.sequential", { defaultValue: "Sequential" })}
                </Chip>
              ) : null}
              {showRepeated ? (
                <Chip compact style={{ borderRadius: 12 }}>
                  {t("analysis:badge.repeated", { defaultValue: "Repeated" })}
                </Chip>
              ) : null}
            </View>

            <Divider style={{ marginVertical: 10 }} />

            <Button
              mode="outlined"
              onPress={goToEdit}
              disabled={!valueItem}
              style={{ borderRadius: 12 }}
              contentStyle={{ borderRadius: 12 }}
            >
              {t("analysisDetail:editEntry", { defaultValue: "Edit entry" })}
            </Button>
          </View>

          {/* Why risky */}
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
              {t("analysisDetail:whyRisky", { defaultValue: "Why this is risky" })}
            </Text>

            <View style={{ borderRadius: 12, overflow: "hidden" }}>
              {why.map((w, idx) => (
                <View key={w.key}>
                  {idx !== 0 ? <Divider /> : null}
                  <View style={{ paddingVertical: 10, flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
                    <Chip compact>{t(severityLabelKey(w.severity), { defaultValue: w.severity })}</Chip>
                    <Text style={{ flex: 1, opacity: 0.85 }}>{w.text}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Text variant="bodySmall" style={{ opacity: 0.65, marginTop: 10 }}>
              {t("analysisDetail:whyHint", {
                defaultValue: "Fix reused passwords first. Even strong passwords become risky when reused.",
              })}
            </Text>
          </View>

          {/* Strength vs Risk (moved down: above Advanced details) */}
          {strengthVsRiskText ? (
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
              <Text style={{ fontWeight: "900", marginBottom: 6 }}>
                {t("analysisDetail:strengthVsRiskTitle", { defaultValue: "Strength vs. Risk" })}
              </Text>

              <Text style={{ opacity: 0.85 }}>{strengthVsRiskText}</Text>

              {computed ? (
                <Text style={{ marginTop: 8, opacity: 0.7 }}>
                  {t("analysisDetail:strengthVsRiskMeta", {
                    defaultValue: "Entropy: {{bits}} bits · Risk score: {{score}}/100",
                    bits: Math.floor(computed.entropyBits),
                    score: computed.riskScore,
                  })}
                </Text>
              ) : null}
            </View>
          ) : null}

          {/* Advanced details */}
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
              title={t("analysisDetail:advanced", { defaultValue: "Advanced details" })}
              style={{ paddingHorizontal: 8, paddingVertical: 0 }}
              titleStyle={{ fontWeight: "800" }}
            >
              <View style={{ paddingHorizontal: 10, paddingBottom: 10, gap: 10 }}>
                <View style={styles.kvRow}>
                  <Text style={styles.kvKey}>{t("analysisDetail:advanced.entropy", { defaultValue: "Entropy" })}</Text>
                  <Text style={styles.kvVal}>
                    {t("analysisDetail:advanced.bitsValue", {
                      defaultValue: "{{bits}} bits",
                      bits: Math.floor(computed?.entropyBits ?? 0),
                    })}
                  </Text>
                </View>

                <View style={styles.kvRow}>
                  <Text style={styles.kvKey}>{t("analysisDetail:advanced.riskScore", { defaultValue: "Risk score" })}</Text>
                  <Text style={styles.kvVal}>
                    {t("analysisDetail:advanced.riskScoreValue", {
                      defaultValue: "{{score}}/100",
                      score: computed?.riskScore ?? 0,
                    })}
                  </Text>
                </View>

                <View style={styles.kvRow}>
                  <Text style={styles.kvKey}>{t("analysisDetail:advanced.length", { defaultValue: "Length" })}</Text>
                  <Text style={styles.kvVal}>{computed?.length ?? 0}</Text>
                </View>

                <Divider />

                <View style={styles.kvRow}>
                  <Text style={styles.kvKey}>{t("analysisDetail:advanced.pattern", { defaultValue: "Pattern" })}</Text>
                  <Text style={styles.kvVal}>{computed?.pattern ?? "-"}</Text>
                </View>

                <View style={styles.kvRow}>
                  <Text style={styles.kvKey}>{t("analysisDetail:advanced.letters", { defaultValue: "Letters" })}</Text>
                  <Text style={styles.kvVal}>
                    {t("analysisDetail:advanced.countPercent", {
                      defaultValue: "{{count}} ({{percent}}%)",
                      count: computed?.charAnalysis?.letters ?? 0,
                      percent: Math.round(computed?.charAnalysis?.lettersPercent ?? 0),
                    })}
                  </Text>
                </View>

                <View style={styles.kvRow}>
                  <Text style={styles.kvKey}>{t("analysisDetail:advanced.digits", { defaultValue: "Digits" })}</Text>
                  <Text style={styles.kvVal}>
                    {t("analysisDetail:advanced.countPercent", {
                      defaultValue: "{{count}} ({{percent}}%)",
                      count: computed?.charAnalysis?.digits ?? 0,
                      percent: Math.round(computed?.charAnalysis?.digitsPercent ?? 0),
                    })}
                  </Text>
                </View>

                <View style={styles.kvRow}>
                  <Text style={styles.kvKey}>{t("analysisDetail:advanced.symbols", { defaultValue: "Symbols" })}</Text>
                  <Text style={styles.kvVal}>
                    {t("analysisDetail:advanced.countPercent", {
                      defaultValue: "{{count}} ({{percent}}%)",
                      count: computed?.charAnalysis?.specialCharacters ?? 0,
                      percent: Math.round(computed?.charAnalysis?.specialCharactersPercent ?? 0),
                    })}
                  </Text>
                </View>

                {(computed?.sequentialTriples?.length ?? 0) > 0 ? (
                  <>
                    <Divider />
                    <View style={styles.kvRow}>
                      <Text style={styles.kvKey}>
                        {t("analysisDetail:advanced.sequential", { defaultValue: "Sequential" })}
                      </Text>
                      <Text style={styles.kvVal}>{computed?.sequentialTriples.join(", ")}</Text>
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
