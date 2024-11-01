import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

import { getData, saveData, removeData } from "../utils/secureStore";
import isDropboxToken from "../utils/regex/isDropboxToken";
import isGoogleDriveToken from "../utils/regex/isGoogleDriveToken";

interface TokenContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  removeToken: () => void;
  tokenType: "Dropbox" | "GoogleDrive" | null;
}

export const TokenContext = createContext<TokenContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const TokenProvider = ({ children }: Props) => {
  const TOKEN_NAME = "ClavisPass-Token";
  const [token, setToken] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<"Dropbox" | "GoogleDrive" | null>(
    null
  );
  const [init, setInit] = useState<boolean>(true);

  const removeToken = async () => {
    setToken(null);
    setTokenType(null);
    try {
      await removeData(TOKEN_NAME);
      console.log("Token aus SecureStore entfernt");
    } catch (error) {
      console.error("Fehler beim Entfernen des Tokens:", error);
    }
  };

  const fetchData = async () => {
    try {
      const value = await getData(TOKEN_NAME);
      setToken(value);
      console.log(value);
      console.log("Token geladen");
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (token) {
      if (isDropboxToken(token)) {
        setTokenType("Dropbox");
      }
      if (isGoogleDriveToken(token)) {
        setTokenType("GoogleDrive");
      }
      saveData(TOKEN_NAME, token)
        .then(() => {
          console.log(token);
          console.log("Token gespeichert");
        })
        .catch((error) =>
          console.error("Fehler beim Speichern des Tokens:", error)
        );
    }

    if (token === null && !init) {
      removeToken();
    }
    setInit(false);
  }, [token]);

  return (
    <TokenContext.Provider value={{ token, setToken, removeToken, tokenType }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  return useContext(TokenContext) as TokenContextType;
};
