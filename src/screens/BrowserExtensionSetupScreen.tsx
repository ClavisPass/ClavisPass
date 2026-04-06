import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { Chip, Icon, Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import * as Linking from "expo-linking";

import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import Header from "../shared/components/Header";
import AnimatedPressable from "../shared/components/AnimatedPressable";
import HintCard from "../shared/components/HintCard";

import { useTheme } from "../app/providers/ThemeProvider";
import { SettingsStackParamList } from "../app/navigation/model/types";
import { listBrowserExtensionPairings } from "../features/settings/utils/browserExtensionPairings";
import { detectTauriEnvironment } from "../infrastructure/platform/isTauri";

const H_PAD = 8;

const styles = StyleSheet.create({
  chip: {
    borderRadius: 12,
    overflow: "hidden",
  },
});

type BrowserExtensionSetupScreenProps = NativeStackScreenProps<
  SettingsStackParamList,
  "BrowserExtensionSetup"
>;

type BrowserAssistantTarget = "firefox" | "edge" | "chrome";

const BrowserExtensionSetupScreen: React.FC<
  BrowserExtensionSetupScreenProps
> = ({ navigation }) => {
  const {
    theme,
    globalStyles,
    headerWhite,
    darkmode,
    setHeaderWhite,
    setHeaderSpacing,
  } = useTheme();
  const { t } = useTranslation();

  const [assistantTarget, setAssistantTarget] =
    useState<BrowserAssistantTarget>("firefox");
  const [pendingCount, setPendingCount] = useState(0);
  const [pairedCount, setPairedCount] = useState(0);

  const loadPairings = useCallback(async () => {
    const result = await listBrowserExtensionPairings();
    setPendingCount(result.pending.length);
    setPairedCount(result.paired.length);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(40);
      setHeaderWhite(false);
      void loadPairings();
    }, [loadPairings, setHeaderSpacing, setHeaderWhite]),
  );

  const pairingSummary =
    pairedCount > 0
      ? t("settings:browserAssistantStepPairingReady")
      : pendingCount > 0
        ? t("settings:browserAssistantStepPairingPending")
        : t("settings:browserAssistantStepPairingWaiting");

  const browserAssistantConfig = useMemo(() => {
    if (assistantTarget === "edge") {
      return {
        installDescription: t("settings:browserAssistantStepInstallEdge"),
        browserPageUrl: "microsoft-edge://extensions/",
      };
    }

    if (assistantTarget === "chrome") {
      return {
        installDescription: t("settings:browserAssistantStepInstallChrome"),
        browserPageUrl: "googlechrome://extensions/",
      };
    }

    return {
      installDescription: t("settings:browserAssistantStepInstallFirefox"),
      browserPageUrl: "about:debugging#/runtime/this-firefox",
    };
  }, [assistantTarget, t]);

  const openExternalTarget = useCallback(async (value: string) => {
    if (await detectTauriEnvironment()) {
      const { open } = await import("@tauri-apps/plugin-shell");
      await open(value);
      return;
    }

    await Linking.openURL(value);
  }, []);

  const containerCardStyle = {
    borderRadius: 12,
    overflow: "hidden" as const,
    backgroundColor: theme.colors.background,
    boxShadow: theme.colors.shadow as any,
    borderColor: darkmode ? theme.colors.outlineVariant : "white",
    borderWidth: StyleSheet.hairlineWidth,
  };

  return (
    <AnimatedContainer style={globalStyles.container}>
      <StatusBar
        animated
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent
      />
      <Header
        title={t("settings:browserAssistantTitle")}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          paddingHorizontal: H_PAD,
          paddingBottom: 20,
        }}
      >
        <HintCard hintLine={t("settings:browserAssistantDescription")} />

        <View
          style={[
            containerCardStyle,
            {
              padding: 12,
              marginTop: 8,
              gap: 12,
            },
          ]}
        >
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {(
              [
                ["firefox", t("settings:browserAssistantFirefox")],
                ["edge", t("settings:browserAssistantEdge")],
                ["chrome", t("settings:browserAssistantChrome")],
              ] as const
            ).map(([value, label]) => (
              <Chip
                key={value}
                compact
                selected={assistantTarget === value}
                onPress={() => setAssistantTarget(value)}
                style={styles.chip}
              >
                {label}
              </Chip>
            ))}
          </View>

          <View style={{ gap: 10 }}>
            <AssistantStep
              title={t("settings:browserAssistantStepInstallTitle")}
              description={browserAssistantConfig.installDescription}
            >
              <ActionButton
                label={t("settings:browserAssistantOpenBrowserPage")}
                icon="open-in-new"
                variant="primary"
                onPress={() =>
                  void openExternalTarget(browserAssistantConfig.browserPageUrl)
                }
              />
            </AssistantStep>

            <AssistantStep
              title={t("settings:browserAssistantStepBridgeTitle")}
              description={t("settings:browserAssistantStepBridgeDescription")}
            >
              <ActionButton
                label={t("settings:browserAssistantOpenGuide")}
                icon="book-open-variant"
                variant="muted"
                onPress={() =>
                  void openExternalTarget(
                    "https://github.com/ClavisPass/ClavisPass/blob/main/docs/browser-extension/native-messaging.md",
                  )
                }
              />
            </AssistantStep>

            <AssistantStep
              title={t("settings:browserAssistantStepPairingTitle")}
              description={pairingSummary}
            >
              <ActionButton
                label={t("settings:browserAssistantReloadStatus")}
                icon="refresh"
                variant="muted"
                onPress={() => void loadPairings()}
              />
              <ActionButton
                label={t("settings:browserAssistantOpenApprovals")}
                icon="link-variant"
                variant="muted"
                onPress={() => navigation.navigate("BrowserExtensions")}
              />
            </AssistantStep>
          </View>
        </View>
      </ScrollView>
    </AnimatedContainer>
  );
};

function ActionButton(props: {
  label: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  variant: "primary" | "muted";
}) {
  const { theme } = useTheme();
  const backgroundColor =
    props.variant === "primary"
      ? theme.colors.primary
      : theme.colors.elevation.level3;
  const textColor = props.variant === "muted" ? theme.colors.primary : "white";

  return (
    <AnimatedPressable
      disabled={props.disabled}
      onPress={props.onPress}
      style={{
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: props.disabled
          ? theme.colors.surfaceDisabled
          : backgroundColor,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        opacity: props.disabled ? 0.7 : 1,
      }}
    >
      <Icon source={props.icon} size={14} color={textColor} />
      <Text variant="bodySmall" style={{ color: textColor }}>
        {props.label}
      </Text>
    </AnimatedPressable>
  );
}

function AssistantStep(props: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        borderRadius: 12,
        padding: 10,
        gap: 8,
        backgroundColor: theme.colors.elevation.level2,
      }}
    >
      <View style={{ gap: 4 }}>
        <Text style={{ fontWeight: "700" }}>{props.title}</Text>
        <Text style={{ opacity: 0.8 }}>{props.description}</Text>
      </View>
      {props.children ? (
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          {props.children}
        </View>
      ) : null}
    </View>
  );
}

export default BrowserExtensionSetupScreen;
