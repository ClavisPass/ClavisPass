import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Localization from "expo-localization";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { Button, Text } from "react-native-paper";

import { LoginStackParamList } from "../../../app/navigation/model/types";
import { useToken } from "../../../app/providers/CloudProvider";
import { useSetting } from "../../../app/providers/SettingsProvider";
import { useTheme } from "../../../app/providers/ThemeProvider";
import SettingsDivider from "../../settings/components/SettingsDivider";
import ClavisPassHubLoginButton from "../../sync/components/ClavisPassHubLoginButton";
import DropboxLoginButton from "../../sync/components/DropboxLoginButton";
import GoogleDriveLoginButton from "../../sync/components/GoogleDriveLoginButton";
import LocalFileLoginButton from "../../sync/components/LocalFileLoginButton";

type Props = {
  onFinish?: () => void;
  navigation: NativeStackNavigationProp<
    LoginStackParamList,
    "Login",
    undefined
  >;
};
type Step = 0 | 1;

const FirstOpened: React.FC<Props> = ({ onFinish }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const systemColorScheme = useColorScheme();

  const { provider } = useToken();

  const { value: onboardingDone, setValue: setOnboardingDone } =
    useSetting("ONBOARDING_DONE");
  const { setValue: setLanguage } = useSetting("LANGUAGE");
  const { setValue: setDateFormat } = useSetting("DATE_FORMAT");
  const { setValue: setTimeFormat } = useSetting("TIME_FORMAT");
  const { setValue: setThemePreference } = useSetting("THEME_PREFERENCE");

  const [step, setStep] = useState<Step>(0);

  const finish = async () => {
    await setOnboardingDone(true);
    onFinish?.();
  };

  const finishingRef = useRef(false);
  useEffect(() => {
    if (finishingRef.current) return;
    if (onboardingDone) return;

    if (step !== 1) return;
    if (!provider) return;
    if (provider === "device") return;

    finishingRef.current = true;
    finish();
  }, [step, provider, onboardingDone]);

  const appliedDefaultsRef = useRef(false);
  useEffect(() => {
    if (appliedDefaultsRef.current) return;
    if (onboardingDone) return;
    if (step !== 0) return;

    const firstLocale = Localization.getLocales()?.[0];
    const localeTag = (
      firstLocale?.languageTag ??
      firstLocale?.languageCode ??
      "en-US"
    ).toLowerCase();

    const inferredLanguage = localeTag.startsWith("de") ? "de" : "en";
    const inferredFormat = localeTag.startsWith("de") ? "de-DE" : "en-US";

    setLanguage(inferredLanguage as any);
    setDateFormat(inferredFormat as any);
    setTimeFormat(inferredFormat as any);
    setThemePreference(systemColorScheme === "dark" ? "dark" : "light");

    appliedDefaultsRef.current = true;
  }, [
    step,
    onboardingDone,
    setLanguage,
    setDateFormat,
    setTimeFormat,
    setThemePreference,
    systemColorScheme,
  ]);

  const ChoiceStep = () => (
    <View style={{ width: "100%", gap: 8 }}>
      <Button mode="contained" style={{ borderRadius: 12 }} onPress={finish}>
        {t("login:createNewVault")}
      </Button>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingVertical: 2,
        }}
      >
        <View
          style={{
            flex: 1,
            height: StyleSheet.hairlineWidth,
            backgroundColor: theme.colors.outlineVariant,
          }}
        />
        <Text
          variant="labelMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
            userSelect: "none",
          }}
        >
          {t("common:or")}
        </Text>
        <View
          style={{
            flex: 1,
            height: StyleSheet.hairlineWidth,
            backgroundColor: theme.colors.outlineVariant,
          }}
        />
      </View>
      <Button mode="outlined" style={{ borderRadius: 12 }} onPress={next}>
        {t("login:loadVault")}
      </Button>
    </View>
  );

  const ProviderStep = () => (
    <View style={{ width: "100%", gap: 8 }}>
      <View style={{ width: "100%" }}>
        <SettingsDivider />
        {Platform.OS === "web" ? (
          <>
            <LocalFileLoginButton />
            <SettingsDivider />
          </>
        ) : null}
        <DropboxLoginButton />
        <SettingsDivider />
        <GoogleDriveLoginButton />
        <SettingsDivider />
        <ClavisPassHubLoginButton />
        <SettingsDivider />
      </View>
    </View>
  );

  const renderStep = (s: Step) => {
    if (s === 0) return <ChoiceStep />;
    return <ProviderStep />;
  };

  const next = () => setStep(1);
  const back = () => setStep(0);

  return (
    <View style={{ width: "100%", gap: 14 }}>
      <Text
        variant="bodyMedium"
        style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}
      >
        {step === 0 ? t("login:introFirstRun") : t("login:cloudSaveSubtitle")}
      </Text>
      {renderStep(step)}
      {step === 1 ? (
        <Button mode="outlined" style={{ borderRadius: 12 }} onPress={back}>
          {t("common:back")}
        </Button>
      ) : null}
    </View>
  );
};

export default FirstOpened;
