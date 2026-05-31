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
import { AppState, Platform, View } from "react-native";
import { useSetting } from "./SettingsProvider";
import { initScreenLockLogout } from "../../features/auth/utils/screenLockLogout";
import ScreenLockLogoutController from "../../features/auth/model/ScreenLockLogoutController";
import { clipboardClearScheduler } from "../../infrastructure/clipboard/clipboardClearScheduler";

export interface AuthContextType {
  isLoggedIn: boolean;

  sessionStart: number | null;
  sessionRemaining: number;

  login: (master: string) => void;
  logout: () => void;
  recordActivity: () => void;

  getMaster: () => string | null;
  requireMaster: () => string;

  sessionLimitSeconds: number;
}

export const AuthContext = createContext<AuthContextType | null>(null);
type AuthMasterContextType = {
  isLoggedIn: boolean;
  getMaster: () => string | null;
  requireMaster: () => string;
};

const AuthMasterContext = createContext<AuthMasterContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const masterRef = useRef<string | null>(null);

  const { value: sessionDurationSeconds } = useSetting("SESSION_DURATION");

  const sessionLimitSeconds = useMemo(() => {
    const n = Number(sessionDurationSeconds);
    if (!Number.isFinite(n)) return 60 * 60;
    return Math.max(60, Math.min(24 * 60 * 60, Math.floor(n)));
  }, [sessionDurationSeconds]);

  const sessionLimitMs = sessionLimitSeconds * 1000;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [sessionRemaining, setSessionRemaining] =
    useState<number>(sessionLimitSeconds);

  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLoggedInRef = useRef(false);
  const lastActivityAtRef = useRef<number | null>(null);
  const lastRecordedActivityRef = useRef(0);
  const sessionLimitMsRef = useRef(sessionLimitMs);

  useEffect(() => {
    sessionLimitMsRef.current = sessionLimitMs;
  }, [sessionLimitMs]);

  const clearTimers = useCallback(() => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    masterRef.current = null;
    void clipboardClearScheduler.forceClearSensitive();

    clearTimers();
    isLoggedInRef.current = false;
    lastActivityAtRef.current = null;
    lastRecordedActivityRef.current = 0;

    setIsLoggedIn(false);
    setSessionStart(null);
    setSessionRemaining(sessionLimitSeconds);
  }, [clearTimers, sessionLimitSeconds]);

  const recordActivity = useCallback(() => {
    if (!isLoggedInRef.current) return;

    const now = Date.now();
    if (now - lastRecordedActivityRef.current < 1000) return;

    lastRecordedActivityRef.current = now;
    lastActivityAtRef.current = now;
    setSessionRemaining(sessionLimitSeconds);
  }, [sessionLimitSeconds]);

  const login = useCallback(
    (master: string) => {
      masterRef.current = master;

      const now = Date.now();
      isLoggedInRef.current = true;
      lastActivityAtRef.current = now;
      lastRecordedActivityRef.current = now;

      setIsLoggedIn(true);
      setSessionStart(now);
      setSessionRemaining(sessionLimitSeconds);

      clearTimers();

      tickIntervalRef.current = setInterval(() => {
        const lastActivity = lastActivityAtRef.current;
        if (!lastActivity) return;

        const elapsed = Date.now() - lastActivity;
        const remainingMs = Math.max(0, sessionLimitMsRef.current - elapsed);
        setSessionRemaining(Math.floor(remainingMs / 1000));

        if (remainingMs <= 0) logout();
      }, 1000);
    },
    [clearTimers, logout, sessionLimitSeconds],
  );

  const getMaster = useCallback(() => masterRef.current, []);
  const requireMaster = useCallback(() => {
    const m = masterRef.current;
    if (!m) throw new Error("No master password available (not logged in).");
    return m;
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setSessionRemaining(sessionLimitSeconds);
      return;
    }

    recordActivity();
  }, [isLoggedIn, recordActivity, sessionLimitSeconds]);

  useEffect(() => {
    if (!isLoggedIn) return;

    if (Platform.OS !== "web") {
      return;
    }

    const activityEvents = [
      "pointerdown",
      "keydown",
      "wheel",
      "touchstart",
    ] as const;

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, recordActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, recordActivity);
      });
    };
  }, [isLoggedIn, recordActivity]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active") return;

      const lastActivity = lastActivityAtRef.current;
      if (
        lastActivity &&
        Date.now() - lastActivity >= sessionLimitMsRef.current
      ) {
        logout();
        return;
      }

      recordActivity();
    });

    return () => subscription.remove();
  }, [isLoggedIn, logout, recordActivity]);

  useEffect(() => {
    return () => {
      masterRef.current = null;
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    let controller: ScreenLockLogoutController | null = null;
    let cancelled = false;

    (async () => {
      controller = await initScreenLockLogout({
        onLock: () => {
          if (isLoggedIn) logout();
        },
        oncePerLockCycle: true,
      });

      if (cancelled) controller.dispose();
    })();

    return () => {
      cancelled = true;
      controller?.dispose();
      controller = null;
    };
  }, [isLoggedIn, logout]);

  const value = useMemo<AuthContextType>(
    () => ({
      isLoggedIn,
      sessionStart,
      sessionRemaining,
      login,
      logout,
      recordActivity,
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
      recordActivity,
      getMaster,
      requireMaster,
      sessionLimitSeconds,
    ],
  );

  const masterValue = useMemo<AuthMasterContextType>(
    () => ({
      isLoggedIn,
      getMaster,
      requireMaster,
    }),
    [isLoggedIn, getMaster, requireMaster],
  );

  return (
    <AuthMasterContext.Provider value={masterValue}>
      <AuthContext.Provider value={value}>
        <View
          style={{ flex: 1 }}
          onStartShouldSetResponderCapture={() => {
            recordActivity();
            return false;
          }}
          onMoveShouldSetResponderCapture={() => {
            recordActivity();
            return false;
          }}
        >
          {children}
        </View>
      </AuthContext.Provider>
    </AuthMasterContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const useAuthMaster = (): AuthMasterContextType => {
  const ctx = useContext(AuthMasterContext);
  if (!ctx) {
    throw new Error("useAuthMaster must be used within AuthProvider");
  }
  return ctx;
};
