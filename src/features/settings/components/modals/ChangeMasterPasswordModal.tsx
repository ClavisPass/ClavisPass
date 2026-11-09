import { Keyboard, View, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import Modal from "../../../../shared/components/modals/Modal";
import PasswordTextbox from "../../../../shared/components/PasswordTextbox";
import Button from "../../../../shared/components/buttons/Button";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useAuth } from "../../../../app/providers/AuthProvider";
import { useToken } from "../../../../app/providers/CloudProvider";

import { logger } from "../../../../infrastructure/logging/logger";
import { fetchRemoteVaultFile, runVaultOperation, uploadRemoteVaultFile } from "../../../../infrastructure/cloud/clients/CloudStorageClient";
import { useVault } from "../../../../app/providers/VaultProvider";
import { encryptVaultContent } from "../../../../infrastructure/crypto/encryptVaultContent";
import { decryptVaultContent } from "../../../../infrastructure/crypto/decryptVaultContent";
import { areVaultDataEqual, mergeVaultData } from "../../../vault/utils/mergeVaultData";
import { persistPreparedRecoveryVault, prepareV3VaultPasswordChange } from "../../../../infrastructure/crypto/vault/vaultRecovery";
import { removeAuthentication } from "../../../auth/utils/authenticateUser";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: 200,
    width: 300,
    cursor: "auto",
    gap: 6,
  },
});

