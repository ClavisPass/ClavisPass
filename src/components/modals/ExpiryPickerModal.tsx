import React, { useState } from "react";
import { View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { toIsoUtcFromLocal } from "../../utils/expiry";

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
  const init = initialIso ? new Date(initialIso) : new Date();
  const [date, setDate] = useState<Date | undefined>(init);
  const [time, setTime] = useState<{ hours: number; minutes: number }>({
    hours: init.getHours(),
    minutes: init.getMinutes(),
  });
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  return (
    <Portal>
      <Dialog
        style={{ borderRadius: 12, width: 400, alignSelf: "center" }}
        visible={visible}
        onDismiss={() => setVisible(false)}
      >
        <Dialog.Title>Set Expiry</Dialog.Title>
        <Dialog.Content>
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
                onPress={() => setDate(new Date(Date.now()))}
              >
                Current
              </Button>
              <Button
                style={{ borderRadius: 12 }}
                compact
                onPress={() => setDate(new Date(Date.now() + 24 * 3600 * 1000))}
              >
                +1 T
              </Button>
              <Button
                style={{ borderRadius: 12 }}
                compact
                onPress={() =>
                  setDate(new Date(Date.now() + 7 * 24 * 3600 * 1000))
                }
              >
                +7 T
              </Button>
              <Button
                style={{ borderRadius: 12 }}
                compact
                onPress={() =>
                  setDate(new Date(Date.now() + 30 * 24 * 3600 * 1000))
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
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="contained-tonal"
            style={{ borderRadius: 12 }}
            onPress={() => setVisible(false)}
          >
            Cancel
          </Button>
          <Button
            style={{ borderRadius: 12 }}
            mode="contained"
            onPress={() => {
              if (!date) return;
              const iso = toIsoUtcFromLocal(date, time.hours, time.minutes);
              onConfirm(iso);
              setVisible(false);
            }}
          >
            Save
          </Button>
        </Dialog.Actions>

        <DatePickerModal
          locale="de"
          mode="single"
          visible={showDate}
          date={date}
          onDismiss={() => setShowDate(false)}
          onConfirm={({ date }) => {
            setShowDate(false);
            if (date) setDate(date);
          }}
        />
        <TimePickerModal
          visible={showTime}
          onDismiss={() => setShowTime(false)}
          onConfirm={({ hours, minutes }) => {
            setShowTime(false);
            setTime({ hours, minutes });
          }}
          hours={time.hours}
          minutes={time.minutes}
          locale="de"
          label="Time"
        />
      </Dialog>
    </Portal>
  );
}
