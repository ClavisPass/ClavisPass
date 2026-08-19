import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ActivityIndicator, Icon, Text } from "react-native-paper";
import FocusAwareStatusBar from "../shared/components/FocusAwareStatusBar";
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
  actOnBrowserExtensionPairing,
  buildBrowserClientKey,
  listBrowserExtensionPairings,
  type PairedClient,
  type PendingPairing,
} from "../features/settings/utils/browserExtensionPairings";

const H_PAD = 8;

type BrowserExtensionsScreenProps = NativeStackScreenProps<
  SettingsStackParamList,
  "BrowserExtensions"
>;

type BrowserPairingAction =
  | "bridge_approve_pairing"
  | "bridge_reject_pairing"
  | "bridge_revoke_pairing";

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
  const { value: dateFormat } = useSetting("DATE_FORMAT");
  const { value: timeFormat } = useSetting("TIME_FORMAT");

  const [pending, setPending] = useState<PendingPairing[]>([]);
  const [paired, setPaired] = useState<PairedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actingKey, setActingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPairings = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await listBrowserExtensionPairings();
      setPending(result.pending);
      setPaired(result.paired);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : t("settings:browserLoadFailed"),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(40);
      setHeaderWhite(false);
      void loadPairings();
    }, [loadPairings, setHeaderSpacing, setHeaderWhite]),
  );

  const act = useCallback(
    async (
      action: BrowserPairingAction,
      item: { extensionId: string; clientInstanceId?: string | null },
    ) => {
      const actionKey = buildBrowserClientKey(
        item.extensionId,
        item.clientInstanceId,
      );
      setActingKey(actionKey);
      setError(null);
      try {
        await actOnBrowserExtensionPairing(action, item);
        await loadPairings();
      } catch (actionError) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : t("settings:browserActionFailed"),
        );
      } finally {
        setActingKey(null);
      }
    },
    [loadPairings, t],
  );

  const pairedCount = paired.length;
  const pendingCount = pending.length;
  const state =
    pendingCount > 0 ? "attention" : pairedCount > 0 ? "ready" : "empty";
  const statusTitle =
    state === "attention"
      ? t("settings:browserStatusPendingTitle")
      : state === "ready"
        ? t("settings:browserStatusReadyTitle")
        : t("settings:browserStatusEmptyTitle");
  const statusDescription =
    state === "attention"
      ? t("settings:browserStatusPendingDescription")
      : state === "ready"
        ? t("settings:browserStatusReadyDescription")
        : t("settings:browserStatusEmptyDescription");

  return (
    <AnimatedContainer style={globalStyles.container}>
      <FocusAwareStatusBar
        animated
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent
      />
      <Header
        title={t("settings:browserExtensions")}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          paddingHorizontal: H_PAD,
          paddingBottom: 20,
          gap: 8,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={theme.colors.primary}
            onRefresh={() => void loadPairings(true)}
          />
        }
      >
        <HintCard hintLine={t("settings:browserPairingDescription")} />

        <StatusPanel
          state={state}
          title={statusTitle}
          description={statusDescription}
          pendingCount={pendingCount}
          pairedCount={pairedCount}
          loading={loading}
          onRefresh={() => void loadPairings(true)}
        />

        {error ? (
          <View
            style={[
              styles.notice,
              {
                backgroundColor: theme.colors.errorContainer,
                borderColor: theme.colors.error,
              },
            ]}
          >
            <Icon source="alert-circle-outline" size={18} color={theme.colors.error} />
            <Text style={{ flex: 1, color: theme.colors.onErrorContainer }}>
              {error}
            </Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size={18} />
            <Text style={{ opacity: 0.75 }}>{t("settings:browserLoading")}</Text>
          </View>
        ) : (
          <>
            <SectionTitle
              title={t("settings:browserPendingRequests")}
              count={pendingCount}
            />
            {pendingCount === 0 ? (
              <EmptyState
                icon="check-circle-outline"
                title={t("settings:browserPendingEmptyTitle")}
                description={t("settings:browserPendingEmpty")}
              />
            ) : (
              pending.map((item, index) => (
                <BrowserClientCard
                  key={buildBrowserClientKey(
                    item.extensionId,
                    item.clientInstanceId,
                  )}
                  item={item}
                  index={index}
                  status="pending"
                  acting={actingKey === buildBrowserClientKey(
                    item.extensionId,
                    item.clientInstanceId,
                  )}
                  dateFormat={dateFormat}
                  timeFormat={timeFormat}
                  onApprove={() => void act("bridge_approve_pairing", item)}
                  onReject={() => void act("bridge_reject_pairing", item)}
                />
              ))
            )}

            <SectionTitle
              title={t("settings:browserPairedClients")}
              count={pairedCount}
            />
            {pairedCount === 0 ? (
              <EmptyState
                icon="web-off"
                title={t("settings:browserPairedEmptyTitle")}
                description={t("settings:browserPairedEmpty")}
              />
            ) : (
              paired.map((item, index) => (
                <BrowserClientCard
                  key={buildBrowserClientKey(
                    item.extensionId,
                    item.clientInstanceId,
                  )}
                  item={item}
                  index={index + pendingCount}
                  status="paired"
                  acting={actingKey === buildBrowserClientKey(
                    item.extensionId,
                    item.clientInstanceId,
                  )}
                  dateFormat={dateFormat}
                  timeFormat={timeFormat}
                  onDisconnect={() => void act("bridge_revoke_pairing", item)}
                />
              ))
            )}
          </>
        )}
      </ScrollView>
    </AnimatedContainer>
  );
};

