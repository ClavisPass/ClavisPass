import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, View } from "react-native";
import { ActivityIndicator, Chip, Icon, Text } from "react-native-paper";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";

import { useTheme } from "../../../app/providers/ThemeProvider";
import { useSetting } from "../../../app/providers/SettingsProvider";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";
import SettingsDivider from "./SettingsDivider";
import { formatAbsoluteDate, formatAbsoluteTime } from "../../../shared/utils/Timestamp";

type PendingPairing = {
  extensionId: string;
  clientName?: string | null;
  clientVersion?: string | null;
  clientInstanceId?: string | null;
  requestedAtMs: number;
  lastSeenAtMs: number;
};

type PairedClient = {
  extensionId: string;
  clientName?: string | null;
  clientVersion?: string | null;
  clientInstanceId?: string | null;
  grantedAtMs: number;
  lastSeenAtMs: number;
  capabilities?: string[];
};

function BrowserExtensionPairingSection() {
  const { t } = useTranslation();
  const { theme, darkmode } = useTheme();
  const { value: dateFormat } = useSetting("DATE_FORMAT");
  const { value: timeFormat } = useSetting("TIME_FORMAT");

  const [pending, setPending] = useState<PendingPairing[]>([]);
  const [paired, setPaired] = useState<PairedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingKey, setActingKey] = useState<string | null>(null);

  const localeDate = dateFormat || "en-US";
  const localeTime = timeFormat || "en-US";

  const loadPairings = useCallback(async () => {
    if (Platform.OS !== "web") return;

    try {
      setLoading(true);
      const [nextPending, nextPaired] = await Promise.all([
        invoke<PendingPairing[]>("bridge_list_pending_pairings"),
        invoke<PairedClient[]>("bridge_list_paired_clients"),
      ]);

      setPending(nextPending ?? []);
      setPaired(nextPaired ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    void loadPairings();
  }, [loadPairings]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "web") return;
      void loadPairings();
    }, [loadPairings])
  );

  const act = useCallback(
    async (
      action: "bridge_approve_pairing" | "bridge_reject_pairing" | "bridge_revoke_pairing",
      item: { extensionId: string; clientInstanceId?: string | null }
    ) => {
      const actionKey = buildItemKey(item.extensionId, item.clientInstanceId);
      setActingKey(actionKey);
      try {
        await invoke(action, {
          extensionId: item.extensionId,
          clientInstanceId: item.clientInstanceId ?? null,
        });
        await loadPairings();
      } finally {
        setActingKey(null);
      }
    },
    [loadPairings]
  );

  const pendingEmpty = useMemo(() => pending.length === 0, [pending]);
  const pairedEmpty = useMemo(() => paired.length === 0, [paired]);

  if (Platform.OS !== "web") return null;

  return (
    <View style={{ gap: 0 }}>
      <View
        style={{
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <Text variant="bodyMedium">{t("settings:browserExtensions")}</Text>
        <Chip compact icon="reload" onPress={() => void loadPairings()}>
          {t("common:reload")}
        </Chip>
      </View>

      <SettingsDivider />

      <SectionLabel title={t("settings:browserPendingRequests")} count={pending.length} />

      {loading ? (
        <LoadingRow />
      ) : pendingEmpty ? (
        <EmptyRow text={t("settings:browserPendingEmpty")} />
      ) : (
        pending.map((item, index) => {
          const itemKey = buildItemKey(item.extensionId, item.clientInstanceId);
          const isActing = actingKey === itemKey;

          return (
            <React.Fragment key={itemKey}>
              <PeerRow
                title={getClientTitle(item.clientName, item.extensionId, t)}
                subtitle={getClientSubtitle(item.clientVersion, item.clientInstanceId)}
                meta={t("settings:browserLastSeenAt", {
                  value: formatMillis(item.lastSeenAtMs, localeDate, localeTime),
                })}
                rightBadge={t("settings:browserPendingBadge")}
              >
                <ActionRow>
                  <ActionButton
                    text={t("settings:browserApprove")}
                    icon="check"
                    color={theme.colors.primary}
                    disabled={isActing}
                    onPress={() => void act("bridge_approve_pairing", item)}
                  />
                  <ActionButton
                    text={t("settings:browserReject")}
                    icon="close"
                    color={theme.colors.error}
                    disabled={isActing}
                    onPress={() => void act("bridge_reject_pairing", item)}
                  />
                </ActionRow>
              </PeerRow>
              {index < pending.length - 1 && <SettingsDivider />}
            </React.Fragment>
          );
        })
      )}

      <SettingsDivider />

      <SectionLabel title={t("settings:browserPairedClients")} count={paired.length} />

      {loading ? (
        <LoadingRow />
      ) : pairedEmpty ? (
        <EmptyRow text={t("settings:browserPairedEmpty")} />
      ) : (
        paired.map((item, index) => {
          const itemKey = buildItemKey(item.extensionId, item.clientInstanceId);
          const isActing = actingKey === itemKey;

          return (
            <React.Fragment key={itemKey}>
              <PeerRow
                title={getClientTitle(item.clientName, item.extensionId, t)}
                subtitle={getClientSubtitle(item.clientVersion, item.clientInstanceId)}
                meta={t("settings:browserLastSeenAt", {
                  value: formatMillis(item.lastSeenAtMs, localeDate, localeTime),
                })}
                rightBadge={t("settings:browserPairedBadge")}
                rightBadgeColor={theme.colors.success}
              >
                <ActionRow>
                  <ActionButton
                    text={t("settings:browserDisconnect")}
                    icon="link-off"
                    color={darkmode ? theme.colors.surfaceVariant : theme.colors.elevation.level3}
                    textColor={theme.colors.primary}
                    disabled={isActing}
                    onPress={() => void act("bridge_revoke_pairing", item)}
                  />
                </ActionRow>
              </PeerRow>
              {index < paired.length - 1 && <SettingsDivider />}
            </React.Fragment>
          );
        })
      )}
    </View>
  );
}

function SectionLabel(props: { title: string; count: number }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <Text variant="titleSmall">{props.title}</Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {props.count}
      </Text>
    </View>
  );
}

