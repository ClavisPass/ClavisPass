import React, { useEffect, useState, useCallback } from "react";
import { Portal, Snackbar } from "react-native-paper";
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
        style={{
          backgroundColor: theme.colors.errorContainer,
        }}
        theme={{
          colors: {
            inverseOnSurface: theme.colors.onErrorContainer,
          },
        }}
      >
        {error?.title
          ? `${error.title}: ${error.message}`
          : (error?.message ?? "")}
      </Snackbar>
    </Portal>
  );
}

export default GlobalErrorSnackbar;
