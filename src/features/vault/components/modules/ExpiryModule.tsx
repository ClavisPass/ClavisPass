import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, ProgressBar, Text } from "react-native-paper";

import { useSetting } from "../../../../app/providers/SettingsProvider";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { formatAbsoluteLocal } from "../../../../shared/utils/Timestamp";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import Props from "../../model/ModuleProps";
import ModulesEnum from "../../model/ModulesEnum";
import ExpiryModuleType from "../../model/modules/ExpiryModuleType";
import { getRelativeInfo, getStatus } from "../../utils/expiry";
import ModuleContainer from "../ModuleContainer";
import ExpiryPickerModal from "../modals/ExpiryPickerModal";

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  topRow: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  topLeft: {
    minWidth: 0,
    gap: 2,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
  },
  statusChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  metaRow: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    gap: 8,
  },
  progress: {
    height: 8,
    borderRadius: 999,
  },
  emptyWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyButton: {
    borderRadius: 12,
    minWidth: 170,
    transform: [{ translateX: -14 }],
  },
});

function ExpiryModule(props: ExpiryModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme, darkmode } = useTheme();
  const { t } = useTranslation();

  const warnBeforeMs = props.warnBeforeMs ?? 24 * 60 * 60 * 1000;

  const [value, setValue] = useState<string>(props.value ?? "");
  const [tick, setTick] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);

  const { value: dateFormat } = useSetting("DATE_FORMAT");
  const { value: timeFormat } = useSetting("TIME_FORMAT");

  useEffect(() => {
    if (didMount.current) {
      const newModule: ExpiryModuleType = {
        id: props.id,
        module: props.module,
        value,
        warnBeforeMs,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [value]);

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const statusInfo = useMemo(
    () => getStatus(value, Date.now(), warnBeforeMs),
    [value, tick, warnBeforeMs],
  );

  const statusColor =
    statusInfo.status === "expired"
      ? theme.colors.error
      : statusInfo.status === "dueSoon"
        ? "#D9A400"
        : theme.colors.primary;

  const progress =
    statusInfo.status === "active" || statusInfo.status === "dueSoon"
      ? 1 - Math.min(1, Math.max(0, statusInfo.remainingMs / warnBeforeMs))
      : 1;
  const emphasisStatusChip = darkmode && statusInfo.status === "expired";
  const statusChipBackground = emphasisStatusChip
    ? statusColor
    : darkmode
      ? `${statusColor}22`
      : `${statusColor}18`;
  const statusChipTextColor = emphasisStatusChip ? "#ffffff" : statusColor;

  const formatRelativeLabel = (remainingMs: number) => {
    const relative = getRelativeInfo(remainingMs);
    const unit =
      relative.kind === "future" || relative.kind === "past"
        ? relative.unit === "day"
          ? t("common:expiryDayShort")
          : relative.unit === "hour"
            ? t("common:expiryHourShort")
            : t("common:expiryMinuteShort")
        : "";

    if (relative.kind === "future") {
      return t("common:expiryIn", { value: relative.value, unit });
    }
    if (relative.kind === "past") {
      return t("common:expiryAgo", { value: relative.value, unit });
    }
    if (relative.kind === "now") return t("common:expiryNow");
    return t("common:expiryJustExpired");
  };

  const statusLabel =
    statusInfo.status === "expired"
      ? t("common:expiryExpired")
      : statusInfo.status === "dueSoon"
        ? t("common:expiryDueSoon")
        : t("common:expiryActive");

  const statusText =
    statusInfo.status === "expired"
      ? `${t("common:expiryExpiredPrefix")} ${formatRelativeLabel(
          statusInfo.remainingMs,
        )}`
      : `${t("common:expiryExpires")} ${formatRelativeLabel(
          statusInfo.remainingMs,
        )}`;

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:expiry")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.EXPIRY]}
      fastAccess={props.fastAccess}
    >
      {value ? (
        <View style={[globalStyles.moduleView]}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.background,
                borderColor: darkmode ? theme.colors.outlineVariant : "white",
              },
            ]}
          >
            <View style={styles.topRow}>
              <View style={styles.topLeft}>
                <Text
                  variant="labelMedium"
                  style={{ color: statusColor, fontWeight: "700" }}
                >
                  {statusLabel}
                </Text>
                <View style={styles.dateRow}>
                  <Text
                    variant="titleLarge"
                    style={{ color: theme.colors.primary, fontWeight: "700" }}
                  >
                    {formatAbsoluteLocal(value, dateFormat, timeFormat)}
                  </Text>
                  <IconButton
                    style={{ margin: 0 }}
                    iconColor={theme.colors.primary}
                    icon="pencil"
                    size={18}
                    onPress={() => setPickerVisible(true)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View
                style={[
                  styles.statusChip,
                  { backgroundColor: statusChipBackground },
                ]}
              >
                <Text style={{ color: statusChipTextColor, fontWeight: "700" }}>
                  {statusText}
                </Text>
              </View>

              <ProgressBar
                progress={progress}
                color={statusColor}
                style={[
                  styles.progress,
                  {
                    backgroundColor: darkmode
                      ? "rgba(255,255,255,0.10)"
                      : "rgba(0,0,0,0.06)",
                  },
                ]}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={[globalStyles.moduleView, styles.emptyWrap]}>
          <Button
            style={styles.emptyButton}
            mode="contained-tonal"
            onPress={() => setPickerVisible(true)}
            icon="calendar"
            textColor={theme.colors.primary}
          >
            {t("common:setExpiry")}
          </Button>
        </View>
      )}

      <ExpiryPickerModal
        visible={pickerVisible}
        setVisible={setPickerVisible}
        initialIso={value ?? undefined}
        onConfirm={(iso) => setValue(iso)}
      />
    </ModuleContainer>
  );
}

export default ExpiryModule;
