import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Chip, Divider, Text, Icon } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import Header from "../shared/components/Header";
import AnimatedPressable from "../shared/components/AnimatedPressable";

import { useTheme } from "../app/providers/ThemeProvider";
import { SettingsStackParamList } from "../app/navigation/model/types";
import { useVault } from "../app/providers/VaultProvider";
import { useSetting } from "../app/providers/SettingsProvider";
import { formatAbsoluteLocal, getDateTime } from "../shared/utils/Timestamp";

import type VaultDeviceType from "../features/vault/model/VaultDeviceType";
import {
  DEFAULT_DEVICE_UI_POLICY,
  deriveDeviceUiStatus,
  sortByLastSeenDesc,
  type DeviceUiStatus,
} from "../features/vault/utils/vaultDevices";

import { getOrCreateDeviceId } from "../infrastructure/device/deviceId";
import HintCard from "../shared/components/HintCard";

const GAP = 8;
const ITEM_MIN_HEIGHT = 56;
const H_PAD = 8;

const styles = StyleSheet.create({
  chip: {
    borderRadius: 12,
    overflow: "hidden",
  },
});

type DevicesScreenProps = NativeStackScreenProps<
  SettingsStackParamList,
  "Devices"
>;

// Robust icon names for react-native-paper default icon set
function deviceTypeIcon(platform: string): string {
  const p = (platform ?? "").toLowerCase();

  if (p.includes("ios") || p.includes("android")) return "cellphone";
  if (p.includes("win") || p.includes("mac") || p.includes("linux"))
    return "monitor";
  if (p.includes("web")) return "monitor";
  return "devices";
}

