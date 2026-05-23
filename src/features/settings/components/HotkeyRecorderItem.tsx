import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../app/providers/ThemeProvider";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";
import {
  DEFAULT_HOTKEYS,
  getHotkeyConflict,
  hotkeyFromKeyboardEvent,
  HotkeyAction,
  HotkeySettings,
} from "../../../infrastructure/platform/hotkeys";
import { beginHotkeyRecording } from "../../../infrastructure/events/hotkeyRecordingBus";

type Props = {
  action: HotkeyAction;
  label: string;
  hotkeys: HotkeySettings;
  onChange: (next: HotkeySettings) => void;
};

export default function HotkeyRecorderItem({
  action,
  label,
  hotkeys,
  onChange,
}: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRecordingRef = useRef<null | (() => void)>(null);

  const value = hotkeys[action];

  const startRecording = () => {
    endRecordingRef.current?.();
    endRecordingRef.current = beginHotkeyRecording();
    setRecording(true);
    setError(null);
  };

  const stopRecording = () => {
    endRecordingRef.current?.();
    endRecordingRef.current = null;
    setRecording(false);
  };

  useEffect(() => {
    if (!recording) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === "Escape") {
        stopRecording();
        setError(null);
        return;
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        onChange({ ...hotkeys, [action]: null });
        stopRecording();
        setError(null);
        return;
      }

      const hotkey = hotkeyFromKeyboardEvent(event);
      if (!hotkey) {
        setError(t("settings:hotkeyInvalid"));
        return;
      }

      if (hotkey === hotkeys[action]) {
        stopRecording();
        setError(null);
        return;
      }

      const conflict = getHotkeyConflict(hotkeys, action, hotkey);
      if (conflict) {
        setError(
          t("settings:hotkeyConflict", {
            action: t(`settings:hotkeyAction_${conflict}`),
          }),
        );
        return;
      }

      onChange({ ...hotkeys, [action]: hotkey });
      stopRecording();
      setError(null);
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [action, hotkeys, onChange, recording, t]);

  useEffect(() => {
    return () => {
      endRecordingRef.current?.();
      endRecordingRef.current = null;
    };
  }, []);

  return (
    <View
      style={{
        minHeight: error ? 70 : 54,
        paddingLeft: 10,
        paddingRight: 4,
        paddingVertical: 6,
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Text
          variant="bodyLarge"
          numberOfLines={1}
          style={{ flex: 1, userSelect: "none" }}
        >
          {label}
        </Text>
        <View style={{ width: 28, height: 34, justifyContent: "center" }}>
          {value !== DEFAULT_HOTKEYS[action] ? (
            <AnimatedPressable
              borderless={false}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                onChange({ ...hotkeys, [action]: DEFAULT_HOTKEYS[action] });
                setError(null);
                stopRecording();
              }}
            >
              <Icon source="restore" size={18} color={theme.colors.primary} />
            </AnimatedPressable>
          ) : null}
        </View>
        <AnimatedPressable
          onPress={startRecording}
          borderless={false}
          style={{ borderRadius: 8, overflow: "hidden" }}
        >
          <View
            style={{
              minWidth: 108,
              minHeight: 34,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: recording
                ? theme.colors.primary
                : theme.colors.outlineVariant,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 10,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: recording ? theme.colors.primary : theme.colors.onSurface,
                userSelect: "none",
              }}
            >
              {recording
                ? t("settings:hotkeyRecording")
                : (value ?? t("settings:hotkeyDisabled"))}
            </Text>
          </View>
        </AnimatedPressable>
      </View>
      {error ? (
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.error, marginTop: 2 }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
