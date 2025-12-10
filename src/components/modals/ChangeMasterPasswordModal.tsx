import { View, StyleSheet } from "react-native";
import Modal from "./Modal";
import { useData } from "../../contexts/DataProvider";
import { useEffect, useRef, useState } from "react";
import PasswordTextbox from "../PasswordTextbox";
import { Text } from "react-native-paper";
import Button from "../buttons/Button";
import { useTheme } from "../../contexts/ThemeProvider";
import { useAuth } from "../../contexts/AuthProvider";
import { useTranslation } from "react-i18next";

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
  const data = useData();
  const auth = useAuth();
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

  const verifyCurrentPassword = async () => {
    if (!currentPassword) {
      setError(true);
      setTimeout(() => setError(false), 1000);
      textInputRef.current?.focus?.();
      return;
    }

    if (currentPassword !== auth.master) {
      setError(true);
      setCurrentPassword("");
      setTimeout(() => setError(false), 1000);
      textInputRef.current?.focus?.();
      return;
    }

    setPasswordConfirmed(true);
    setTimeout(() => {
      textInput2Ref.current?.focus?.();
    }, 50);
  };

  const applyNewPassword = async () => {
    if (passwordNotEqual || !newPassword || !confirmPassword) {
      return;
    }

    setProcessing(true);
    try {
      auth.login(newPassword);
      data.setShowSave(true);
      hideModal();
      // navigation.navigate("Home");
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
