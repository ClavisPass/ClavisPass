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

const SESSION_LIMIT_MS = 60 * 60 * 1000;

export interface AuthContextType {
  // Status
  isLoggedIn: boolean;

  // Session
  sessionStart: number | null;
  sessionRemaining: number; // seconds remaining

  // Auth actions
  login: (master: string) => void;
  logout: () => void;

  // Secret access (not reactive)
  getMaster: () => string | null;
  requireMaster: () => string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const masterRef = useRef<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [sessionRemaining, setSessionRemaining] = useState<number>(
    Math.floor(SESSION_LIMIT_MS / 1000)
  );

  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    // Clear secret first
    masterRef.current = null;

    clearTimers();
    setIsLoggedIn(false);
    setSessionStart(null);
    setSessionRemaining(Math.floor(SESSION_LIMIT_MS / 1000));
  }, [clearTimers]);

  const login = useCallback(
    (master: string) => {
      masterRef.current = master;

      const now = Date.now();
      setIsLoggedIn(true);
      setSessionStart(now);
      setSessionRemaining(Math.floor(SESSION_LIMIT_MS / 1000));

      clearTimers();

      // 1) Hard logout timer
      logoutTimerRef.current = setTimeout(() => {
        logout();
      }, SESSION_LIMIT_MS);

      // 2) 1s ticker for UI countdown
      tickIntervalRef.current = setInterval(() => {
        const start = now;
        const elapsed = Date.now() - start;
        const remainingMs = Math.max(0, SESSION_LIMIT_MS - elapsed);
        setSessionRemaining(Math.floor(remainingMs / 1000));
        if (remainingMs <= 0) {
          logout();
        }
      }, 1000);
    },
    [clearTimers, logout]
  );

  const getMaster = useCallback(() => masterRef.current, []);
  const requireMaster = useCallback(() => {
    const m = masterRef.current;
    if (!m) throw new Error("No master password available (not logged in).");
    return m;
  }, []);

  // Safety: cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear secret and timers
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
    }),
    [isLoggedIn, sessionStart, sessionRemaining, login, logout, getMaster, requireMaster]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};