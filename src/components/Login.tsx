import { useEffect, useState } from "react";
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

type Props = {
  userInfo: UserInfoType;
};

function Login(props: Props) {
  const auth = useAuth();
  const { token, tokenType } = useToken();
  const { data, setData } = useData();

  const [parsedCryptoData, setParsedCryptoData] = useState<CryptoType | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [showNewData, setShowNewData] = useState(false);

  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchData(token, tokenType, "clavispass.lock").then((response) => {
        //data.setData(response);
        if (response == null) {
          setShowNewData(true);
        } else {
          console.log(response);
          const parsedCryptoData = CryptoTypeSchema.parse(
            JSON.parse(response)
          );
          setParsedCryptoData(parsedCryptoData);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async () => {
    try {
      if (parsedCryptoData === null) {
        return;
      }
      decrypt(parsedCryptoData, value);
      //auth.login(value);
    } catch (error) {
      console.error("Error getting Data:", error);
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
        <ActivityIndicator animating={true} />
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
                  setValue={setValue}
                  value={value}
                  placeholder="Enter Master Password"
                />
                <Button text={"Login"} onPress={login}></Button>
              </>
            )}
          </View>
        </>
      )}
    </>
  );
}

export default Login;
