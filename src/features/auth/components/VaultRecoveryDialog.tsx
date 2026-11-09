import { useEffect, useRef, useState } from "react";
import { Keyboard, ScrollView } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../app/providers/ThemeProvider";
import Modal from "../../../shared/components/modals/Modal";
import ModalSurface from "../../../shared/components/modals/ModalSurface";
import {
  supportsVaultRecovery,
  verifyVaultRecoveryKey,
} from "../../../infrastructure/crypto/vault/vaultRecovery";
import {
  computeEntropyBitsForUi,
  entropyToStrength,
} from "../../vault/utils/entropyUi";
import PasswordStrengthLevel from "../../analysis/model/PasswordStrengthLevel";

type Props = {
  content: string;
  recoverySupported: boolean;
  onDismiss: () => void;
  onRecover: (
    key: string,
    password: string,
    isCurrent: () => boolean,
  ) => Promise<void>;
};

export default function VaultRecoveryDialog({
  content,
  recoverySupported,
  onDismiss,
  onRecover,
}: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const keyRef = useRef("");
  const passwordRef = useRef("");
  const confirmationRef = useRef("");
  const mounted = useRef(true);
  const inFlight = useRef(false);
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [strong, setStrong] = useState(false);
  const [matches, setMatches] = useState(false);
  const [error, setError] = useState<"key" | "save" | null>(null);
  const available = recoverySupported && supportsVaultRecovery(content);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      keyRef.current = passwordRef.current = confirmationRef.current = "";
    };
  }, []);

  const run = async (
    operation: () => Promise<void>,
    failure: "key" | "save",
  ) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    Keyboard.dismiss();
    try {
      await operation();
    } catch {
      if (mounted.current) setError(failure);
    } finally {
      inFlight.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const verify = () => {
    if (!available || !keyRef.current.trim()) return;
    void run(async () => {
      await verifyVaultRecoveryKey(content, keyRef.current);
      if (mounted.current) setVerified(true);
    }, "key");
  };

  const save = () => {
    if (!verified || !strong || !matches) return;
    void run(async () => {
      await onRecover(
        keyRef.current,
        passwordRef.current,
        () => mounted.current,
      );
    }, "save");
  };

  const secretInputProps = {
    mode: "outlined" as const,
    autoComplete: "off" as const,
    textContentType: "none" as const,
    autoCorrect: false,
    autoCapitalize: "none" as const,
    secureTextEntry: true,
    disabled: busy,
  };
  const dismiss = () => {
    if (!inFlight.current) onDismiss();
  };

  return (
    <Modal visible onDismiss={dismiss} avoidKeyboard>
      <ModalSurface width={420} title={t("login:forgotMasterPassword")}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ gap: 8 }}
        >
          {!available ? (
            <Text>
              {t(
                recoverySupported
                  ? "login:recoveryUnavailable"
                  : "login:recoveryProviderUnsupported",
              )}
            </Text>
          ) : !verified ? (
            <>
              <TextInput
                {...secretInputProps}
                label={t("login:recoveryEnterKey")}
                autoFocus
                onChangeText={(value) => {
                  keyRef.current = value;
                  setHasKey(Boolean(value.trim()));
                  setError(null);
                }}
                onSubmitEditing={verify}
              />
              <Button
                mode="contained"
                loading={busy}
                disabled={busy || !hasKey}
                onPress={verify}
              >
                {t("login:recoveryVerify")}
              </Button>
            </>
          ) : (
            <>
              <TextInput
                {...secretInputProps}
                key="new-password"
                label={t("login:newMasterPassword")}
                autoFocus
                onChangeText={(value) => {
                  passwordRef.current = value;
                  setStrong(
                    Boolean(value) &&
                      entropyToStrength(computeEntropyBitsForUi(value)) !==
                        PasswordStrengthLevel.WEAK,
                  );
                  setMatches(
                    Boolean(value) && value === confirmationRef.current,
                  );
                }}
              />
              <TextInput
                {...secretInputProps}
                label={t("login:confirmMasterPassword")}
                onChangeText={(value) => {
                  confirmationRef.current = value;
                  setMatches(Boolean(value) && value === passwordRef.current);
                }}
                onSubmitEditing={save}
              />
              {!strong ? (
                <Text>{t("login:masterPasswordWeakHint")}</Text>
              ) : null}
              <Button
                mode="contained"
                loading={busy}
                disabled={busy || !strong || !matches}
                onPress={save}
              >
                {t("login:recoverySetPassword")}
              </Button>
            </>
          )}
          {error ? (
            <Text
              accessibilityRole="alert"
              style={{ color: theme.colors.error }}
            >
              {t(
                error === "key"
                  ? "login:recoveryInvalidKey"
                  : "login:recoveryFailed",
              )}
            </Text>
          ) : null}
          <Button disabled={busy} onPress={dismiss}>
            {t("common:cancel")}
          </Button>
        </ScrollView>
      </ModalSurface>
    </Modal>
  );
}
