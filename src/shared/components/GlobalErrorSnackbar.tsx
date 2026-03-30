import React, { useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import { Portal, Snackbar, Text, Icon } from "react-native-paper";
import {
  subscribeGlobalError,
  unsubscribeGlobalError,
} from "../../infrastructure/events/errorBus";
import { useTheme } from "../../app/providers/ThemeProvider";
import GlobalErrorPayload from "../../infrastructure/events/GlobalErrorPayload";

const AUTO_DISMISS_MS = 5000;

function GlobalErrorSnackbar() {
  const { theme } = useTheme();

  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<GlobalErrorPayload | null>(null);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    const handler = (err: GlobalErrorPayload) => {
      setError(err);
      setVisible(true);
    };

    subscribeGlobalError(handler);
    return () => unsubscribeGlobalError(handler);
  }, []);

  return (
    <Portal>
      <Snackbar
        visible={visible}
        onDismiss={hide}
        duration={AUTO_DISMISS_MS}
        action={{
          label: "OK",
          onPress: hide,
        }}
        wrapperStyle={{
          alignItems: "center",
        }}
        style={{
          backgroundColor: theme.colors.error,
          borderRadius: 14,
          paddingVertical: 0,
          maxWidth: 560,
        }}
        contentStyle={{
          paddingVertical: 6,
          paddingHorizontal: 8,
        }}
        theme={{
          colors: {
            inverseOnSurface: theme.colors.onError,
            inversePrimary: theme.colors.onError,
          },
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Icon source="alert-circle" size={18} color={theme.colors.onError} />
          <View style={{ flex: 1, minWidth: 0 }}>
            {error?.title ? (
              <Text
                variant="labelMedium"
                style={{ color: theme.colors.onError, fontWeight: "800" }}
                numberOfLines={1}
              >
                {error.title}
              </Text>
            ) : null}
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onError, opacity: 0.94 }}
              numberOfLines={3}
            >
              {error?.message ?? ""}
            </Text>
          </View>
        </View>
      </Snackbar>
    </Portal>
  );
}

export default GlobalErrorSnackbar;
