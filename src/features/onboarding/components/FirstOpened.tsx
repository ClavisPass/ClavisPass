import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Localization from "expo-localization";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View, useColorScheme } from "react-native";
import { Button, Text } from "react-native-paper";

import { LoginStackParamList } from "../../../app/navigation/model/types";
import { useToken } from "../../../app/providers/CloudProvider";
import { useOnline } from "../../../app/providers/OnlineProvider";
import { useSetting } from "../../../app/providers/SettingsProvider";
import { useTheme } from "../../../app/providers/ThemeProvider";
import AppearanceSettingsSection from "../../settings/components/AppearanceSettingsSection";
import SettingsDivider from "../../settings/components/SettingsDivider";
import SettingsItem from "../../settings/components/SettingsItem";
import ClavisPassHubLoginButton from "../../sync/components/ClavisPassHubLoginButton";
import DropboxLoginButton from "../../sync/components/DropboxLoginButton";
import GoogleDriveLoginButton from "../../sync/components/GoogleDriveLoginButton";

type Props = {
  onFinish?: () => void;
  navigation: NativeStackNavigationProp<
    LoginStackParamList,
    "Login",
    undefined
  >;
};
type Step = 0 | 1;

const FirstOpened: React.FC<Props> = ({ onFinish, navigation }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isOnline } = useOnline();
  const systemColorScheme = useColorScheme();

  const { provider } = useToken();

  const { value: onboardingDone, setValue: setOnboardingDone } =
    useSetting("ONBOARDING_DONE");
  const { value: language, setValue: setLanguage } = useSetting("LANGUAGE");
  const { value: dateFormat, setValue: setDateFormat } =
    useSetting("DATE_FORMAT");
  const { value: timeFormat, setValue: setTimeFormat } =
    useSetting("TIME_FORMAT");

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

    appliedDefaultsRef.current = true;
  }, [
    step,
    onboardingDone,
    language,
    dateFormat,
    timeFormat,
    setLanguage,
    setDateFormat,
    setTimeFormat,
    systemColorScheme,
  ]);

  const renderStepIndicators = () => (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        justifyContent: "center",
        marginTop: 10,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 8,
          backgroundColor:
            step === 0 ? theme.colors.primary : theme.colors.outlineVariant,
        }}
      />
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 8,
          backgroundColor:
            step === 1 ? theme.colors.primary : theme.colors.outlineVariant,
        }}
      />
    </View>
  );

  const AppearanceStep = () => (
    <View style={{ width: "100%", gap: 8 }}>
      <View style={{ width: "100%" }}>
        <AppearanceSettingsSection dropdownMaxWidth={160} size="small" />
        <SettingsDivider />
      </View>
    </View>
  );

  const CloudStep = () => (
    <View style={{ width: "100%", gap: 8 }}>
      <View style={{ marginTop: 8, width: "100%" }}>
        <SettingsDivider />
        <View style={{ opacity: isOnline ? 1 : 0.5 }}>
          <DropboxLoginButton />
          <SettingsDivider />
          <GoogleDriveLoginButton />
          <SettingsDivider />
          <ClavisPassHubLoginButton />
          <SettingsDivider />
          <SettingsItem
            leadingIcon="qrcode-scan"
            onPress={() => navigation.navigate("Scan")}
          >
            {t("settings:scanqrcode")}
          </SettingsItem>
          <SettingsDivider />
        </View>

        {!isOnline && (
          <Text style={{ marginTop: 8, textAlign: "center" }}>
            {t("common:offline")}
          </Text>
        )}
      </View>
    </View>
  );

  const renderStep = (s: Step) => {
    if (s === 0) return <AppearanceStep />;
    return <CloudStep />;
  };

  const next = () => setStep(1);
  const back = () => setStep(0);

  const canGoBack = step === 1;
  const isLast = step === 1;

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
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: "100%" }}>{renderStep(step)}</View>
      </ScrollView>

      {renderStepIndicators()}

      <View style={{ width: "100%", gap: 8, marginTop: 12 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}>
            {canGoBack ? (
              <Button
                mode="outlined"
                style={{ borderRadius: 12 }}
                onPress={back}
              >
                {t("common:back")}
              </Button>
            ) : (
              <View />
            )}
          </View>

          <View style={{ flex: 1 }}>
            {isLast ? (
              <Button
                mode="contained"
                style={{ borderRadius: 12 }}
                onPress={finish}
              >
                {t("common:done")}
              </Button>
            ) : (
              <Button
                mode="outlined"
                style={{ borderRadius: 12 }}
                onPress={next}
              >
                {t("common:next")}
              </Button>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default FirstOpened;
