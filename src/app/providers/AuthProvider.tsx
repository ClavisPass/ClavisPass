import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useSetting } from "./SettingsProvider";

export interface AuthContextType {
  isLoggedIn: boolean;

  sessionStart: number | null;
  sessionRemaining: number;

  login: (master: string) => void;
  logout: () => void;

  getMaster: () => string | null;
  requireMaster: () => string;

  sessionLimitSeconds: number;
}

export const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const masterRef = useRef<string | null>(null);

  // NEW: Session-Dauer aus Settings (Sekunden)
  const { value: sessionDurationSeconds } = useSetting("SESSION_DURATION");

  // Guardrails
  const sessionLimitSeconds = useMemo(() => {
    const n = Number(sessionDurationSeconds);
    if (!Number.isFinite(n)) return 60 * 60;
    // Minimum 60s, Maximum z.B. 24h (optional)
    return Math.max(60, Math.min(24 * 60 * 60, Math.floor(n)));
  }, [sessionDurationSeconds]);

  const sessionLimitMs = sessionLimitSeconds * 1000;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [sessionRemaining, setSessionRemaining] = useState<number>(
    sessionLimitSeconds
  );

  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sessionStartRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    masterRef.current = null;

    clearTimers();
    sessionStartRef.current = null;

    setIsLoggedIn(false);
    setSessionStart(null);
    setSessionRemaining(sessionLimitSeconds);
  }, [clearTimers, sessionLimitSeconds]);

  const login = useCallback(
    (master: string) => {
      masterRef.current = master;

      const now = Date.now();
      sessionStartRef.current = now;

      setIsLoggedIn(true);
      setSessionStart(now);
      setSessionRemaining(sessionLimitSeconds);

      clearTimers();

      // Hard logout timer
      logoutTimerRef.current = setTimeout(() => {
        logout();
      }, sessionLimitMs);

      // 1s ticker for UI countdown
      tickIntervalRef.current = setInterval(() => {
        const start = sessionStartRef.current;
        if (!start) return;

        const elapsed = Date.now() - start;
        const remainingMs = Math.max(0, sessionLimitMs - elapsed);
        setSessionRemaining(Math.floor(remainingMs / 1000));

        if (remainingMs <= 0) logout();
      }, 1000);
    },
    [clearTimers, logout, sessionLimitMs, sessionLimitSeconds]
  );

  const getMaster = useCallback(() => masterRef.current, []);
  const requireMaster = useCallback(() => {
    const m = masterRef.current;
    if (!m) throw new Error("No master password available (not logged in).");
    return m;
  }, []);

  // Wenn User NICHT eingeloggt ist und Setting ändert:
  // Countdown-Default aktualisieren (kein Überraschungseffekt während aktiver Session)
  useEffect(() => {
    if (!isLoggedIn) setSessionRemaining(sessionLimitSeconds);
  }, [isLoggedIn, sessionLimitSeconds]);

  useEffect(() => {
    return () => {
      masterRef.current = null;
      clearTimers();
    };
  }, [clearTimers]);

  const value = useMemo<AuthContextType>(
    () => ({
      isLoggedIn,
      sessionStart,
      sessionRemaining,
      login,
      logout,
      getMaster,
      requireMaster,
      sessionLimitSeconds,
    }),
    [
      isLoggedIn,
      sessionStart,
      sessionRemaining,
      login,
      logout,
      getMaster,
      requireMaster,
      sessionLimitSeconds,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
