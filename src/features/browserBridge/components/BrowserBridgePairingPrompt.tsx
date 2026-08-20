import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../app/providers/ThemeProvider";
import { detectTauriEnvironment } from "../../../infrastructure/platform/isTauri";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";
import {
  actOnBrowserExtensionPairing,
  buildBrowserClientKey,
  listBrowserExtensionPairings,
  type PendingPairing,
} from "../../settings/utils/browserExtensionPairings";

const POLL_INTERVAL_MS = 2500;
const DISMISS_INTERVAL_MS = 60000;

type PairingAction = "bridge_approve_pairing" | "bridge_reject_pairing";

export default function BrowserBridgePairingPrompt() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [pending, setPending] = useState<PendingPairing | null>(null);
  const [acting, setActing] = useState<PairingAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dismissed = useRef<{ key: string; until: number } | null>(null);

  const loadPending = useCallback(async () => {
    if (!(await detectTauriEnvironment())) {
      setPending(null);
      return;
    }

    const result = await listBrowserExtensionPairings();
    const next = result.pending[0] ?? null;
    const nextKey = next
      ? buildBrowserClientKey(next.extensionId, next.clientInstanceId)
      : null;

    if (
      nextKey &&
      dismissed.current?.key === nextKey &&
      dismissed.current.until > Date.now()
    ) {
      setPending(null);
      return;
    }

    setPending(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    const tick = async () => {
      try {
        if (!cancelled) {
          await loadPending();
        }
      } catch {
        if (!cancelled) {
          setPending(null);
        }
      }
    };

    void tick();
    timer = setInterval(() => {
      void tick();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [loadPending]);

  const act = useCallback(
    async (action: PairingAction) => {
      if (!pending) {
        return;
      }

      setActing(action);
      setError(null);
      try {
        await actOnBrowserExtensionPairing(action, pending);
        dismissed.current = null;
        await loadPending();
      } catch (actionError) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : t("settings:browserActionFailed"),
        );
      } finally {
        setActing(null);
      }
    },
    [loadPending, pending, t],
  );

  if (!pending) {
    return null;
  }

  const clientName =
    pending.clientName?.trim() || t("settings:browserUnknownClientShort");
  const busy = acting !== null;

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <View
        style={[
          styles.prompt,
          {
            backgroundColor: theme.colors.elevation.level1,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        <View
          style={[
            styles.iconBubble,
            { backgroundColor: `${theme.colors.primary}1F` },
          ]}
        >
          <Icon source="puzzle-check-outline" size={24} color={theme.colors.primary} />
        </View>

        <View style={styles.content}>
          <Text variant="titleMedium" style={styles.title}>
            {t("settings:browserPairingPromptTitle")}
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {t("settings:browserPairingPromptDescription", {
              client: clientName,
            })}
          </Text>
          {error ? (
            <Text variant="bodySmall" style={{ color: theme.colors.error }}>
              {error}
            </Text>
          ) : null}

          <View style={styles.actions}>
            <PromptButton
              disabled={busy}
              icon="check"
              label={t("settings:browserApprove")}
              loading={acting === "bridge_approve_pairing"}
              onPress={() => void act("bridge_approve_pairing")}
              variant="primary"
            />
            <PromptButton
              disabled={busy}
              icon="close"
              label={t("settings:browserReject")}
              loading={acting === "bridge_reject_pairing"}
              onPress={() => void act("bridge_reject_pairing")}
              variant="danger"
            />
            <PromptButton
              disabled={busy}
              icon="clock-outline"
              label={t("settings:browserPairingPromptLater")}
              onPress={() => {
                dismissed.current = {
                  key: buildBrowserClientKey(
                    pending.extensionId,
                    pending.clientInstanceId,
                  ),
                  until: Date.now() + DISMISS_INTERVAL_MS,
                };
                setPending(null);
              }}
              variant="muted"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function PromptButton(props: {
  disabled?: boolean;
  icon: string;
  label: string;
  loading?: boolean;
  onPress: () => void;
  variant: "primary" | "danger" | "muted";
}) {
  const { theme } = useTheme();
  const backgroundColor =
    props.variant === "primary"
      ? theme.colors.primary
      : props.variant === "danger"
        ? theme.colors.error
        : theme.colors.elevation.level3;
  const color = props.variant === "muted" ? theme.colors.primary : "white";

  return (
    <AnimatedPressable
      disabled={props.disabled}
      onPress={props.onPress}
      style={[
        styles.button,
        {
          backgroundColor: props.disabled
            ? theme.colors.surfaceDisabled
            : backgroundColor,
          opacity: props.disabled ? 0.7 : 1,
        },
      ]}
    >
      {props.loading ? (
        <ActivityIndicator size={14} color={color} />
      ) : (
        <Icon source={props.icon} size={15} color={color} />
      )}
      <Text variant="bodySmall" style={{ color, fontWeight: "800" }}>
        {props.label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    bottom: 16,
    left: 16,
    pointerEvents: "box-none",
    position: "absolute",
    right: 16,
    zIndex: 50,
  },
  prompt: {
    alignSelf: "flex-end",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: "0px 16px 42px rgba(21, 28, 44, 0.18)",
    flexDirection: "row",
    gap: 12,
    maxWidth: 460,
    padding: 14,
  },
  iconBubble: {
    alignItems: "center",
    borderRadius: 10,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontWeight: "800",
    userSelect: "none",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 5,
    minHeight: 34,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