function StatusPanel(props: {
  state: "ready" | "attention" | "empty";
  title: string;
  description: string;
  pendingCount: number;
  pairedCount: number;
  loading: boolean;
  onRefresh: () => void;
}) {
  const { theme, darkmode } = useTheme();
  const { t } = useTranslation();
  const color =
    props.state === "attention"
      ? theme.colors.tertiary
      : props.state === "ready"
        ? theme.colors.primary
        : theme.colors.onSurfaceVariant;
  const icon =
    props.state === "attention"
      ? "shield-alert-outline"
      : props.state === "ready"
        ? "shield-check-outline"
        : "shield-link-variant-outline";

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: theme.colors.background,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
          boxShadow: theme.colors.shadow as any,
        },
      ]}
    >
      <View style={styles.statusHeader}>
        <View style={[styles.iconBubble, { backgroundColor: `${color}20` }]}>
          <Icon source={icon} size={24} color={color} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.panelTitle}>{props.title}</Text>
          <Text style={{ opacity: 0.75 }}>{props.description}</Text>
        </View>
        <AnimatedPressable
          disabled={props.loading}
          onPress={props.onRefresh}
          style={[
            styles.iconButton,
            {
              backgroundColor: theme.colors.elevation.level2,
              opacity: props.loading ? 0.6 : 1,
            },
          ]}
        >
          <Icon source="refresh" size={18} color={theme.colors.primary} />
        </AnimatedPressable>
      </View>

      <View style={styles.metricsRow}>
        <Metric
          label={t("settings:browserPendingBadge")}
          value={props.pendingCount}
        />
        <Metric
          label={t("settings:browserPairedBadge")}
          value={props.pairedCount}
        />
      </View>
    </View>
  );
}

function Metric(props: { label: string; value: number }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.metric,
        { backgroundColor: theme.colors.elevation.level2 },
      ]}
    >
      <Text variant="headlineSmall" style={{ fontWeight: "800" }}>
        {props.value}
      </Text>
      <Text variant="labelSmall" style={{ opacity: 0.72 }}>
        {props.label}
      </Text>
    </View>
  );
}

function SectionTitle(props: { title: string; count: number }) {
  const { theme } = useTheme();

  return (
    <View style={styles.sectionTitle}>
      <Text style={{ fontWeight: "800", userSelect: "none" }}>
        {props.title}
      </Text>
      <View
        style={[
          styles.countPill,
          { backgroundColor: theme.colors.elevation.level2 },
        ]}
      >
        <Text variant="labelSmall" style={{ fontWeight: "800" }}>
          {props.count}
        </Text>
      </View>
    </View>
  );
}

function EmptyState(props: {
  icon: string;
  title: string;
  description: string;
}) {
  const { theme, darkmode } = useTheme();

  return (
    <View
      style={[
        styles.emptyState,
        {
          backgroundColor: theme.colors.background,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
        },
      ]}
    >
      <Icon source={props.icon} size={20} color={theme.colors.onSurfaceVariant} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontWeight: "700" }}>{props.title}</Text>
        <Text style={{ opacity: 0.7 }}>{props.description}</Text>
      </View>
    </View>
  );
}

