import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

import { getData, saveData, removeData } from "../utils/secureStore";

interface TokenContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  removeToken: () => void;
}

export const TokenContext = createContext<TokenContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const TokenProvider = ({ children }: Props) => {
  const GOOGLE_DRIVE_KEY = "GoogleDrive";
  const [token, setToken] = useState<string | null>(null);

  const [init, setInit] = useState(true);

  // Funktion zum Entfernen des Tokens und aus dem SecureStore löschen
  const removeToken = async () => {
    setToken(null);
    try {
      await removeData(GOOGLE_DRIVE_KEY);
      console.log("Token aus SecureStore entfernt");
    } catch (error) {
      console.error("Fehler beim Entfernen des Tokens:", error);
    }
  };

  const fetchData = async () => {
    try {
      const value = await getData(GOOGLE_DRIVE_KEY);
      setToken(value);
      console.log(value);
      console.log("Token geladen");
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
    }
    setInit(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (init) return;
    if (token) {
      saveData(GOOGLE_DRIVE_KEY, token)
        .then(() => {
          console.log("Token gespeichert");
          fetchData();
        })
        .catch((error) =>
          console.error("Fehler beim Speichern des Tokens:", error)
        );
    } else {
      /*removeData(GOOGLE_DRIVE_KEY)
        .then(() => console.log("Token entfernt"))
        .catch((error) =>
          console.error("Fehler beim Entfernen des Tokens:", error)
        );*/
    }
  }, [token]);
  return (
    <TokenContext.Provider value={{ token, setToken, removeToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  return useContext(TokenContext) as TokenContextType;
};