function PeerRow(props: {
  title: string;
  subtitle?: string;
  meta: string;
  rightBadge: string;
  rightBadgeColor?: string;
  children?: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 8, gap: 6 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Icon source="web" size={16} color={theme.colors.primary} />
            <Text variant="bodyMedium">{props.title}</Text>
          </View>
          {!!props.subtitle && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {props.subtitle}
            </Text>
          )}
        </View>
        <Chip
          compact
          style={{
            backgroundColor: props.rightBadgeColor ?? theme.colors.secondaryContainer,
          }}
          textStyle={{
            color: props.rightBadgeColor
              ? theme.colors.onPrimary
              : theme.colors.onSecondaryContainer,
          }}
        >
          {props.rightBadge}
        </Chip>
      </View>

      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {props.meta}
      </Text>

      {props.children}
    </View>
  );
}

function LoadingRow() {
  return (
    <View style={{ padding: 14, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}

function EmptyRow(props: { text: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {props.text}
      </Text>
    </View>
  );
}

function ActionRow(props: { children: React.ReactNode }) {
  return <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>{props.children}</View>;
}

function ActionButton(props: {
  text: string;
  icon: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
  textColor?: string;
}) {
  const { theme } = useTheme();
  return (
    <AnimatedPressable
      disabled={props.disabled}
      onPress={props.onPress}
      style={{
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: props.disabled ? theme.colors.surfaceDisabled : props.color,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        opacity: props.disabled ? 0.7 : 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Icon source={props.icon} size={14} color={props.textColor ?? "white"} />
        <Text variant="bodySmall" style={{ color: props.textColor ?? "white" }}>
          {props.text}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

function formatMillis(value: number, localeDate: string, localeTime: string) {
  const iso = new Date(value).toISOString();
  return `${formatAbsoluteDate(iso, localeDate)} ${formatAbsoluteTime(iso, localeTime)}`;
}

function buildItemKey(extensionId: string, instanceId?: string | null) {
  return `${extensionId}::${instanceId ?? "default"}`;
}

function getClientTitle(
  clientName: string | null | undefined,
  extensionId: string,
  t: (key: string, options?: Record<string, unknown>) => string
) {
  return clientName?.trim() || t("settings:browserUnknownClient", { extensionId });
}

function getClientSubtitle(clientVersion?: string | null, clientInstanceId?: string | null) {
  const parts = [clientVersion, clientInstanceId].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export default BrowserExtensionPairingSection;