function BrowserClientCard(props: {
  item: PendingPairing | PairedClient;
  index: number;
  status: "pending" | "paired";
  acting: boolean;
  dateFormat: string;
  timeFormat: string;
  onApprove?: () => void;
  onReject?: () => void;
  onDisconnect?: () => void;
}) {
  const { theme, darkmode } = useTheme();
  const { t } = useTranslation();
  const title =
    props.item.clientName?.trim() ||
    t("settings:browserUnknownClient", {
      extensionId: props.item.extensionId,
    });
  const subtitle =
    props.item.clientVersion?.trim() || t("settings:browserUnknownVersion");
  const lastSeenAt = props.item.lastSeenAtMs
    ? formatAbsoluteLocal(
        new Date(props.item.lastSeenAtMs).toISOString(),
        props.dateFormat,
        props.timeFormat,
      )
    : "-";
  const eventAt =
    props.status === "pending"
      ? (props.item as PendingPairing).requestedAtMs
      : (props.item as PairedClient).grantedAtMs;
  const eventLabel =
    props.status === "pending"
      ? t("settings:browserRequestedAt", {
          value: formatAbsoluteLocal(
            new Date(eventAt).toISOString(),
            props.dateFormat,
            props.timeFormat,
          ),
        })
      : t("settings:browserApprovedAt", {
          value: formatAbsoluteLocal(
            new Date(eventAt).toISOString(),
            props.dateFormat,
            props.timeFormat,
          ),
        });

  return (
    <Animated.View
      entering={FadeInDown.delay(props.index * 25).duration(180)}
      style={[
        styles.clientCard,
        {
          backgroundColor: theme.colors.background,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
          boxShadow: theme.colors.shadow as any,
        },
      ]}
    >
      <View style={styles.clientTopRow}>
        <View
          style={[
            styles.iconBubble,
            { backgroundColor: theme.colors.elevation.level2 },
          ]}
        >
          <Icon
            source={props.status === "pending" ? "web-clock" : "web-check"}
            size={22}
            color={theme.colors.primary}
          />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={styles.clientTitle}>
            {title}
          </Text>
          <Text numberOfLines={1} style={{ opacity: 0.7 }}>
            {subtitle}
          </Text>
        </View>
        <StatusPill status={props.status} />
      </View>

      <View style={styles.clientMeta}>
        <Text numberOfLines={1} style={{ opacity: 0.72 }}>
          {eventLabel}
        </Text>
        <Text numberOfLines={1} style={{ opacity: 0.72 }}>
          {t("settings:browserLastSeenAt", { value: lastSeenAt })}
        </Text>
      </View>

      <Text numberOfLines={1} variant="labelSmall" style={{ opacity: 0.55 }}>
        {props.item.clientInstanceId || props.item.extensionId}
      </Text>

      <View style={styles.actions}>
        {props.status === "pending" ? (
          <>
            <ActionButton
              label={t("settings:browserApprove")}
              icon="check"
              variant="primary"
              disabled={props.acting}
              onPress={props.onApprove}
            />
            <ActionButton
              label={t("settings:browserReject")}
              icon="close"
              variant="danger"
              disabled={props.acting}
              onPress={props.onReject}
            />
          </>
        ) : (
          <ActionButton
            label={t("settings:browserDisconnect")}
            icon="link-off"
            variant="muted"
            disabled={props.acting}
            onPress={props.onDisconnect}
          />
        )}
      </View>
    </Animated.View>
  );
}

function StatusPill(props: { status: "pending" | "paired" }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const color =
    props.status === "pending" ? theme.colors.tertiary : theme.colors.primary;

  return (
    <View style={[styles.statusPill, { backgroundColor: `${color}20` }]}>
      <Text variant="labelSmall" style={{ color, fontWeight: "800" }}>
        {props.status === "pending"
          ? t("settings:browserPendingBadge")
          : t("settings:browserPairedBadge")}
      </Text>
    </View>
  );
}

function ActionButton(props: {
  label: string;
  icon: string;
  onPress?: () => void;
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
      style={[
        styles.actionButton,
        {
          backgroundColor: props.disabled
            ? theme.colors.surfaceDisabled
            : backgroundColor,
          opacity: props.disabled ? 0.7 : 1,
        },
      ]}
    >
      <Icon source={props.icon} size={15} color={textColor} />
      <Text variant="bodySmall" style={{ color: textColor, fontWeight: "700" }}>
        {props.label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
    overflow: "hidden",
    padding: 12,
  },
  statusHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  panelTitle: {
    fontWeight: "800",
    userSelect: "none",
  },
  iconBubble: {
    alignItems: "center",
    borderRadius: 10,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 10,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
  },
  metric: {
    borderRadius: 10,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  notice: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 8,
    padding: 10,
  },
  loadingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 18,
  },
  sectionTitle: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  countPill: {
    alignItems: "center",
    borderRadius: 999,
    minWidth: 24,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  emptyState: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 10,
    padding: 12,
  },
  clientCard: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
    overflow: "hidden",
    padding: 12,
  },
  clientTopRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  clientTitle: {
    fontWeight: "800",
    userSelect: "none",
  },
  clientMeta: {
    gap: 2,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionButton: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    gap: 5,
    minHeight: 34,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});

export default BrowserExtensionsScreen;
