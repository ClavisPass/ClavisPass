import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import NetInfo from "@react-native-community/netinfo";
import { Platform } from "react-native";

interface OnlineContextType {
  isOnline: boolean;
}

export const OnlineContext = createContext<OnlineContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const OnlineProvider = ({ children }: Props) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      setIsOnline(navigator.onLine);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    } else {
      const unsubscribe = NetInfo.addEventListener((state) => {
        setIsOnline(!!state.isConnected);
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <OnlineContext.Provider
      value={{
        isOnline,
      }}
    >
      {children}
    </OnlineContext.Provider>
  );
};

export const useOnline = () => {
  return useContext(OnlineContext) as OnlineContextType;
};
