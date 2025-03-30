import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import UserInfoType from "../types/UserInfoType";
import Button from "./buttons/Button";
import TypeWriterComponent from "./TypeWriter";
import fetchData from "../api/fetchData";
import { useToken } from "../contexts/TokenProvider";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";
import { useData } from "../contexts/DataProvider";
import getEmptyData from "../utils/getEmptyData";
import PasswordTextbox from "./PasswordTextbox";
import CryptoType, { CryptoTypeSchema } from "../types/CryptoType";
import { decrypt } from "../utils/CryptoLayer";
import { DataTypeSchema } from "../types/DataType";
import { useTheme } from "../contexts/ThemeProvider";
import { Text } from "react-native-paper";

import {
  authenticateUser,
  isUsingAuthentication,
  loadAuthentication,
} from "../utils/authenticateUser";

type Props = {
  userInfo: UserInfoType;
};

function Login(props: Props) {
  const auth = useAuth();
  const { token, tokenType } = useToken();
  const { theme } = useTheme();
  const { setData, setLastUpdated } = useData();

  const [parsedCryptoData, setParsedCryptoData] = useState<CryptoType | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [showNewData, setShowNewData] = useState(false);

  const [capsLock, setCapsLock] = useState(false);

  const [error, setError] = useState(false);

  const textInputRef = useRef<any>(null);
  const textInput2Ref = useRef<any>(null);
  const textInput3Ref = useRef<any>(null);

  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");

  useEffect(() => {
    isUsingAuthentication().then((isAuthenticated) => {
      if (token && tokenType) {
        setLoading(true);
        fetchData(token, tokenType, "clavispass.lock").then((response) => {
          if (response === null) {
            setShowNewData(true);
            setLoading(false);
          } else {
            const parsedCryptoData = CryptoTypeSchema.parse(
              JSON.parse(response)
            );
            setParsedCryptoData(parsedCryptoData);
            setLoading(false);
            if (isAuthenticated) {
              authenticateUser().then((auth) => {
                if (auth) {
                  loadAuthentication().then((data) => {
                    login(data, parsedCryptoData);
                  });
                }
              });
            }
          }
        });
      }
    });
  }, [token, tokenType]);

  const login = async (value: string, parsedCryptoData: CryptoType | null) => {
    try {
      if (parsedCryptoData === null) {
        return;
      }
      const lastUpdated = parsedCryptoData.lastUpdated;
      const decryptedData = decrypt(parsedCryptoData, value);
      const jsonData = JSON.parse(decryptedData);

      const parsedData = DataTypeSchema.parse(jsonData);
      setData(parsedData);
      setLastUpdated(lastUpdated);
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
        <ActivityIndicator size={"large"} animating={true} />
      ) : (
        <>
          <View style={{ height: 40 }}>
            <TypeWriterComponent
              displayName={
                props.userInfo?.username ? props.userInfo.username : ""
              }
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              width: "100%",
            }}
          >
            {showNewData ? (
              <>
                <PasswordTextbox
                  autofocus
                  textInputRef={textInput2Ref}
                  setCapsLock={setCapsLock}
                  setValue={setValue}
                  value={value}
                  placeholder="New Password"
                  onSubmitEditing={() => {
                    textInput3Ref.current.focus();
                  }}
                />
                <PasswordTextbox
                  textInputRef={textInput3Ref}
                  setCapsLock={setCapsLock}
                  setValue={setValue2}
                  value={value2}
                  placeholder="Confirm Password"
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
                  placeholder="Enter Password"
                  onSubmitEditing={() => login(value, parsedCryptoData)}
                />
                <Button
                  text={"Login"}
                  onPress={() => login(value, parsedCryptoData)}
                ></Button>
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
