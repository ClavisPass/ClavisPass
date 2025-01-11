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
import generateNewToken from "../api/generateNewToken";

interface TokenContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
  removeToken: () => void;
  tokenType: "Dropbox" | "GoogleDrive" | null;
  setTokenType: (tokenType: "Dropbox" | "GoogleDrive" | null) => void;
  loadRefreshToken: () => Promise<string | null>;
  saveRefreshToken: (refreshToken: string) => void;
  renewAccessToken: (refreshToken: string) => Promise<string | null>;
  checkTokenType: (token: string) => "Dropbox" | "GoogleDrive" | null;
}

export const TokenContext = createContext<TokenContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const TokenProvider = ({ children }: Props) => {
  const TOKEN_NAME = "ClavisPass-Token";
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<"Dropbox" | "GoogleDrive" | null>(
    "Dropbox"
  );

  const removeToken = async () => {
    setToken(null);
    setRefreshToken(null);
    //setTokenType(null);
    try {
      await removeData(TOKEN_NAME);
      console.log("Token aus SecureStore entfernt");
    } catch (error) {
      console.error("Fehler beim Entfernen des Tokens:", error);
    }
  };

  const loadRefreshToken = async () => {
    try {
      const value = await getData(TOKEN_NAME);
      setRefreshToken(value ? value : null);
      console.log("Token geladen");
      return value;
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      return null;
    }
  };

  const saveRefreshToken = async (refreshToken: string) => {
    if (refreshToken) {
      /*if (isDropboxToken(refreshToken)) {
        setTokenType("Dropbox");
      }
      if (isGoogleDriveToken(refreshToken)) {
        setTokenType("GoogleDrive");
      }*/
      saveData(TOKEN_NAME, refreshToken)
        .then(() => {
          console.log(refreshToken);
          console.log("Token gespeichert");
        })
        .catch((error) =>
          console.error("Fehler beim Speichern des Tokens:", error)
        );
    }
  };

  const checkTokenType = (token: string) => {
    if (isDropboxToken(token)) {
      return "Dropbox";
    }
    if (isGoogleDriveToken(token)) {
      return "GoogleDrive";
    }
    return null;
  };

  /*useEffect(() => {
    if (refreshToken) {
      if (isDropboxToken(refreshToken)) {
        setTokenType("Dropbox");
        return;
      }
      if (isGoogleDriveToken(refreshToken)) {
        setTokenType("GoogleDrive");
        return;
      }
    }
    setTokenType(null);
  }, [refreshToken]);*/

  const renewAccessToken = async (refreshToken: string) => {
    try {
      const newToken = await generateNewToken(refreshToken);
      console.log("Neuer Token erhalten: ", newToken);
      setToken(newToken.accessToken);
      return newToken.accessToken;
    } catch (error) {
      console.error("Token konnte nicht erneuert werden:", error);
      return null;
    }
  };

  return (
    <TokenContext.Provider
      value={{
        token,
        setToken,
        refreshToken,
        setRefreshToken,
        removeToken,
        tokenType,
        setTokenType,
        loadRefreshToken,
        saveRefreshToken,
        renewAccessToken,
        checkTokenType,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  return useContext(TokenContext) as TokenContextType;
};
