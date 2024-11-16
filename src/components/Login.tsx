import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import UserInfoType from "../types/UserInfoType";
import Button from "./buttons/Button";
import TypeWriterComponent from "./TypeWriter";
import fetchData from "../api/fetchData";
import { useToken } from "../contexts/TokenProvider";
import { ActivityIndicator } from "react-native-paper";
import { View, Text } from "react-native";
import { useData } from "../contexts/DataProvider";
import getEmptyData from "../utils/getEmptyData";
import PasswordTextbox from "./PasswordTextbox";
import CryptoType, { CryptoTypeSchema } from "../types/CryptoType";
import { decrypt } from "../utils/CryptoLayer";
import { DataTypeSchema } from "../types/DataType";
import { useTheme } from "../contexts/ThemeProvider";

type Props = {
  userInfo: UserInfoType;
};

function Login(props: Props) {
  const auth = useAuth();
  const { token, tokenType } = useToken();
  const { theme } = useTheme();
  const { setData } = useData();

  const [parsedCryptoData, setParsedCryptoData] = useState<CryptoType | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [showNewData, setShowNewData] = useState(false);

  const [capsLock, setCapsLock] = useState(false);

  const [error, setError] = useState(false);

  const textInputRef = useRef<any>(null);

  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchData(token, tokenType, "clavispass.lock").then((response) => {
        if (response == null) {
          setShowNewData(true);
        } else {
          console.log(response);
          const parsedCryptoData = CryptoTypeSchema.parse(JSON.parse(response));
          setParsedCryptoData(parsedCryptoData);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
    setLoading(false);
  }, []);

  const login = async () => {
    try {
      if (parsedCryptoData === null) {
        return;
      }
      const decryptedData = decrypt(parsedCryptoData, value);
      const jsonData = JSON.parse(decryptedData);

      const parsedData = DataTypeSchema.parse(jsonData);
      setData(parsedData);
      auth.login(value);
    } catch (error) {
      console.error("Error getting Data:", error);
      textInputRef.current.focus();
      setValue("");
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1000);
    }
  };

  const newMasterPassword = () => {
    if (value === value2 && value !== "" && value2 !== "") {
      setData(getEmptyData());
      auth.login(value);
    } else {
      console.log("Wrong Password");
    }
  };

  return (
    <>
      {loading ? (
        <>
          <ActivityIndicator animating={true} />
          <Text>TTT</Text>
        </>
      ) : (
        <>
          <TypeWriterComponent
            displayName={
              props.userInfo?.username ? props.userInfo.username : ""
            }
          />
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {showNewData ? (
              <>
                <PasswordTextbox
                  autofocus
                  setValue={setValue}
                  value={value}
                  placeholder="New Master Password"
                />
                <PasswordTextbox
                  setValue={setValue2}
                  value={value2}
                  placeholder="Reenter Master Password"
                />
                <Button
                  text={"Set Password"}
                  onPress={newMasterPassword}
                ></Button>
              </>
            ) : (
              <>
                <PasswordTextbox
                  setCapsLock={setCapsLock}
                  textInputRef={textInputRef}
                  errorColor={error}
                  autofocus
                  setValue={setValue}
                  value={value}
                  placeholder="Enter Master Password"
                  onSubmitEditing={login}
                />
                <Button text={"Login"} onPress={login}></Button>
              </>
            )}
            {capsLock && (
              <Text style={{ color: theme.colors.primary, marginTop: 10 }}>
                Caps Lock is activated
              </Text>
            )}
          </View>
        </>
      )}
    </>
  );
}

export default Login;
