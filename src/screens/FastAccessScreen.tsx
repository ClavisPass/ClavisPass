import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../app/providers/ThemeProvider";
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
import AmbientBackground from "../shared/components/AmbientBackground";
import PasswordTextbox from "../shared/components/PasswordTextbox";
import CopyToClipboard from "../shared/components/buttons/CopyToClipboard";
import TooltipIconButton from "../shared/components/buttons/TooltipIconButton";
import AppIcon from "../shared/components/icons/AppIcon";
import { getScreenContentStyle } from "../shared/ui/glass";

type FastAccessPayload = {
  title: string;
  username: string;
  password: string;
};

function getFastAccessActionStyle(darkmode: boolean, theme: any) {
  return {
    backgroundColor: darkmode
      ? theme.colors.secondaryContainer
      : "rgba(248, 248, 248, 0.72)",
    borderColor: darkmode
      ? "rgba(120, 127, 246, 0.26)"
      : "rgba(120, 127, 246, 0.24)",
  };
}

function ActionIconButton({
  tooltip,
  icon,
  disabled,
  onPress,
}: {
  tooltip: string;
  icon: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  const { darkmode, theme } = useTheme();
  const actionStyle = getFastAccessActionStyle(darkmode, theme);

  return (
    <TooltipIconButton
      tooltip={tooltip}
      icon={icon}
      iconColor={theme.colors.primary}
      size={18}
      disabled={disabled}
      onPress={onPress}
      style={[styles.iconButton, actionStyle, { opacity: disabled ? 0.38 : 1 }]}
    />
  );
}

export default function FastAccessScreen() {
  const { t } = useTranslation();
  const [payload, setPayload] = useState<FastAccessPayload>({
    title: "",
    username: "",
    password: "",
  });
  const { darkmode, globalStyles, theme } = useTheme();
  const dragInProgressRef = useRef(false);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelStyle = getScreenContentStyle(theme);

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

  const openMainWindow = async () => {
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

      const unlistenUpdate = await currentWindow.listen(
        FAST_ACCESS_UPDATE_EVENT,
        (event) => {
          const nextPayload = event.payload as FastAccessPayload;
          setPayload({
            title: nextPayload.title ?? "",
            username: nextPayload.username ?? "",
            password: nextPayload.password ?? "",
          });
        },
      );

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

      unlisten = () => {
        unlistenUpdate?.();
        unlistenMoved?.();
        if (snapTimeoutRef.current) {
          clearTimeout(snapTimeoutRef.current);
          snapTimeoutRef.current = null;
        }
      };

      await emit(FAST_ACCESS_READY_EVENT, { label: FAST_ACCESS_POPUP_LABEL });
    };

    void setup();

    return () => {
      unlisten?.();
    };
  }, []);

  const title = payload.title || t("common:fastAccess");

  return (
    <View style={[styles.root, { backgroundColor: "transparent" }]}>
      <AmbientBackground />
      <View style={[styles.content, panelStyle]}>
        <AnimatedPressable
          onPressIn={() => {
            void startHeaderDrag();
          }}
          style={[
            styles.headerPressable,
            Platform.OS === "web" ? styles.webCursor : null,
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <AppIcon
                color={theme.colors.primary}
                size={18}
                name="tooltip-account"
              />
              <Text
                numberOfLines={1}
                variant="bodyMedium"
                style={[styles.title, { color: theme.colors.onSurface }]}
              >
                {title}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <ActionIconButton
                tooltip={t("common:openApp")}
                icon="open-in-app"
                onPress={() => {
                  void openMainWindow();
                }}
              />
              <ActionIconButton
                tooltip={t("common:cancel")}
                icon="window-close"
                onPress={() => {
                  void hideFastAccess();
                }}
              />
            </View>
          </View>
        </AnimatedPressable>

        <View style={styles.rows}>
          <View style={globalStyles.moduleView}>
            <View style={{ height: 40, flexGrow: 1 }}>
              <TextInput
                mode="outlined"
                outlineStyle={globalStyles.outlineStyle}
                placeholder=""
                style={globalStyles.textInputStyle}
                value={payload.username}
              />
            </View>
            <CopyToClipboard
              value={payload.username}
              disabled={!payload.username}
              kind="username"
            />
          </View>

          <View style={globalStyles.moduleView}>
            <PasswordTextbox value={payload.password} placeholder="" />
            <CopyToClipboard
              value={payload.password}
              disabled={!payload.password}
              kind="password"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: 8,
    gap: 6,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  headerPressable: {
    height: 34,
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  headerTitle: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  iconButton: {
    width: 30,
    height: 30,
    margin: 0,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  rows: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontWeight: "700",
  },
  webCursor: {
    cursor: "default",
  } as any,
});
