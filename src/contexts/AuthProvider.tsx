import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';

interface AuthContextType {
  master: string | null;
  login: (user: string) => void;
  logout: () => void;
  sessionStart: number | null;
  sessionRemaining: number;
}

export const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

const SESSION_LIMIT = 60 * 60 * 1000;

export const AuthProvider = ({ children }: Props) => {
  const [master, setMaster] = useState<string | null>(null);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [sessionRemaining, setSessionRemaining] = useState<number>(SESSION_LIMIT / 1000);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const login = (master: string) => {
    setMaster(master);
    const now = Date.now();
    setSessionStart(now);
    setSessionRemaining(SESSION_LIMIT / 1000);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      logout();
    }, SESSION_LIMIT);
  };

  const logout = () => {
    setMaster(null);
    setSessionStart(null);
    setSessionRemaining(SESSION_LIMIT / 1000);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (master && sessionStart) {
      interval = setInterval(() => {
        const elapsed = Date.now() - sessionStart;
        const remaining = Math.max(0, SESSION_LIMIT - elapsed);
        setSessionRemaining(Math.floor(remaining / 1000));
        if (remaining <= 0) {
          logout();
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [master, sessionStart]);

  return (
    <AuthContext.Provider
      value={{ master, login, logout, sessionStart, sessionRemaining }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext) as AuthContextType;
};
