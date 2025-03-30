import { View } from "react-native";
import Modal from "./Modal";
import { useData } from "../../contexts/DataProvider";
import { useEffect, useRef, useState } from "react";
import PasswordTextbox from "../PasswordTextbox";
import { ActivityIndicator, Text } from "react-native-paper";
import Button from "../buttons/Button";
import { useTheme } from "../../contexts/ThemeProvider";
import fetchData from "../../api/fetchData";
import CryptoType, { CryptoTypeSchema } from "../../types/CryptoType";
import { useToken } from "../../contexts/TokenProvider";
import { decrypt } from "../../utils/CryptoLayer";
import { DataTypeSchema } from "../../types/DataType";
import { set } from "zod";
import { compare, getDateTime } from "../../utils/Timestamp";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

function ChangeMasterPasswordModal(props: Props) {
  const data = useData();
  const { theme } = useTheme();

  const { token, tokenType } = useToken();

  const [passwordConfirmed, setPasswordConfirmed] = useState(false);

  const [capsLock, setCapsLock] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [serverHasNewerState, setServerHasNeverState] = useState(false);

  const hideModal = () => props.setVisible(false);

  const [parsedCryptoData, setParsedCryptoData] = useState<CryptoType | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const textInputRef = useRef<any>(null);
  const textInput2Ref = useRef<any>(null);
  const textInput3Ref = useRef<any>(null);

  const clear = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    setPasswordConfirmed(false);
    clear();
    if (props.visible && token && tokenType) {
      setLoading(true);
      fetchData(token, tokenType, "clavispass.lock").then((response) => {
        if (response === null) {
          setLoading(false);
        } else {
          const parsedCryptoData = CryptoTypeSchema.parse(JSON.parse(response));
          setParsedCryptoData(parsedCryptoData);
          setServerHasNeverState(
            compare(parsedCryptoData.lastUpdated, data.lastUpdated)
          );
          setLoading(false);
        }
      });
    }
  }, [props.visible]);

  useEffect(() => {
    if (passwordConfirmed) {
      textInput2Ref.current.focus();
    }
  }, [passwordConfirmed]);

  const login = async (value: string, parsedCryptoData: CryptoType | null) => {
    try {
      if (parsedCryptoData === null) {
        return;
      }
      const lastUpdated = parsedCryptoData.lastUpdated;
      const decryptedData = decrypt(parsedCryptoData, value);
      const jsonData = JSON.parse(decryptedData);

      const parsedData = DataTypeSchema.parse(jsonData);
      setPasswordConfirmed(true);
      textInput2Ref.current.focus();
      //setData(parsedData);
      //setLastUpdated(lastUpdated);
      //auth.login(value);
    } catch (error) {
      console.error("Error getting Data:", error);
      textInputRef.current.focus();
      clear();
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1000);
    }
  };

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={{
          padding: 16,
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: 200,
          width: 300,
          cursor: "auto",
          gap: 6,
        }}
      >
        {loading ? (
          <ActivityIndicator size={"large"} animating={true} />
        ) : (
          <>
            {serverHasNewerState ? (
              <>
                <Text style={{ color: theme.colors.error }}>
                  Server has newer state
                </Text>
                <Button text={"Overwrite Server"} onPress={() => {}}></Button>
                <Button text={"Overwrite Local State"} onPress={() => {}}></Button>
              </>
            ) : (
              <>
                {passwordConfirmed ? (
                  <>
                    <PasswordTextbox
                      autofocus
                      textInputRef={textInput2Ref}
                      setValue={setNewPassword}
                      value={newPassword}
                      placeholder="New Password"
                      onSubmitEditing={() => textInput3Ref.current.focus()}
                    />
                    <PasswordTextbox
                      textInputRef={textInput3Ref}
                      setValue={setConfirmPassword}
                      value={confirmPassword}
                      placeholder="Confirm Password"
                      onSubmitEditing={() => {}}
                    />
                    <Button text={"Set Password"} onPress={() => {}}></Button>
                  </>
                ) : (
                  <>
                    <PasswordTextbox
                      setCapsLock={setCapsLock}
                      textInputRef={textInputRef}
                      errorColor={error}
                      autofocus
                      setValue={setCurrentPassword}
                      value={currentPassword}
                      placeholder="Current Password"
                      onSubmitEditing={() =>
                        login(currentPassword, parsedCryptoData)
                      }
                    />
                    <Button
                      text={"Login"}
                      onPress={() => login(currentPassword, parsedCryptoData)}
                    ></Button>
                  </>
                )}
                {capsLock && (
                  <Text style={{ color: theme.colors.primary, marginTop: 10 }}>
                    Caps Lock is activated
                  </Text>
                )}
              </>
            )}
          </>
        )}
      </View>
    </Modal>
  );
}

export default ChangeMasterPasswordModal;
