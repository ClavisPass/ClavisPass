import React, { useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../shared/components/Header";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import { useTheme } from "../app/providers/ThemeProvider";
import { Divider, Icon, Text, TextInput } from "react-native-paper";
import ModulesEnum from "../features/vault/model/ModulesEnum";
import ModuleIconsEnum from "../features/vault/model/ModuleIconsEnum";
import { ScrollView, View } from "react-native";
import AnalysisEntry from "../features/analysis/components/AnalysisEntry";
import AnalysisEntryGradient from "../features/analysis/components/AnalysisEntryGradient";
import Pattern from "../features/analysis/components/Pattern";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import getPasswordStrengthColor from "../features/analysis/utils/getPasswordStrengthColor";
import getPasswordStrengthIcon from "../features/analysis/utils/getPasswordStrengthIcon";
import { RootStackParamList } from "../app/navigation/stacks/Stack";
import { useTranslation } from "react-i18next";

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

type PasswordAnalysis = {
  pattern: string;
  repeatedSequences: string[];
  sequentialPatterns: string[];
} | null;

const AnalysisDetailScreen: React.FC<AnalysisDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { value: routeValue } = route.params!;
  const {
    globalStyles,
    theme,
    headerWhite,
    setHeaderWhite,
    darkmode,
    setHeaderSpacing,
  } = useTheme();
  const { t } = useTranslation();

  const [characterAnalysis, setCharacterAnalysis] =
    useState<CharacterAnalysis>(null);

  const [passwordAnalysis, setPasswordAnalysis] =
    useState<PasswordAnalysis>(null);

  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const [eyeIcon, setEyeIcon] = useState("eye");

  const [edit, setEdit] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(40);
      setHeaderWhite(false);
    }, [])
  );

  const goBack = () => {
    navigation.goBack();
  };

  function analyzeCharacterComposition(input: string): CharacterAnalysis {
    // Initialisieren der Zähler
    let letters = 0;
    let digits = 0;
    let specialCharacters = 0;

    // Durch den String iterieren
    for (const char of input) {
      if (/[a-zA-Z]/.test(char)) {
        letters++;
      } else if (/[0-9]/.test(char)) {
        digits++;
      } else {
        specialCharacters++;
      }
    }

    // Gesamtlänge für die Berechnung der Anteile
    const total = input.length || 1; // Vermeidung einer Division durch 0

    return {
      letters: letters,
      lettersPercent: (letters / total) * 100,
      digits: digits,
      digitsPercent: (digits / total) * 100,
      specialCharacters: specialCharacters,
      specialCharactersPercent: (specialCharacters / total) * 100,
    };
  }

  function analyzePassword(password: string): PasswordAnalysis {
    // Initialisiere Variablen
    let pattern = "";
    const repeatedSequences: string[] = [];
    const sequentialPatterns: string[] = [];

    // Regex für die Klassifikation
    const regexMap: { [key: string]: RegExp } = {
      a: /[a-z]/,
      A: /[A-Z]/,
      1: /[0-9]/,
      "!": /[^a-zA-Z0-9]/,
    };

    // Erzeuge das Pattern
    for (const char of password) {
      for (const [key, regex] of Object.entries(regexMap)) {
        if (regex.test(char)) {
          pattern += key;
          break;
        }
      }
    }

    // Finde wiederholte Sequenzen (z. B. "aaa", "111")
    const repeatedMatch = pattern.match(/(.)\1{2,}/g); // Mindestens 3 gleiche Zeichen
    if (repeatedMatch) {
      repeatedSequences.push(...repeatedMatch);
    }

    // Finde sequentielle Muster (z. B. "123", "abc")
    for (let i = 0; i < password.length - 2; i++) {
      const currentChar = password[i];
      const nextChar = password[i + 1];
      const nextNextChar = password[i + 2];

      // Prüfe auf numerische oder alphabetische Sequenzen
      if (
        (/\d/.test(currentChar) &&
          +nextChar === +currentChar + 1 &&
          +nextNextChar === +currentChar + 2) || // Numerische Sequenz
        (/[a-zA-Z]/.test(currentChar) &&
          nextChar.charCodeAt(0) === currentChar.charCodeAt(0) + 1 &&
          nextNextChar.charCodeAt(0) === currentChar.charCodeAt(0) + 2) // Alphabetische Sequenz
      ) {
        sequentialPatterns.push(password.slice(i, i + 3));
      }
    }

    return {
      pattern,
      repeatedSequences,
      sequentialPatterns,
    };
  }

  const getTypeIcon = () => {
    if (routeValue.type === ModulesEnum.PASSWORD) {
      return ModuleIconsEnum.PASSWORD;
    }
    if (routeValue.type === ModulesEnum.WIFI) {
      return ModuleIconsEnum.WIFI;
    }
    return "";
  };

  useEffect(() => {
    setCharacterAnalysis(analyzeCharacterComposition(routeValue.password));
    setPasswordAnalysis(analyzePassword(routeValue.password));
  }, [routeValue]);

  useEffect(() => {
    if (secureTextEntry) {
      setEyeIcon("eye");
    } else {
      setEyeIcon("eye-off");
    }
  }, [secureTextEntry]);

  return (
    <AnimatedContainer style={globalStyles.container}>
      <StatusBar
        animated={true}
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent={true}
      />
      <Header
        onPress={goBack}
        //leftNode={<Text>{routeValue.title}</Text>}
        title={routeValue.title}
      ></Header>
      <ScrollView
        style={{
          width: "100%",
          display: "flex",
          gap: 6,
          padding: 6,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <Text
            variant="labelSmall"
            style={{
              opacity: 0.7,
              userSelect: "none",
              marginLeft: 6,
            }}
            accessibilityRole="header"
          >
            {t("analysisDetail:yourPassword")}
          </Text>
          <View
            style={{
              height: 40,
              margin: 0,
              marginBottom: 0,
              marginTop: 0,
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
              gap: 6,
              alignItems: "center",
            }}
          >
            <Icon
              source={getTypeIcon()}
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
              value={routeValue.password}
              mode="outlined"
              secureTextEntry={secureTextEntry}
              readOnly={true}
              right={
                <TextInput.Icon
                  animated
                  icon={eyeIcon}
                  color={theme.colors.primary}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
            />
          </View>
          <Text
            variant="labelSmall"
            style={{
              opacity: 0.7,
              userSelect: "none",
              marginLeft: 6,
            }}
            accessibilityRole="header"
          >
            {t("analysisDetail:statistics")}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              height: 80,
              gap: 6,
            }}
          >
            <AnalysisEntryGradient
              name={t("analysisDetail:entropy")}
              number={routeValue.entropy}
              percentage={(routeValue.entropy / 200) * 100}
              fixed={true}
            />
            <AnalysisEntry
              name={t("analysisDetail:letters")}
              number={
                characterAnalysis?.letters ? characterAnalysis?.letters : 0
              }
              percentage={
                characterAnalysis?.lettersPercent
                  ? characterAnalysis?.lettersPercent
                  : 0
              }
              fixed={true}
            />
          </View>
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              height: 80,
              gap: 6,
            }}
          >
            <AnalysisEntry
              name={t("analysisDetail:digits")}
              number={characterAnalysis?.digits ? characterAnalysis?.digits : 0}
              percentage={
                characterAnalysis?.digitsPercent
                  ? characterAnalysis?.digitsPercent
                  : 0
              }
              fixed={true}
            />
            <AnalysisEntry
              name={t("analysisDetail:characters")}
              number={
                characterAnalysis?.specialCharacters
                  ? characterAnalysis?.specialCharacters
                  : 0
              }
              percentage={
                characterAnalysis?.specialCharactersPercent
                  ? characterAnalysis?.specialCharactersPercent
                  : 0
              }
              fixed={true}
            />
          </View>
          {passwordAnalysis?.pattern &&
            passwordAnalysis?.pattern.length !== 0 && (
              <>
                <Text
                  variant="labelSmall"
                  style={{
                    opacity: 0.7,
                    userSelect: "none",
                    marginLeft: 6,
                  }}
                  accessibilityRole="header"
                >
                  {t("analysisDetail:pattern")}
                </Text>
                <Pattern pattern={passwordAnalysis?.pattern} />
              </>
            )}

          {passwordAnalysis?.repeatedSequences &&
            passwordAnalysis?.repeatedSequences.length !== 0 && (
              <>
                <Text
                  variant="labelSmall"
                  style={{
                    opacity: 0.7,
                    userSelect: "none",
                    marginLeft: 6,
                  }}
                  accessibilityRole="header"
                >
                  {t("analysisDetail:repeatedSequences")}
                </Text>
                {passwordAnalysis?.repeatedSequences.map((sequence, index) => {
                  return <Pattern pattern={sequence} key={index} />;
                })}
              </>
            )}
          {passwordAnalysis?.sequentialPatterns &&
            passwordAnalysis?.sequentialPatterns.length !== 0 && (
              <>
                <Text
                  variant="titleSmall"
                  style={{ marginLeft: 6, userSelect: "none" }}
                >
                  Sequencial Patterns
                </Text>
                {passwordAnalysis?.sequentialPatterns.map((pattern, index) => {
                  return <Pattern pattern={pattern} key={index} />;
                })}
              </>
            )}
          <Divider />
          <View
            style={{
              padding: 6,
              backgroundColor: getPasswordStrengthColor(
                routeValue.passwordStrengthLevel
              ),
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
              source={getPasswordStrengthIcon(routeValue.passwordStrengthLevel)}
              size={18}
              color={"white"}
            />
            <Text style={{ color: "white", userSelect: "none" }}>
              {t(`analysis:${routeValue.passwordStrengthLevel.toLowerCase()}`)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </AnimatedContainer>
  );
};

export default AnalysisDetailScreen;
