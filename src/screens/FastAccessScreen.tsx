import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Icon, Text, TextInput } from "react-native-paper";
import { useTheme } from "../app/providers/ThemeProvider";
import Header from "../shared/components/Header";
import PasswordTextbox from "../shared/components/PasswordTextbox";
import CopyToClipboard from "../shared/components/buttons/CopyToClipboard";
import {
  hideFastAccess,
  snapPopupToNearestCorner,
} from "../features/fastaccess/utils/FastAccess";
import AnimatedPressable from "../shared/components/AnimatedPressable";
import {
  FAST_ACCESS_POPUP_LABEL,
  FAST_ACCESS_READY_EVENT,
  FAST_ACCESS_UPDATE_EVENT,
} from "../features/fastaccess/constants";
import { detectTauriEnvironment } from "../infrastructure/platform/isTauri";
import { logger } from "../infrastructure/logging/logger";

export default function FastAccessScreen() {
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { theme, globalStyles } = useTheme();
  const dragInProgressRef = React.useRef(false);
  const snapTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHeaderDrag = async () => {
    if (!(await detectTauriEnvironment())) {
      return;
    }

    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      const currentWindow = getCurrentWindow();
      dragInProgressRef.current = true;
      await currentWindow.startDragging();
    } catch (error) {
      dragInProgressRef.current = false;
      logger.warn("[FastAccess] Dragging failed:", error);
    }
  };

  useEffect(() => {
    let unlisten: null | (() => void) = null;

    const setup = async () => {
      if (!(await detectTauriEnvironment())) {
        return;
      }
      const [{ emit }, { getCurrentWindow }] = await Promise.all([
        import("@tauri-apps/api/event"),
        import("@tauri-apps/api/window"),
      ]);
      const currentWindow = getCurrentWindow();

      unlisten = await currentWindow.listen(FAST_ACCESS_UPDATE_EVENT, (event) => {
        const payload = event.payload as {
          title: string;
          username: string;
          password: string;
        };
        setTitle(payload.title);
        setUsername(payload.username);
        setPassword(payload.password);
      });

      const unlistenMoved = await currentWindow.onMoved(() => {
        if (!dragInProgressRef.current) {
          return;
        }

        if (snapTimeoutRef.current) {
          clearTimeout(snapTimeoutRef.current);
        }

        snapTimeoutRef.current = setTimeout(() => {
          dragInProgressRef.current = false;
          snapTimeoutRef.current = null;
          void snapPopupToNearestCorner();
        }, 140);
      });

      const previousUnlisten = unlisten;
      unlisten = () => {
        previousUnlisten?.();
        unlistenMoved?.();
        if (snapTimeoutRef.current) {
          clearTimeout(snapTimeoutRef.current);
          snapTimeoutRef.current = null;
        }
      };

      await emit(FAST_ACCESS_READY_EVENT, { label: FAST_ACCESS_POPUP_LABEL });
    };

    setup();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        width: "100%",
        height: "100%",
      }}
    >
      <Header
        leftNode={
          <AnimatedPressable
            onPressIn={() => {
              void startHeaderDrag();
            }}
            style={{
              flex: 1,
              height: 40,
              cursor: "move",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
                paddingLeft: 12,
                paddingRight: 12,
              }}
            >
              <Icon
                color={theme.colors.primary}
                size={20}
                source={"tooltip-account"}
              />
              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.primary, userSelect: "none" }}
              >
                {title}
              </Text>
            </View>
          </AnimatedPressable>
        }
      >
        <View style={{ display: "flex", flexDirection: "row" }}>
          <AnimatedPressable
            onPress={async () => {
              if (!(await detectTauriEnvironment())) {
                return;
              }
              const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
              const win = await WebviewWindow.getByLabel("main");
              if (!win) {
                return;
              }
              await win.show();
              await win.unminimize();
              await win.setFocus();
              await hideFastAccess();
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: 50,
              height: 40,
              borderRadius: 4,
            }}
          >
            <Icon
              source={"open-in-app"}
              size={20}
              color={theme.colors.primary}
            />
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => {
              hideFastAccess();
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: 50,
              height: 40,
              borderRadius: 4,
              borderBottomEndRadius: 12,
            }}
          >
            <Icon
              source={"window-close"}
              size={20}
              color={theme.colors.primary}
            />
          </AnimatedPressable>
        </View>
      </Header>
      <View style={{ flex: 1, width: "100%", padding: 8, paddingTop: 0 }}>
        <View style={globalStyles.moduleView}>
          <View style={{ height: 40, flexGrow: 1 }}>
            <TextInput
              outlineStyle={globalStyles.outlineStyle}
              style={globalStyles.textInputStyle}
              value={username}
              mode="outlined"
            />
          </View>
          <CopyToClipboard value={username} />
        </View>

        <View style={globalStyles.moduleView}>
          <PasswordTextbox value={password} placeholder="" />
          <CopyToClipboard value={password} />
        </View>
      </View>
    </View>
  );
}
