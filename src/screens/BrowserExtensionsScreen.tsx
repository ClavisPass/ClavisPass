import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Chip, Divider, Icon, Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";

import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import Header from "../shared/components/Header";
import AnimatedPressable from "../shared/components/AnimatedPressable";
import HintCard from "../shared/components/HintCard";

import { useTheme } from "../app/providers/ThemeProvider";
import { SettingsStackParamList } from "../app/navigation/model/types";
import { useSetting } from "../app/providers/SettingsProvider";
import { formatAbsoluteLocal } from "../shared/utils/Timestamp";
import {
  buildBrowserClientKey,
  listBrowserExtensionPairings,
  actOnBrowserExtensionPairing,
  type PairedClient,
  type PendingPairing,
} from "../features/settings/utils/browserExtensionPairings";

const H_PAD = 8;

const styles = StyleSheet.create({
  chip: {
    borderRadius: 12,
    overflow: "hidden",
  },
});

type BrowserExtensionsScreenProps = NativeStackScreenProps<
  SettingsStackParamList,
  "BrowserExtensions"
>;

const BrowserExtensionsScreen: React.FC<BrowserExtensionsScreenProps> = ({
  navigation,
}) => {
  const {
    theme,
    globalStyles,
    headerWhite,
    darkmode,
    setHeaderWhite,
    setHeaderSpacing,
  } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { value: dateFormat } = useSetting("DATE_FORMAT");
  const { value: timeFormat } = useSetting("TIME_FORMAT");

  const stacked = width < 600;

  const [pending, setPending] = useState<PendingPairing[]>([]);
  const [paired, setPaired] = useState<PairedClient[]>([]);
  const [actingKey, setActingKey] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadPairings = useCallback(async () => {
    const result = await listBrowserExtensionPairings();
    setPending(result.pending);
    setPaired(result.paired);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(40);
      setHeaderWhite(false);
      void loadPairings();
    }, [loadPairings, setHeaderSpacing, setHeaderWhite]),
  );

  const act = useCallback(
    async (
      action:
        | "bridge_approve_pairing"
        | "bridge_reject_pairing"
        | "bridge_revoke_pairing",
      item: { extensionId: string; clientInstanceId?: string | null },
    ) => {
      const actionKey = buildBrowserClientKey(
        item.extensionId,
        item.clientInstanceId,
      );
      setActingKey(actionKey);
      try {
        await actOnBrowserExtensionPairing(action, item);
        await loadPairings();
      } finally {
        setActingKey(null);
      }
    },
    [loadPairings],
  );

  const containerCardStyle = {
    borderRadius: 12,
    overflow: "hidden" as const,
    backgroundColor: theme.colors.background,
    boxShadow: theme.colors.shadow as any,
    borderColor: darkmode ? theme.colors.outlineVariant : "white",
    borderWidth: StyleSheet.hairlineWidth,
  };

  const sectionHeader = (label: string, count: number) => (
    <View
      style={{
        marginTop: 8,
        marginBottom: 8,
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
      }}
    >
      <Text style={{ fontWeight: "800", userSelect: "none" }}>{label}</Text>
      <Chip compact style={styles.chip}>
        {count}
      </Chip>
    </View>
  );

  const totalCount = pending.length + paired.length;

  const renderBrowserItem = (
    item: PendingPairing | PairedClient,
    index: number,
    status: "pending" | "paired",
  ) => {
    const itemKey = buildBrowserClientKey(
      item.extensionId,
      item.clientInstanceId,
    );
    const isExpanded = expandedId === itemKey;
    const isActing = actingKey === itemKey;
    const title =
      item.clientName?.trim() ||
      t("settings:browserUnknownClient", {
        extensionId: item.extensionId,
      });
    const subtitle = [item.clientVersion, item.clientInstanceId]
      .filter(Boolean)
      .join(" - ");
    const lastSeenAt = item.lastSeenAtMs
      ? formatAbsoluteLocal(
          new Date(item.lastSeenAtMs).toISOString(),
          dateFormat,
          timeFormat,
        )
      : "-";

    const detailLabel =
      status === "pending"
        ? t("settings:browserRequestedAt", {
            value: formatAbsoluteLocal(
              new Date((item as PendingPairing).requestedAtMs).toISOString(),
              dateFormat,
              timeFormat,
            ),
          })
        : t("settings:browserApprovedAt", {
            value: formatAbsoluteLocal(
              new Date((item as PairedClient).grantedAtMs).toISOString(),
              dateFormat,
              timeFormat,
            ),
          });

    return (
      <Animated.View
        key={itemKey}
        entering={FadeInDown.delay(index * 35).duration(180)}
        style={[containerCardStyle, { width: "100%", marginBottom: 6 }]}
      >
        <AnimatedPressable
          onPress={() =>
            setExpandedId((prev) => (prev === itemKey ? null : itemKey))
          }
          style={{ paddingVertical: 0 }}
        >
          <View>
            <View
              style={{
                minHeight: 56,
                paddingHorizontal: 8,
                paddingVertical: 8,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Icon source="web" size={20} color={theme.colors.onSurface} />

              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={{ userSelect: "none" }}>
                  {title}
                </Text>
                {subtitle ? (
                  <Text
                    numberOfLines={1}
                    style={{ opacity: 0.75, userSelect: "none" }}
                  >
                    {subtitle}
                  </Text>
                ) : null}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                  justifyContent: "flex-end",
                }}
              >
                <Chip compact style={styles.chip}>
                  {status === "pending"
                    ? t("settings:browserPendingBadge")
                    : t("settings:browserPairedBadge")}
                </Chip>

                {!stacked ? (
                  <Chip compact style={styles.chip}>
                    {lastSeenAt}
                  </Chip>
                ) : null}

                <Icon
                  source={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                />
              </View>
            </View>

            {stacked ? (
              <>
                <Divider />
                <View style={{ paddingHorizontal: 8, paddingVertical: 8 }}>
                  <Text style={{ opacity: 0.75, userSelect: "none" }}>
                    {t("settings:browserLastSeenAt", { value: lastSeenAt })}
                  </Text>
                </View>
              </>
            ) : null}

            {isExpanded ? (
              <>
                <Divider />
                <View
                  style={{ paddingHorizontal: 8, paddingVertical: 8, gap: 8 }}
                >
                  <Text style={{ opacity: 0.85, userSelect: "none" }}>
                    {detailLabel}
                  </Text>

                  <Text style={{ opacity: 0.75, userSelect: "none" }}>
                    {t("settings:browserLastSeenAt", { value: lastSeenAt })}
                  </Text>

                  <Text
                    style={{ opacity: 0.6, userSelect: "none" }}
                    numberOfLines={1}
                  >
                    {t("devices:id", { defaultValue: "ID" })}:{" "}
                    {item.clientInstanceId || item.extensionId}
                  </Text>

                  <View
                    style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}
                  >
                    {status === "pending" ? (
                      <>
                        <ActionButton
                          label={t("settings:browserApprove")}
                          icon="check"
                          variant="primary"
                          disabled={isActing}
                          onPress={() =>
                            void act("bridge_approve_pairing", item)
                          }
                        />
                        <ActionButton
                          label={t("settings:browserReject")}
                          icon="close"
                          variant="danger"
                          disabled={isActing}
                          onPress={() =>
                            void act("bridge_reject_pairing", item)
                          }
                        />
                      </>
                    ) : (
                      <ActionButton
                        label={t("settings:browserDisconnect")}
                        icon="link-off"
                        variant="muted"
                        disabled={isActing}
                        onPress={() => void act("bridge_revoke_pairing", item)}
                      />
                    )}
                  </View>
                </View>
              </>
            ) : null}
          </View>
        </AnimatedPressable>
      </Animated.View>
    );
  };

  const title = t("settings:browserExtensions");
  const emptyText = t("settings:browserPairedEmpty");

  return (
    <AnimatedContainer style={globalStyles.container}>
      <StatusBar
        animated
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent
      />
      <Header title={title} onPress={() => navigation.goBack()} />

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          paddingHorizontal: H_PAD,
          paddingBottom: 20,
        }}
      >
        <HintCard hintLine={t("settings:browserPairingDescription")} />

        {totalCount === 0 ? (
          <View style={{ marginTop: 8 }}>
            <Text style={{ opacity: 0.8 }}>{emptyText}</Text>
          </View>
        ) : (
          <View style={{ marginTop: 0 }}>
            {sectionHeader(
              t("settings:browserPendingRequests"),
              pending.length,
            )}
            {pending.length === 0 ? (
              <View style={{ marginBottom: 6 }}>
                <Text style={{ opacity: 0.75 }}>
                  {t("settings:browserPendingEmpty")}
                </Text>
              </View>
            ) : (
              pending.map((item, index) =>
                renderBrowserItem(item, index, "pending"),
              )
            )}

            {sectionHeader(t("settings:browserPairedClients"), paired.length)}
            {paired.length === 0 ? (
              <View style={{ marginBottom: 6 }}>
                <Text style={{ opacity: 0.75 }}>
                  {t("settings:browserPairedEmpty")}
                </Text>
              </View>
            ) : (
              paired.map((item, index) =>
                renderBrowserItem(item, index + pending.length, "paired"),
              )
            )}
          </View>
        )}
      </ScrollView>
    </AnimatedContainer>
  );
};

function ActionButton(props: {
  label: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  variant: "primary" | "danger" | "muted";
}) {
  const { theme } = useTheme();
  const backgroundColor =
    props.variant === "primary"
      ? theme.colors.primary
      : props.variant === "danger"
        ? theme.colors.error
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

export default BrowserExtensionsScreen;
