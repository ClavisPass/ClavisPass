import { useEffect, useRef, useState } from "react";
import AnimatedContainer from "./container/AnimatedContainer";
import CryptoType from "../types/CryptoType";
import { loadBackup } from "../utils/Backup";
import { Icon, Text } from "react-native-paper";
import { View } from "react-native";
import PasswordTextbox from "./PasswordTextbox";
import Logo from "../ui/Logo";
import Button from "./buttons/Button";
import { useTheme } from "../contexts/ThemeProvider";
import { useData } from "../contexts/DataProvider";
import { useAuth } from "../contexts/AuthProvider";
import { DataTypeSchema } from "../types/DataType";
import { decrypt } from "../utils/CryptoLayer";
import { formatDateTime } from "../utils/Timestamp";

function Backup() {
  const [parsedCryptoData, setParsedCryptoData] = useState<CryptoType | null>(
    null
  );

  const auth = useAuth();
  const { theme } = useTheme();
  const { setData, setLastUpdated } = useData();

  const [loading, setLoading] = useState(true);

  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState(false);
  const [autofocus, setAutofocus] = useState(false);
  const textInputRef = useRef<any>(null);
  const [value, setValue] = useState("");

  const fetchBackup = async () => {
    const result = await loadBackup();
    setParsedCryptoData(result);
  };

  useEffect(() => {
    fetchBackup();
  }, []);

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

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <Icon source="cloud-off-outline" color={theme.colors.primary} size={30} />
      {parsedCryptoData ? (
        <>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
            }}
          >
            <Text>
              {"Backup found from: " +
                formatDateTime(parsedCryptoData.lastUpdated)}
            </Text>
            <View style={{ width: "100%" }}>
              <PasswordTextbox
                setCapsLock={setCapsLock}
                textInputRef={textInputRef}
                errorColor={error}
                autofocus={autofocus}
                setValue={setValue}
                value={value}
                placeholder="Enter Password"
                onSubmitEditing={() => login(value, parsedCryptoData)}
              />
            </View>
            <Button
              text={"Login"}
              onPress={() => login(value, parsedCryptoData)}
            ></Button>
            {capsLock && (
              <Text style={{ color: theme.colors.primary, marginTop: 10 }}>
                Caps Lock is activated
              </Text>
            )}
          </View>
        </>
      ) : (
        <>
          <Text>No local Backup found</Text>
        </>
      )}
    </View>
  );
}

export default Backup;
