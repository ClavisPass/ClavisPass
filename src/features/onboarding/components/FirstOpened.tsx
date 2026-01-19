import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  View,
  useColorScheme,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import * as Localization from "expo-localization";

import SettingsDivider from "../../settings/components/SettingsDivider";
import DropboxLoginButton from "../../sync/components/DropboxLoginButton";
import GoogleDriveLoginButton from "../../sync/components/GoogleDriveLoginButton";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { useOnline } from "../../../app/providers/OnlineProvider";
import AppearanceSettingsSection from "../../settings/components/AppearanceSettingsSection";
import { useSetting } from "../../../app/providers/SettingsProvider";
import { useToken } from "../../../app/providers/CloudProvider";

type Props = { onFinish: () => void };
type Step = 0 | 1;
type Direction = "forward" | "back";

const DURATION = 180;

const FirstOpened: React.FC<Props> = ({ onFinish }) => {
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
  const [animating, setAnimating] = useState(false);
  const [stageWidth, setStageWidth] = useState(320);

  const currentX = useRef(new Animated.Value(0)).current;
  const incomingX = useRef(new Animated.Value(0)).current;

  const incomingStepRef = useRef<Step | null>(null);

  const useNativeDriver = Platform.OS !== "web";

  const finish = async () => {
    await setOnboardingDone(true);
    onFinish();
  };

  const finishingRef = useRef(false);
  useEffect(() => {
    if (finishingRef.current) return;
    if (onboardingDone) return;

    // erst wenn der Cloud-Step wirklich offen ist
    if (step !== 1) return;
    if (animating) return;

    // provider muss vorhanden sein und darf nicht "device" sein
    if (!provider) return;
    if (provider === "device") return;

    finishingRef.current = true;
    void finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, animating, provider, onboardingDone]);
  // --- end auto-finish

  const appliedDefaultsRef = useRef(false);
  useEffect(() => {
    if (appliedDefaultsRef.current) return;
    if (onboardingDone) return;
    if (step !== 0) return;

    const hasLanguage = language != null && String(language).length > 0;
    const hasDateFormat = dateFormat != null && String(dateFormat).length > 0;
    const hasTimeFormat = timeFormat != null && String(timeFormat).length > 0;

    if (hasLanguage && hasDateFormat && hasTimeFormat) {
      appliedDefaultsRef.current = true;
      return;
    }

    const firstLocale = Localization.getLocales()?.[0];
    const localeTag = (
      firstLocale?.languageTag ??
      firstLocale?.languageCode ??
      "en-US"
    ).toLowerCase();

    const inferredLanguage = localeTag.startsWith("de") ? "de" : "en";
    const inferredFormat = localeTag.startsWith("de") ? "de-DE" : "en-US";

    if (!hasLanguage) setLanguage(inferredLanguage as any);
    if (!hasDateFormat) setDateFormat(inferredFormat as any);
    if (!hasTimeFormat) setTimeFormat(inferredFormat as any);

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

  const startTransition = (dir: Direction, to: Step) => {
    if (animating) return;
    if (to === step) return;

    setAnimating(true);
    incomingStepRef.current = to;
    currentX.setValue(0);
    incomingX.setValue(dir === "forward" ? stageWidth : -stageWidth);

    Animated.parallel([
      Animated.timing(currentX, {
        toValue: dir === "forward" ? -stageWidth : stageWidth,
        duration: DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
      Animated.timing(incomingX, {
        toValue: 0,
        duration: DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
    ]).start(() => {
      setStep(to);
      incomingStepRef.current = null;
      currentX.setValue(0);
      incomingX.setValue(0);

      setAnimating(false);
    });
  };

  const next = () => startTransition("forward", 1);
  const back = () => startTransition("back", 0);

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
        style={{ width: "100%", flexGrow: 1 }}
        contentContainerStyle={{ justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{ width: "100%", position: "relative", overflow: "hidden" }}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            if (w && w > 0) setStageWidth(w);
          }}
        >
          <Animated.View
            style={{ transform: [{ translateX: currentX }], width: "100%" }}
          >
            {renderStep(step)}
          </Animated.View>

          {incomingStepRef.current !== null && (
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: [{ translateX: incomingX }],
              }}
              pointerEvents="none"
            >
              {renderStep(incomingStepRef.current)}
            </Animated.View>
          )}
        </View>
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
                disabled={animating}
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
                disabled={animating}
              >
                {t("common:done")}
              </Button>
            ) : (
              <Button
                mode="outlined"
                style={{ borderRadius: 12 }}
                onPress={next}
                disabled={animating}
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
