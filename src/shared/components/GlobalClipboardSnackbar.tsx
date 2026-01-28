import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { Portal, Snackbar, Text, Icon } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { clipboardClearScheduler } from "../../infrastructure/clipboard/clipboardClearScheduler";
import { useTheme } from "../../app/providers/ThemeProvider";
import {
  subscribeClipboardCopied,
  unsubscribeClipboardCopied,
} from "../../infrastructure/events/clipboardBus";
import ClipboardCopyPayload from "../../infrastructure/events/ClipboardCopyPayload";

function msToSecCeil(ms: number) {
  return Math.max(0, Math.ceil(ms / 1000));
}

export default function GlobalClipboardSnackbar() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [remainingMs, setRemainingMs] = useState(0);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTicker = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  }, []);

  const hide = useCallback(async () => {
    stopTicker();
    setVisible(false);
    await clipboardClearScheduler.forceClear();
  }, [stopTicker]);

  useEffect(() => {
    const handler = (p: ClipboardCopyPayload) => {
      stopTicker();

      if (!p.durationMs || p.durationMs <= 0) return;

      setVisible(true);

      const endAt = p.createdAt + p.durationMs;

      setRemainingMs(Math.max(0, endAt - Date.now()));

      tickRef.current = setInterval(() => {
        const left = Math.max(0, endAt - Date.now());
        setRemainingMs(left);

        if (left <= 0) {
          stopTicker();
          setVisible(false);
        }
      }, 250);
    };

    subscribeClipboardCopied(handler);
    return () => {
      unsubscribeClipboardCopied(handler);
      stopTicker();
    };
  }, [stopTicker]);

  const remainingSec = useMemo(() => msToSecCeil(remainingMs), [remainingMs]);

  const copiedForText = useMemo(
    () => t("common:copiedFor", { seconds: remainingSec }),
    [t, remainingSec]
  );

  return (
    <Portal>
      <Snackbar
        visible={visible}
        onDismiss={hide}
        duration={999999}
        action={{
          label: "✕",
          onPress: hide,
        }}
        wrapperStyle={{
          alignItems: "center",
        }}
        style={{
          backgroundColor: theme.colors.background,
          borderRadius: 12,
          paddingVertical: 0,
        }}
        contentStyle={{
          paddingVertical: 2,
          paddingHorizontal: 6,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Icon source="content-copy" size={16} color={theme.colors.primary} />
          <Text variant="bodySmall">{copiedForText}</Text>
        </View>
      </Snackbar>
    </Portal>
  );
}
