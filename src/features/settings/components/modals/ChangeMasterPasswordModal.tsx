import { View, StyleSheet } from "react-native";
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
import { encrypt } from "../../../../infrastructure/crypto/CryptoLayer";
import { uploadRemoteVaultFile } from "../../../../infrastructure/cloud/clients/CloudStorageClient";
import { getDateTime } from "../../../../shared/utils/Timestamp";
import { useVault } from "../../../../app/providers/VaultProvider";

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
    if (!currentPassword) {
      flashError();
      textInputRef.current?.focus?.();
      return;
    }

    if (currentPassword !== auth.master) {
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
    if (passwordNotEqual || !newPassword || !confirmPassword) return;

    setProcessing(true);
    try {
      // 1) Klartext-Vault exportieren (kurzzeitig)
      const data = vault.exportFullData();

      // 2) Neu verschlüsseln mit neuem Master-Passwort
      const lastUpdated = getDateTime();
      const crypto = await encrypt(data, newPassword, lastUpdated);
      const content = JSON.stringify(crypto);

      // 3) Persistieren (device oder remote provider)
      if (!provider) {
        // Falls "kein Provider" bei dir wirklich existiert, musst du hier deinen lokalen Save-Path aufrufen.
        // In deinem Setup sieht es eher so aus, dass immer provider gesetzt ist (mindestens "device").
        logger.warn("[ChangeMasterPassword] No provider configured; cannot persist.");
        throw new Error("No provider configured");
      }

      let tokenToUse: string | null = null;

      if (provider !== "device") {
        tokenToUse = accessToken ?? (await ensureFreshAccessToken());
        if (!tokenToUse) throw new Error("No access token available");
      }

      await uploadRemoteVaultFile({
        provider,
        accessToken: tokenToUse ?? "",
        remotePath: "clavispass.lock",
        content,
        onCompleted: undefined,
      } as any);

      // 4) Session aktualisieren: auth master wechseln, dirty reset
      auth.login(newPassword);
      vault.markSaved();

      hideModal();
    } catch (e) {
      logger.error("[ChangeMasterPassword] Failed to change master password:", e);
      flashError();
    } finally {
      setProcessing(false);
      clear();
    }
  };

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
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
            <View style={{ display: "flex", flexDirection: "column", gap: 6, flexGrow: 1 }}>
              <Text variant="headlineSmall" style={{ userSelect: "none" as any }}>
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
            <View style={{ display: "flex", flexDirection: "column", gap: 6, flexGrow: 1 }}>
              <Text variant="headlineSmall" style={{ userSelect: "none" as any }}>
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
                onSubmitEditing={passwordNotEqual ? undefined : applyNewPassword}
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