function ChangeMasterPasswordModal(props: Props) {
  const auth = useAuth();
  const vault = useVault();
  const { provider, accessToken, ensureFreshAccessToken } = useToken();

  const { theme } = useTheme();
  const { t } = useTranslation();

  const [passwordConfirmed, setPasswordConfirmed] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordNotEqual, setPasswordNotEqual] = useState(true);
  const [error, setError] = useState(false);
  const [processing, setProcessing] = useState(false);

  const textInputRef = useRef<any>(null);
  const textInput2Ref = useRef<any>(null);
  const textInput3Ref = useRef<any>(null);

  const hideModal = () => props.setVisible(false);

  const clear = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordConfirmed(false);
    setError(false);
    setPasswordNotEqual(true);
  };

  useEffect(() => {
    if (props.visible) {
      clear();
      setTimeout(() => {
        textInputRef.current?.focus?.();
      }, 50);
    }
  }, [props.visible]);

  useEffect(() => {
    if (newPassword !== "" && confirmPassword !== "") {
      setPasswordNotEqual(newPassword !== confirmPassword);
    } else {
      setPasswordNotEqual(true);
    }
  }, [newPassword, confirmPassword]);

  const flashError = () => {
    setError(true);
    setTimeout(() => setError(false), 1000);
  };

  const verifyCurrentPassword = async () => {
    Keyboard.dismiss();

    if (!currentPassword) {
      flashError();
      textInputRef.current?.focus?.();
      return;
    }

    if (currentPassword !== auth.getMaster()) {
      flashError();
      setCurrentPassword("");
      textInputRef.current?.focus?.();
      return;
    }

    setPasswordConfirmed(true);
    setTimeout(() => {
      textInput2Ref.current?.focus?.();
    }, 50);
  };

  const applyNewPassword = async () => {
    if (processing || passwordNotEqual || !newPassword || !confirmPassword) return;

    Keyboard.dismiss();
    setProcessing(true);
    const change = async () => {
      if (!provider) {
        logger.warn(
          "[ChangeMasterPassword] No provider configured; cannot persist.",
        );
        throw new Error("No provider configured");
      }

      let tokenToUse: string | null = null;

      if (provider !== "device") {
        tokenToUse = accessToken ?? (await ensureFreshAccessToken());
        if (!tokenToUse) throw new Error("No access token available");
      }

      const master = auth.getMaster();
      if (!master || master !== currentPassword) throw new Error("Session changed");
      const data = vault.exportFullData();
      const revision = vault.getRevision();
      const isCurrent = () => auth.getMaster() === master && vault.getRevision() === revision;
      const target = { provider, accessToken: tokenToUse ?? "", remotePath: "clavispass.lock" };
      const saved = await fetchRemoteVaultFile(target);
      if (saved.status !== "ok") throw new Error("Could not read saved vault");
      const existing = await decryptVaultContent(saved.content, master, { commitSession: false });
      if (!existing.ok) throw new Error("Could not verify saved vault");
      const merged = mergeVaultData(data, existing.payload, {
        sameTimestampConflictStrategy: "keepRemote",
      }).vault;
      let content: string;
      if (existing.format === "v3") {
        content = await prepareV3VaultPasswordChange(saved.content, master, newPassword, merged);
      } else {
        const enc = await encryptVaultContent(merged, newPassword, {
          forceRewrap: true,
          commitSession: false,
          newVault: true,
        });
        if (!enc.ok) throw enc.error;
        content = enc.content;
      }
      const persisted = await persistPreparedRecoveryVault(content, newPassword, async (vaultId) => {
        if (!isCurrent()) throw new Error("Vault changed during password preparation");
        await uploadRemoteVaultFile({
          ...target,
          content,
          vaultId,
          expected: saved,
        });
        await removeAuthentication().catch(() => {
          logger.warn("[ChangeMasterPassword] Could not clear system authentication");
        });
      }, () => auth.getMaster() === master);
      if (!persisted) return;

      auth.login(newPassword);
      if (vault.getRevision() === revision) {
        if (areVaultDataEqual(data, persisted)) vault.markSaved();
        else vault.unlockWithDecryptedVault(persisted);
      }

      hideModal();
    };
    try {
      await runVaultOperation(change);
    } catch (e) {
      logger.error(
        "[ChangeMasterPassword] Failed to change master password:",
        e,
      );
      flashError();
    } finally {
      setProcessing(false);
      clear();
    }
  };

  return (
    <Modal visible={props.visible} onDismiss={hideModal} avoidKeyboard>
      <View
        style={[
          styles.container,
          {
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        {!passwordConfirmed ? (
          <>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                flexGrow: 1,
              }}
            >
              <Text
                variant="headlineSmall"
                style={{ userSelect: "none" as any }}
              >
                {t("common:verify")}
              </Text>
              <Text variant="bodyMedium" style={{ userSelect: "none" as any }}>
                {t("login:enterMasterPassword")}
              </Text>
            </View>

            <View style={{ width: "100%" }}>
              <PasswordTextbox
                setCapsLock={setCapsLock}
                textInputRef={textInputRef}
                errorColor={error}
                autofocus
                setValue={setCurrentPassword}
                value={currentPassword}
                placeholder={t("login:masterPassword")}
                onSubmitEditing={verifyCurrentPassword}
              />
            </View>

            <Button
              text={t("login:login")}
              onPress={verifyCurrentPassword}
              loading={processing}
            />
          </>
        ) : (
          <>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                flexGrow: 1,
              }}
            >
              <Text
                variant="headlineSmall"
                style={{ userSelect: "none" as any }}
              >
                {t("login:newMasterPassword")}
              </Text>
            </View>

            <View style={{ width: "100%" }}>
              <PasswordTextbox
                autofocus
                textInputRef={textInput2Ref}
                setValue={setNewPassword}
                value={newPassword}
                placeholder={t("login:newMasterPassword")}
                onSubmitEditing={() => textInput3Ref.current?.focus?.()}
              />
            </View>

            <View style={{ width: "100%" }}>
              <PasswordTextbox
                textInputRef={textInput3Ref}
                setValue={setConfirmPassword}
                value={confirmPassword}
                placeholder={t("login:confirmMasterPassword")}
                onSubmitEditing={
                  passwordNotEqual ? undefined : applyNewPassword
                }
              />
            </View>

            <Button
              disabled={passwordNotEqual}
              text={t("login:setNewPassword")}
              onPress={applyNewPassword}
              loading={processing}
            />
          </>
        )}

        {capsLock && (
          <Text style={{ color: theme.colors.primary, marginTop: 10 }}>
            {t("common:capslockOn")}
          </Text>
        )}
      </View>
    </Modal>
  );
}

export default ChangeMasterPasswordModal;
