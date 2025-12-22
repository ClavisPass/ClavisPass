import React, { useEffect, useMemo, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../shared/components/Header";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import { useTheme } from "../app/providers/ThemeProvider";
import { Chip, Divider, Icon, Text, TextInput } from "react-native-paper";
import ModulesEnum from "../features/vault/model/ModulesEnum";
import WifiModuleType from "../features/vault/model/modules/WifiModuleType";
import { ScrollView, View, StyleSheet } from "react-native";
import AnalysisEntry from "../features/analysis/components/AnalysisEntry";
import AnalysisEntryGradient from "../features/analysis/components/AnalysisEntryGradient";
import Pattern from "../features/analysis/components/Pattern";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import getPasswordStrengthColor from "../features/analysis/utils/getPasswordStrengthColor";
import getPasswordStrengthIcon from "../features/analysis/utils/getPasswordStrengthIcon";
import { RootStackParamList } from "../app/navigation/stacks/Stack";
import { useTranslation } from "react-i18next";
import { useAuth } from "../app/providers/AuthProvider";

import passwordEntropy from "../features/analysis/utils/Entropy";
import AnalysisRef from "../features/analysis/model/AnalysisRef";
import PasswordStrengthLevel from "../features/analysis/model/PasswordStrengthLevel";

import {
  canonicalizeForVariants,
  deriveAnalysisPepperFromMaster,
  fingerprintPassword,
  findSequentialTriples,
  hasRepeatedChars,
  strengthFromEntropyBits,
} from "../features/analysis/utils/analysisEngine";
import { useVault } from "../app/providers/VaultProvider";
import { MODULE_ICON } from "../features/vault/model/ModuleIconsEnum";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

type AnalysisDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "AnalysisDetail"
>;

type CharacterAnalysis = {
  letters: number;
  lettersPercent: number;
  digits: number;
  digitsPercent: number;
  specialCharacters: number;
  specialCharactersPercent: number;
} | null;

type DetailComputed = {
  entropyBits: number;
  strength: PasswordStrengthLevel;
  pattern: string;
  sequential: string[];
  repeated: boolean;
  charAnalysis: CharacterAnalysis;
  length: number;

  reuseCount: number; // wie oft exakt wiederverwendet (inkl. dieses)
  variantCount: number; // wie viele Varianten (inkl. dieses)
};

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

function resolveById(
  values: any[],
  ref: AnalysisRef
): { title: string; password: string; typeIcon: any } | null {
  const value = values.find((v) => v.id === ref.valueId);
  if (!value) return null;

  const mod = value.modules.find((m: any) => m.id === ref.moduleId);
  if (!mod) return null;

  if (ref.type === ModulesEnum.PASSWORD) {
    return {
      title: value.title,
      password: String((mod as any).value),
      typeIcon: MODULE_ICON[ModulesEnum.PASSWORD],
    };
  }

  if (ref.type === ModulesEnum.WIFI) {
    const wifi = mod as WifiModuleType;
    return {
      title: wifi.wifiName ?? value.title,
      password: wifi.value,
      typeIcon: MODULE_ICON[ModulesEnum.WIFI],
    };
  }

  return null;
}

function Badge({ text }: { text: string }) {
  return <Chip style={{ borderRadius: 12 }}>{text}</Chip>;
}

const AnalysisDetailScreen: React.FC<AnalysisDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { ref } = route.params;

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
  }, [vault, vault.isUnlocked, vault.dirty]);

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

      const pw = resolved.password;

      const entropyBits = passwordEntropy(pw);
      const strength = strengthFromEntropyBits(
        entropyBits
      ) as PasswordStrengthLevel;
      const pattern = classifyPattern(pw);
      const sequential = findSequentialTriples(pw);
      const repeated = hasRepeatedChars(pw);
      const charAnalysis = analyzeCharacterComposition(pw);
      const length = pw.length;

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
            ? String((m as any).value)
            : (m as WifiModuleType).value;

          const otherFp = await fingerprintPassword(pepper, otherPw);
          if (otherFp === fp) reuseCount++;

          const otherCanonical = canonicalizeForVariants(otherPw);
          if (
            canonical &&
            canonical.length >= 4 &&
            otherCanonical === canonical
          )
            variantCount++;
        }
      }

      if (cancelled) return;

      setComputed({
        entropyBits,
        strength,
        pattern,
        sequential,
        repeated,
        charAnalysis,
        length,
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

  const showReused = (computed?.reuseCount ?? 0) >= 2;
  const showVariant = (computed?.variantCount ?? 0) >= 2;
  const showShort = (computed?.length ?? 0) > 0 && (computed?.length ?? 0) < 12;
  const showSequential = (computed?.sequential?.length ?? 0) > 0;
  const showRepeated = computed?.repeated ?? false;

  const reuseOthers = Math.max(0, (computed?.reuseCount ?? 0) - 1);
  const variantOthers = Math.max(0, (computed?.variantCount ?? 0) - 1);

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

      <ScrollView style={{ width: "100%", padding: 6 }}>
        <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* 1) Password field */}
          <View>
            <Text
              variant="labelSmall"
              style={{ opacity: 0.7, userSelect: "none", marginLeft: 6 }}
            >
              {t("analysisDetail:yourPassword")}
            </Text>

            <View
              style={{
                height: 40,
                flexDirection: "row",
                gap: 6,
                alignItems: "center",
              }}
            >
              <Icon
                source={resolved?.typeIcon ?? ""}
                color={theme.colors?.primary}
                size={24}
              />

              <TextInput
                outlineStyle={[
                  globalStyles.outlineStyle,
                  {
                    borderColor: theme.colors.primary,
                    borderWidth: 2,
                    flexGrow: 1,
                  },
                ]}
                style={[
                  globalStyles.textInputStyle,
                  { userSelect: "none", flexGrow: 1 },
                ]}
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
            </View>
          </View>

          {/* 2) Findings badges directly under password */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              paddingHorizontal: 6,
              marginTop: -2,
            }}
          >
            {showReused ? (
              <Badge
                text={t("analysisDetail:badge.reused", {
                  defaultValue: `Reused (${computed?.reuseCount})`,
                })}
              />
            ) : null}
            {showVariant ? (
              <Badge
                text={t("analysisDetail:badge.variant", {
                  defaultValue: `Variant (${computed?.variantCount})`,
                })}
              />
            ) : null}
            {showShort ? (
              <Badge
                text={t("analysisDetail:badge.short", {
                  defaultValue: "Too short",
                })}
              />
            ) : null}
            {showSequential ? (
              <Badge
                text={t("analysisDetail:badge.sequential", {
                  defaultValue: "Sequential",
                })}
              />
            ) : null}
            {showRepeated ? (
              <Badge
                text={t("analysisDetail:badge.repeated", {
                  defaultValue: "Repeated",
                })}
              />
            ) : null}
          </View>

          {/* 3) Reused/Variant explanation lines */}
          {(showReused || showVariant) && computed ? (
            <View style={{ paddingHorizontal: 10, marginTop: -2 }}>
              {showReused ? (
                <Text variant="labelSmall" style={{ opacity: 0.75 }}>
                  • Reused counts exact matches including this entry — that
                  equals {reuseOthers} other entries.
                </Text>
              ) : null}
              {showVariant ? (
                <Text variant="labelSmall" style={{ opacity: 0.75 }}>
                  • Variant counts the same base password (canonical form)
                  including this entry — that equals {variantOthers} other
                  entries.
                </Text>
              ) : null}
            </View>
          ) : null}

          {/* 4) Stats */}
          <Text
            variant="labelSmall"
            style={{ opacity: 0.7, userSelect: "none", marginLeft: 6 }}
          >
            {t("analysisDetail:statistics")}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              height: 80,
              gap: 6,
            }}
          >
            <AnalysisEntryGradient
              name={t("analysisDetail:entropy")}
              number={Math.floor(computed?.entropyBits ?? 0)}
              percentage={Math.min(
                100,
                ((computed?.entropyBits ?? 0) / 80) * 100
              )}
              fixed
            />
            <AnalysisEntry
              name={t("analysisDetail:length", { defaultValue: "Length" })}
              number={computed?.length ?? 0}
              percentage={Math.min(100, ((computed?.length ?? 0) / 20) * 100)}
              fixed
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              height: 80,
              gap: 6,
            }}
          >
            <AnalysisEntry
              name={t("analysisDetail:letters")}
              number={computed?.charAnalysis?.letters ?? 0}
              percentage={computed?.charAnalysis?.lettersPercent ?? 0}
              fixed
            />
            <AnalysisEntry
              name={t("analysisDetail:digits")}
              number={computed?.charAnalysis?.digits ?? 0}
              percentage={computed?.charAnalysis?.digitsPercent ?? 0}
              fixed
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              height: 80,
              gap: 6,
            }}
          >
            <AnalysisEntry
              name={t("analysisDetail:characters")}
              number={computed?.charAnalysis?.specialCharacters ?? 0}
              percentage={computed?.charAnalysis?.specialCharactersPercent ?? 0}
              fixed
            />
            <AnalysisEntry
              name={t("analysisDetail:reuse", { defaultValue: "Reuse" })}
              number={Math.max(0, (computed?.reuseCount ?? 0) - 1)}
              percentage={Math.min(
                100,
                Math.max(0, (computed?.reuseCount ?? 0) - 1) * 25
              )}
              fixed
            />
          </View>

          {/* 5) Note block */}
          <View
            style={{
              marginHorizontal: 6,
              padding: 10,
              borderRadius: 12,
              backgroundColor: theme.colors.background,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: darkmode ? theme.colors.outlineVariant : "white",
            }}
          >
            <Text style={{ opacity: 0.8 }}>
              Note: The “%” bars in these tiles are scale indicators to compare
              values at a glance. They are not “percent of all passwords”.
            </Text>
          </View>

          {/* 6) What these values mean */}
          <View
            style={{
              marginHorizontal: 6,
              padding: 10,
              borderRadius: 12,
              backgroundColor: theme.colors.background,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: darkmode ? theme.colors.outlineVariant : "white",
            }}
          >
            <Text style={{ fontWeight: "700", marginBottom: 6 }}>
              What these values mean
            </Text>

            <Text style={{ opacity: 0.8 }}>
              • <Text style={{ fontWeight: "700" }}>Entropy:</Text> Estimated
              unpredictability. Higher is better.
            </Text>

            <Text style={{ opacity: 0.8, marginTop: 6 }}>
              • <Text style={{ fontWeight: "700" }}>Length:</Text> Number of
              characters. Aim for 12+ where possible.
            </Text>

            <Text style={{ opacity: 0.8, marginTop: 6 }}>
              • <Text style={{ fontWeight: "700" }}>Letters:</Text> Count and
              share of a–z/A–Z characters.
            </Text>

            <Text style={{ opacity: 0.8, marginTop: 6 }}>
              • <Text style={{ fontWeight: "700" }}>Digits:</Text> Count and
              share of 0–9 characters.
            </Text>

            <Text style={{ opacity: 0.8, marginTop: 6 }}>
              • <Text style={{ fontWeight: "700" }}>Special characters:</Text>{" "}
              Count and share of symbols (e.g., ! ? # $).
            </Text>

            <Text style={{ opacity: 0.8, marginTop: 6 }}>
              • <Text style={{ fontWeight: "700" }}>Reuse:</Text> Exact matches
              found in other entries. Your value shows{" "}
              {Math.max(0, (computed?.reuseCount ?? 0) - 1)} other entries.
            </Text>
          </View>

          {/* Pattern + heuristics */}
          {computed?.pattern ? (
            <>
              <Text
                variant="labelSmall"
                style={{ opacity: 0.7, userSelect: "none", marginLeft: 6 }}
              >
                {t("analysisDetail:pattern")}
              </Text>
              <Pattern pattern={computed.pattern} />
            </>
          ) : null}

          {computed?.sequential && computed.sequential.length > 0 ? (
            <>
              <Text
                variant="labelSmall"
                style={{ opacity: 0.7, userSelect: "none", marginLeft: 6 }}
              >
                {t("analysisDetail:sequentialPatterns", {
                  defaultValue: "Sequential patterns",
                })}
              </Text>
              {computed.sequential.map((p, idx) => (
                <Pattern pattern={p} key={idx} />
              ))}
            </>
          ) : null}

          <Divider />

          {strength ? (
            <View
              style={{
                padding: 6,
                backgroundColor: getPasswordStrengthColor(strength as any),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                borderRadius: 10,
                gap: 6,
                boxShadow: theme.colors.shadow,
              }}
            >
              <Icon
                source={getPasswordStrengthIcon(strength as any)}
                size={18}
                color={"white"}
              />
              <Text style={{ color: "white", userSelect: "none" }}>
                {t(`analysis:${String(strength).toLowerCase()}`)}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </AnimatedContainer>
  );
};

export default AnalysisDetailScreen;
