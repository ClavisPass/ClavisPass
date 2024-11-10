import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
    master: string | null;
    login: (user: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
    children: ReactNode
}

export const AuthProvider = ({ children } : Props) => {
    const [master, setMaster] = useState<string | null>(null);

    const login = (master: string) => {
        setMaster(master);
    };

    const logout = () => {
        setMaster(null);
    };
    return (
        <AuthContext.Provider
            value={{ master, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext) as AuthContextType;
};
