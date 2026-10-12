import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Localization from "expo-localization";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
  useWindowDimensions,
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
import Logo from "../../../shared/ui/Logo";

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
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 600;

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

  const brandingContent = (
    <View
      style={{
        width: "100%",
        maxWidth: isWideLayout ? 320 : 360,
        gap: 10,
        alignItems: "center",
      }}
    >
      <Logo width={isWideLayout ? 76 : 44} height={isWideLayout ? 76 : 44} />
      <Text
        style={{
          width: "100%",
          textAlign: "center",
          fontFamily: "LexendExa_400Regular",
          fontSize: isWideLayout ? 18 : 15,
          lineHeight: isWideLayout ? 24 : 21,
          includeFontPadding: false,
          paddingHorizontal: 6,
        }}
      >
        ClavisPass
      </Text>
      <Text
        style={{
          opacity: 0.72,
          textAlign: "center",
          color: theme.colors.onSurfaceVariant,
        }}
      >
        {step === 0
          ? t("login:introFirstRun")
          : t("login:cloudSaveSubtitle")}
      </Text>
    </View>
  );

  const stageContent = (
    <View style={{ width: "100%", maxWidth: 380 }}>{renderStep(step)}</View>
  );

  if (isWideLayout) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          paddingHorizontal: 24,
          paddingVertical: 24,
          gap: 24,
        }}
      >
        <View
          style={{
            flex: 0.95,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "stretch",
          }}
        >
          {brandingContent}
        </View>

        <View
          style={{
            width: StyleSheet.hairlineWidth,
            alignSelf: "stretch",
            backgroundColor: theme.colors.outlineVariant,
            opacity: 0.85,
          }}
        />

        <View
          style={{
            flex: 1.55,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "stretch",
            paddingLeft: 18,
            paddingRight: 18,
          }}
        >
          {stageContent}
          {step === 1 ? (
            <View style={{ width: "100%", maxWidth: 380, marginTop: 8 }}>
              <Button
                mode="outlined"
                style={{ borderRadius: 12 }}
                onPress={back}
              >
                {t("common:back")}
              </Button>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <ScrollView
        style={{ width: "100%", flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 6,
          paddingVertical: 20,
          gap: 14,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {brandingContent}
        {stageContent}
      </ScrollView>

      {step === 1 ? (
        <View style={{ width: "100%", maxWidth: 380, marginTop: 8 }}>
          <Button mode="outlined" style={{ borderRadius: 12 }} onPress={back}>
            {t("common:back")}
          </Button>
        </View>
      ) : null}
    </View>
  );
};

export default FirstOpened;