const DevicesScreen: React.FC<DevicesScreenProps> = ({ navigation }) => {
  const {
    theme,
    globalStyles,
    headerWhite,
    darkmode,
    setHeaderWhite,
    setHeaderSpacing,
  } = useTheme();

  const { t } = useTranslation();

  const vault = useVault();
  const { width } = useWindowDimensions();

  const { value: dateFormat } = useSetting("DATE_FORMAT");
  const { value: timeFormat } = useSetting("TIME_FORMAT");

  const stacked = width < 600;

  const [showArchived, setShowArchived] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Freeze "now" for this screen session so grouping doesn't jitter
  const nowIso = useMemo(() => getDateTime(), []);
  const policy = DEFAULT_DEVICE_UI_POLICY;

  // Determine "self" device id once
  const [selfId, setSelfId] = useState<string | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = await getOrCreateDeviceId();
        if (!cancelled) setSelfId(id);
      } catch {
        if (!cancelled) setSelfId(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(40);
      setHeaderWhite(false);
    }, [setHeaderSpacing, setHeaderWhite])
  );

  const labelForStatus = React.useCallback(
    (s: DeviceUiStatus) => {
      if (s === "new") return t("devices:status.new", { defaultValue: "New" });
      if (s === "archived")
        return t("devices:status.archived", { defaultValue: "Archived" });
      return t("devices:status.active", { defaultValue: "Active" });
    },
    [t]
  );

  const { newDevices, activeDevices, archivedDevices, any } = useMemo(() => {
    const list = vault.devices ?? [];

    // classify with policy, but force "self" into active
    const classified = list.map((d) => {
      const raw = deriveDeviceUiStatus(d, nowIso, policy);
      const forced: DeviceUiStatus = selfId && d.id === selfId ? "active" : raw;
      return { d, status: forced };
    });

    const nd = classified.filter((x) => x.status === "new").map((x) => x.d);
    const ad = classified.filter((x) => x.status === "active").map((x) => x.d);
    const hd = classified
      .filter((x) => x.status === "archived")
      .map((x) => x.d);

    return {
      any: list.length > 0,
      newDevices: sortByLastSeenDesc(nd),
      activeDevices: sortByLastSeenDesc(ad),
      archivedDevices: sortByLastSeenDesc(hd),
    };
  }, [vault.devices, nowIso, selfId]);

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

  // Keep "self => active" rule consistent for chips, too
  const statusFor = (d: VaultDeviceType): DeviceUiStatus => {
    const raw = deriveDeviceUiStatus(d, nowIso, policy) as DeviceUiStatus;
    return selfId && d.id === selfId ? "active" : raw;
  };

  const renderDeviceItem = (
    item: VaultDeviceType,
    index: number,
    status: DeviceUiStatus
  ) => {
    const last = item.lastSeenAt ?? item.firstSeenAt;
    const first = item.firstSeenAt;
    const isExpanded = expandedId === item.id;

    const isSelf = !!selfId && item.id === selfId;

    return (
      <Animated.View
        key={item.id}
        entering={FadeInDown.delay(index * 35).duration(180)}
        style={[containerCardStyle, { width: "100%", marginBottom: 6 }]}
      >
        <AnimatedPressable
          onPress={() =>
            setExpandedId((prev) => (prev === item.id ? null : item.id))
          }
          style={{ paddingVertical: 0 }}
        >
          <View>
            <View
              style={{
                minHeight: ITEM_MIN_HEIGHT,
                paddingHorizontal: 8,
                paddingVertical: 8,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Icon
                source={deviceTypeIcon(item.platform)}
                size={20}
                color={theme.colors.onSurface}
              />

              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={{ userSelect: "none" }}>
                  {item.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ opacity: 0.75, userSelect: "none" }}
                >
                  {item.platform}
                </Text>
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
                {isSelf ? (
                  <Chip compact style={styles.chip}>
                    {t("devices:you", { defaultValue: "You" })}
                  </Chip>
                ) : null}

                <Chip compact style={styles.chip}>
                  {labelForStatus(status)}
                </Chip>

                {!stacked ? (
                  <Chip compact style={styles.chip}>
                    {last
                      ? formatAbsoluteLocal(last, dateFormat, timeFormat)
                      : "—"}
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
                    {t("devices:lastShort", { defaultValue: "Last" })}:{" "}
                    {last
                      ? formatAbsoluteLocal(last, dateFormat, timeFormat)
                      : "—"}
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
                    {t("devices:lastWrite", { defaultValue: "Last write" })}:{" "}
                    {last
                      ? formatAbsoluteLocal(last, dateFormat, timeFormat)
                      : "—"}
                  </Text>

                  <Text style={{ opacity: 0.75, userSelect: "none" }}>
                    {t("devices:firstWrite", { defaultValue: "First write" })}:{" "}
                    {first
                      ? formatAbsoluteLocal(first, dateFormat, timeFormat)
                      : "—"}
                  </Text>

                  <Text
                    style={{ opacity: 0.6, userSelect: "none" }}
                    numberOfLines={1}
                  >
                    {t("devices:id", { defaultValue: "ID" })}: {item.id}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </AnimatedPressable>
      </Animated.View>
    );
  };

  const newItems = useMemo(
    () => newDevices.map((d) => ({ d, s: statusFor(d) })),
    [newDevices, nowIso, selfId]
  );

  const activeItems = useMemo(
    () => activeDevices.map((d) => ({ d, s: statusFor(d) })),
    [activeDevices, nowIso, selfId]
  );

  const archivedItems = useMemo(
    () => archivedDevices.map((d) => ({ d, s: statusFor(d) })),
    [archivedDevices, nowIso, selfId]
  );

  const title = t("devices:title", { defaultValue: "Devices" });

  const newLabel = t("devices:sections.new", { defaultValue: "New" });
  const activeLabel = t("devices:sections.active", { defaultValue: "Active" });
  const archivedLabel = t("devices:sections.archived", {
    defaultValue: "Archived",
  });

  const toggleOn = t("devices:toggleArchivedOn", {
    defaultValue: "Show archived: On",
  });
  const toggleOff = t("devices:toggleArchivedOff", {
    defaultValue: "Show archived: Off",
  });

  const emptyText = t("devices:empty", {
    defaultValue:
      "No devices registered yet. Devices appear after the first save/sync.",
  });

  const emptyNew = t("devices:emptyNew", { defaultValue: "No new devices." });
  const emptyActive = t("devices:emptyActive", {
    defaultValue: "No active devices.",
  });
  const emptyArchived = t("devices:emptyArchived", {
    defaultValue: "No archived devices.",
  });

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
        <HintCard hintLine={t("devices:hintLine")} />
        {!any ? (
          <View style={{ marginTop: 0 }}>
            <Text style={{ opacity: 0.8 }}>{emptyText}</Text>
          </View>
        ) : (
          <View style={{ marginTop: 0 }}>
            {sectionHeader(newLabel, newDevices.length)}
            {newDevices.length === 0 ? (
              <View style={{ marginBottom: 6 }}>
                <Text style={{ opacity: 0.75 }}>{emptyNew}</Text>
              </View>
            ) : (
              newItems.map((x, i) => renderDeviceItem(x.d, i, x.s))
            )}

            {sectionHeader(activeLabel, activeDevices.length)}
            {activeDevices.length === 0 ? (
              <View style={{ marginBottom: 6 }}>
                <Text style={{ opacity: 0.75 }}>{emptyActive}</Text>
              </View>
            ) : (
              activeItems.map((x, i) =>
                renderDeviceItem(x.d, i + newDevices.length, x.s)
              )
            )}
            <View
              style={{
                marginTop: 8,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Chip
                icon={() => null}
                selected={showArchived}
                compact
                onPress={() => setShowArchived((v) => !v)}
              >
                {showArchived ? toggleOn : toggleOff}
              </Chip>
            </View>
            {showArchived ? (
              <>
                {sectionHeader(archivedLabel, archivedDevices.length)}
                {archivedDevices.length === 0 ? (
                  <View style={{ marginBottom: 6 }}>
                    <Text style={{ opacity: 0.75 }}>{emptyArchived}</Text>
                  </View>
                ) : (
                  archivedItems.map((x, i) =>
                    renderDeviceItem(
                      x.d,
                      i + newDevices.length + activeDevices.length,
                      x.s
                    )
                  )
                )}
              </>
            ) : null}
          </View>
        )}
      </ScrollView>
    </AnimatedContainer>
  );
};

export default DevicesScreen;
