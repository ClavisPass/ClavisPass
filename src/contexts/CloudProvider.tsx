import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

import { getData, saveData, removeData } from "../utils/secureStore";
import { refreshAccessToken } from "../api/CloudStorageClient";
import Provider from "../types/api/Provider";
import { logger } from "../utils/logger";

type StoredAuth = {
  provider: Provider;
  refreshToken: string;
};

const STORAGE_KEY = "ClavisPass-Auth";

interface TokenContextValue {
  provider: Provider;
  setProvider: (provider: Provider) => void;

  accessToken: string | null;
  refreshToken: string | null;

  /**
   * Setzt / aktualisiert die komplette Session nach einem Login/OAuth-Flow.
   * Kannst du direkt mit der OAuth-Antwort aufrufen.
   */
  setSession: (session: {
    provider: Provider;
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
  }) => Promise<void>;

  /**
   * Löscht alle Token + SecureStore-Eintrag.
   */
  clearSession: () => Promise<void>;

  /**
   * Stellt sicher, dass ein frisches Access-Token vorhanden ist.
   * Gibt das aktuelle (ggf. erneuerte) Access-Token zurück.
   */
  ensureFreshAccessToken: () => Promise<string | null>;

  /**
   * Optional (z.B. für UI):
   * Zeitpunkt, wann das Access-Token abläuft (Unix-Timestamp ms).
   */
  accessTokenExpiresAt: number | null;

  /**
   * Ob die Initial-Ladung aus dem SecureStore noch läuft.
   */
  isInitializing: boolean;
}

const TokenContext = createContext<TokenContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export const CloudProvider = ({ children }: Props) => {
  const [provider, setProvider] = useState<Provider>("device");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessTokenExpiresAt, setAccessTokenExpiresAt] = useState<
    number | null
  >(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const loadStoredAuth = useCallback(async () => {
    try {
      const raw = await getData(STORAGE_KEY);
      if (!raw) {
        setIsInitializing(false);
        return;
      }
      let parsed: StoredAuth | null = null;

      try {
        parsed = JSON.parse(raw) as StoredAuth;
      } catch {
        parsed = null;
      }

      if (parsed && parsed.refreshToken && parsed.provider) {
        setProvider(parsed.provider);
        setRefreshToken(parsed.refreshToken);
      } else {
        setRefreshToken(raw);
      }
    } catch (error) {
      logger.error("[TokenContext] Fehler beim Laden aus SecureStore:", error);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const persistRefreshToken = useCallback(
    async (
      refreshTokenValue: string | null,
      providerValue: Provider | null
    ) => {
      try {
        if (!refreshTokenValue || !providerValue) {
          await removeData(STORAGE_KEY);
          return;
        }

        const stored: StoredAuth = {
          provider: providerValue,
          refreshToken: refreshTokenValue,
        };

        await saveData(STORAGE_KEY, JSON.stringify(stored));
      } catch (error) {
        logger.error(
          "[TokenContext] Fehler beim Speichern im SecureStore:",
          error
        );
      }
    },
    []
  );

  const setSession = useCallback(
    async (session: {
      provider: Provider;
      accessToken: string;
      refreshToken: string;
      expiresIn?: number;
    }) => {
      setProvider(session.provider);
      setAccessToken(session.accessToken);
      setRefreshToken(session.refreshToken);

      if (session.expiresIn) {
        const expiresAt =
          Date.now() + Math.max(session.expiresIn - 60, 30) * 1000;
        setAccessTokenExpiresAt(expiresAt);
      } else {
        setAccessTokenExpiresAt(null);
      }

      await persistRefreshToken(session.refreshToken, session.provider);
    },
    [persistRefreshToken]
  );

  const clearSession = useCallback(async () => {
    setProvider("device");
    setAccessToken(null);
    setRefreshToken(null);
    setAccessTokenExpiresAt(null);

    try {
      await removeData(STORAGE_KEY);
    } catch (error) {
      logger.error(
        "[TokenContext] Fehler beim Entfernen aus SecureStore:",
        error
      );
    }
  }, []);

  const performTokenRefresh = useCallback(async (): Promise<string | null> => {
    if (!provider || !refreshToken) {
      logger.warn(
        "[TokenContext] Kein Provider oder Refresh-Token für Refresh vorhanden."
      );
      return null;
    }

    try {
      const result = await refreshAccessToken({
        provider,
        refreshToken,
      });

      setAccessToken(result.accessToken);

      if (result.expiresIn) {
        const expiresAt =
          Date.now() + Math.max(result.expiresIn - 60, 30) * 1000;
        setAccessTokenExpiresAt(expiresAt);
      } else {
        setAccessTokenExpiresAt(null);
      }

      // Manche Provider geben im Refresh ggf. ein neues Refresh-Token zurück:
      // Wenn du das nutzen willst, kannst du hier result.refreshToken o.ä. behandeln.
      // Wir gehen in deinem bisherigen Setup davon aus, dass sich das Refresh-Token
      // meistens nicht ändert. Wenn doch, hier entsprechend updaten & persistieren.

      await persistRefreshToken(refreshToken, provider);

      return result.accessToken;
    } catch (error) {
      logger.error("[TokenContext] Fehler beim Token-Refresh:", error);
      return null;
    }
  }, [provider, refreshToken, persistRefreshToken]);

  /**
   * Stellt sicher, dass ein valides Access-Token vorhanden ist.
   * - Wenn keins existiert: versucht, über Refresh-Token ein Neues zu holen.
   * - Wenn eins existiert, aber "bald" abläuft: ebenfalls Refresh.
   * - Sonst: gibt das aktuelle Access-Token zurück.
   */
  const ensureFreshAccessToken = useCallback(async (): Promise<
    string | null
  > => {
    if (!refreshToken || !provider) {
      return accessToken;
    }

    const now = Date.now();

    if (!accessToken || (accessTokenExpiresAt && accessTokenExpiresAt <= now)) {
      // Abgelaufen oder gar keins -> Refresh
      return await performTokenRefresh();
    }

    // Noch gültig -> zurückgeben
    return accessToken;
  }, [
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    provider,
    performTokenRefresh,
  ]);

  useEffect(() => {
    if (!refreshToken || !provider || !accessTokenExpiresAt) {
      return;
    }

    const now = Date.now();
    const msUntilExpiry = accessTokenExpiresAt - now;

    if (msUntilExpiry <= 0) {
      // Sicherheitshalber direkt refreshen
      performTokenRefresh();
      return;
    }

    const id = setTimeout(() => {
      performTokenRefresh();
    }, msUntilExpiry);

    return () => clearTimeout(id);
  }, [accessTokenExpiresAt, refreshToken, provider, performTokenRefresh]);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const value: TokenContextValue = {
    provider,
    setProvider,
    accessToken,
    refreshToken,
    setSession,
    clearSession,
    ensureFreshAccessToken,
    accessTokenExpiresAt,
    isInitializing,
  };

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
};

export const useToken = (): TokenContextValue => {
  const ctx = useContext(TokenContext);
  if (!ctx) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return ctx;
};
