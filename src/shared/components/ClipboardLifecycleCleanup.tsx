import React from "react";
import { AppState, AppStateStatus } from "react-native";
import { clipboardClearScheduler } from "../../infrastructure/clipboard/clipboardClearScheduler";

export default function ClipboardLifecycleCleanup() {
  React.useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        return;
      }

      void clipboardClearScheduler.forceClearSensitive();
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return null;
}
