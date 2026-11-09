import { useEffect, useRef, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../app/providers/ThemeProvider";
import Modal from "../../../shared/components/modals/Modal";
import ModalSurface, { ModalActions } from "../../../shared/components/modals/ModalSurface";
import { useClipboardCopy } from "../../../shared/hooks/useClipboardCopy";
import { createRecoveryKey } from "../../../infrastructure/crypto/vault/vaultRecovery";

type Props = {
  configured?: boolean;
  cloudVault?: boolean;
  verifyPassword?: (password: string) => boolean;
  onDismiss: () => void;
  onSave: (key: string | null, isCurrent: () => boolean) => Promise<void>;
};

// Mount only while open so sensitive inputs and the displayed key are discarded on close.
export default function VaultRecoverySetupDialog({
  configured,
  cloudVault,
  verifyPassword,
  onDismiss,
  onSave,
}: Props) {
  const { t } = useTranslation();
  const { globalStyles, theme } = useTheme();
  const { copy } = useClipboardCopy();
  const keyRef = useRef("");
  const passwordRef = useRef("");
  const mounted = useRef(true);
  const inFlight = useRef(false);
  const [step, setStep] = useState<"intro" | "key" | "disable">("intro");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<"password" | "save" | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      keyRef.current = "";
      passwordRef.current = "";
    };
  }, []);

  const run = async (operation: () => Promise<void>) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    Keyboard.dismiss();
    try {
      await operation();
    } catch {
      if (mounted.current) setError("save");
    } finally {
      inFlight.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const begin = (action: "key" | "disable") => {
    if (verifyPassword && !verifyPassword(passwordRef.current)) {
      setError("password");
      return;
    }
    void run(async () => {
      const key = action === "key" ? await createRecoveryKey() : "";
      if (!mounted.current) return;
      passwordRef.current = "";
      keyRef.current = key;
      setStep(action);
    });
  };

  const save = () =>
    void run(async () => {
      await onSave(
        step === "disable" ? null : keyRef.current,
        () => mounted.current,
      );
      if (mounted.current) onDismiss();
    });

  const dismiss = () => {
    if (!inFlight.current) onDismiss();
  };

  const primaryLabel = {
    intro: t(configured ? "login:recoveryReplace" : "login:recoveryGenerate"),
    key: t("login:recoveryConfirmSaved"),
    disable: t("login:recoveryDisable"),
  }[step];

  return (
    <Modal visible onDismiss={dismiss} avoidKeyboard>
      <ModalSurface
        width={360}
        title={t("login:recoveryTitle")}
        separatedHeader
        padded={false}
        contentStyle={styles.scrollArea}
        footer={
          <ModalActions>
            <Button
              compact
              mode="contained-tonal"
              style={styles.action}
              disabled={busy}
              onPress={dismiss}
            >
              {t("common:cancel")}
            </Button>
            <Button
              compact
              mode="contained"
              style={styles.action}
              buttonColor={step === "disable" ? theme.colors.error : undefined}
              textColor={step === "disable" ? theme.colors.onError : undefined}
              disabled={busy}
              loading={busy}
              onPress={step === "intro" ? () => begin("key") : save}
            >
              {primaryLabel}
            </Button>
          </ModalActions>
        }
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.scrollArea}
          contentContainerStyle={styles.content}
        >
          {step === "intro" ? (
            <>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {t("login:recoverySetupDescription")}
              </Text>
              {cloudVault && !configured ? (
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t("login:recoveryCloudUpdateDevices")}
                </Text>
              ) : null}
              {verifyPassword ? (
                <View style={styles.field}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    {t("login:masterPassword")}
                  </Text>
                  <TextInput
                    mode="outlined"
                    accessibilityLabel={t("login:masterPassword")}
                    style={globalStyles.textInputStyle}
                    outlineStyle={globalStyles.outlineStyle}
                    autoComplete="off"
                    textContentType="none"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    disabled={busy}
                    onChangeText={(value) => {
                      passwordRef.current = value;
                      setError(null);
                    }}
                  />
                </View>
              ) : null}
              {configured ? (
                <Button
                  compact
                  style={styles.secondaryAction}
                  textColor={theme.colors.error}
                  disabled={busy}
                  onPress={() => begin("disable")}
                >
                  {t("login:recoveryDisable")}
                </Button>
              ) : null}
            </>
          ) : (
            <>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {t(
                  step === "key"
                    ? "login:recoveryKeepSafe"
                    : "login:recoveryDisableDescription",
                )}
              </Text>
              {step === "key" ? (
                <View
                  style={[
                    styles.keyPanel,
                    {
                      backgroundColor: theme.colors.surfaceVariant,
                      borderColor: theme.colors.outlineVariant,
                    },
                  ]}
                >
                  <Text variant="titleMedium" style={styles.keyText}>
                    {keyRef.current
                      .match(/.{1,35}(?:-|$)/g)
                      ?.map((part) => part.replace(/-$/, ""))
                      .join("\n") ?? keyRef.current}
                  </Text>
                  <Button
                    compact
                    mode="contained-tonal"
                    style={styles.action}
                    icon="content-copy"
                    disabled={busy}
                    onPress={() =>
                      void copy(keyRef.current, {
                        kind: "recovery-code",
                        sensitive: true,
                      })
                        .then(() => {
                          if (mounted.current) setCopied(true);
                        })
                        .catch(() => {
                          if (mounted.current) setError("save");
                        })
                    }
                  >
                    {t(copied ? "login:recoveryCopied" : "common:copy")}
                  </Button>
                </View>
              ) : null}
            </>
          )}
          {error ? (
            <Text
              variant="bodySmall"
              accessibilityRole="alert"
              style={{ color: theme.colors.error }}
            >
              {t(
                error === "password"
                  ? "login:recoveryInvalidPassword"
                  : "login:recoveryFailed",
              )}
            </Text>
          ) : null}
        </ScrollView>
      </ModalSurface>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollArea: {
    flexGrow: 0,
    flexShrink: 1,
  },
  content: {
    padding: 14,
    gap: 8,
  },
  field: {
    gap: 8,
  },
  action: {
    borderRadius: 12,
    maxWidth: "100%",
  },
  secondaryAction: {
    alignSelf: "flex-start",
    borderRadius: 12,
  },
  keyPanel: {
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  keyText: {
    textAlign: "center",
  },
});
