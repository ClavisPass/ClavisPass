import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Portal, Text } from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import Modal from "../../../../shared/components/modals/Modal";
import { toIsoUtcFromLocal } from "../../../../shared/utils/Timestamp";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";

type Props = {
  visible: boolean;
  setVisible: (v: boolean) => void;
  initialIso?: string | null;
  onConfirm: (isoUtc: string) => void;
};

export default function ExpiryPickerModal({
  visible,
  setVisible,
  initialIso,
  onConfirm,
}: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const initialDate = useMemo(
    () => (initialIso ? new Date(initialIso) : new Date()),
    [initialIso],
  );
  const [selectedAt, setSelectedAt] = useState<Date>(initialDate);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setSelectedAt(initialDate);
  }, [initialDate, visible]);

  const date = selectedAt;
  const time = {
    hours: selectedAt.getHours(),
    minutes: selectedAt.getMinutes(),
  };

  function updateSelectedAt(mutator: (base: Date) => void) {
    setSelectedAt((current) => {
      const next = new Date(current);
      mutator(next);
      return next;
    });
  }

  function resetToNow() {
    setSelectedAt(new Date());
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={() => setVisible(false)}>
        <View
          style={{
            padding: 14,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: 310,
            cursor: "auto",
            gap: 6,
            width: 280,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.outlineVariant,
          }}
        >
          <Text variant="headlineSmall" style={{ userSelect: "none" }}>
            {t("common:setExpiry")}
          </Text>
          <View style={{ gap: 12 }}>
            <Button
              style={{ borderRadius: 12 }}
              mode="outlined"
              onPress={() => setShowDate(true)}
            >
              {date ? "Date: " + date.toLocaleDateString() : "Date"}
            </Button>
            <View
              style={{
                flexDirection: "row",
                gap: 6,
                justifyContent: "center",
              }}
            >
              <Button
                style={{ borderRadius: 12 }}
                compact
                onPress={resetToNow}
              >
                {t("common:current")}
              </Button>
              <Button
                style={{ borderRadius: 12 }}
                compact
                onPress={() =>
                  updateSelectedAt((next) => {
                    next.setDate(next.getDate() + 1);
                  })
                }
              >
                +1 T
              </Button>
              <Button
                style={{ borderRadius: 12 }}
                compact
                onPress={() =>
                  updateSelectedAt((next) => {
                    next.setDate(next.getDate() + 7);
                  })
                }
              >
                +7 T
              </Button>
              <Button
                style={{ borderRadius: 12 }}
                compact
                onPress={() =>
                  updateSelectedAt((next) => {
                    next.setDate(next.getDate() + 30);
                  })
                }
              >
                +30 T
              </Button>
            </View>
            <Button
              style={{ borderRadius: 12 }}
              mode="outlined"
              onPress={() => setShowTime(true)}
            >
              {`Time: ${time.hours.toString().padStart(2, "0")}:${time.minutes.toString().padStart(2, "0")}`}
            </Button>
            <View
              style={{
                flexDirection: "row",
                gap: 6,
                justifyContent: "center",
              }}
            >
              <Button
                style={{ borderRadius: 12 }}
                compact
                onPress={resetToNow}
              >
                {t("common:current")}
              </Button>
              <Button
                style={{ borderRadius: 12 }}
                compact
                onPress={() => {
                  updateSelectedAt((next) => {
                    next.setMinutes(next.getMinutes() + 30);
                  });
                }}
              >
                +30 m
              </Button>
              <Button
                style={{ borderRadius: 12 }}
                compact
                onPress={() => {
                  updateSelectedAt((next) => {
                    next.setHours(next.getHours() + 1);
                  });
                }}
              >
                +1 h
              </Button>
              <Button
                style={{ borderRadius: 12 }}
                compact
                onPress={() => {
                  updateSelectedAt((next) => {
                    next.setHours(next.getHours() + 12);
                  });
                }}
              >
                +12 h
              </Button>
            </View>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 6,
              alignSelf: "flex-end",
            }}
          >
            <Button
              style={{ borderRadius: 12 }}
              mode="contained-tonal"
              onPress={() => setVisible(false)}
            >
              {t("common:cancel")}
            </Button>
            <Button
              style={{ borderRadius: 12 }}
              mode="contained"
              onPress={() => {
                const iso = toIsoUtcFromLocal(date, time.hours, time.minutes);
                onConfirm(iso);
                setVisible(false);
              }}
            >
              {t("common:save")}
            </Button>
          </View>

          <DatePickerModal
            locale="de"
            mode="single"
            visible={showDate}
            date={date}
            onDismiss={() => setShowDate(false)}
            onConfirm={({ date }) => {
              setShowDate(false);
              if (date) {
                setSelectedAt((current) => {
                  const next = new Date(current);
                  next.setFullYear(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                  );
                  return next;
                });
              }
            }}
          />
          <TimePickerModal
            visible={showTime}
            onDismiss={() => setShowTime(false)}
            onConfirm={({ hours, minutes }) => {
              setShowTime(false);
              setSelectedAt((current) => {
                const next = new Date(current);
                next.setHours(hours, minutes, 0, 0);
                return next;
              });
            }}
            hours={time.hours}
            minutes={time.minutes}
            locale="de"
            label="Time"
          />
        </View>
      </Modal>
    </Portal>
  );
}
