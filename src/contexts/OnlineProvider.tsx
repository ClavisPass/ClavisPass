import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import * as Network from "expo-network";
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
    let interval: ReturnType<typeof setInterval> | undefined;

    async function checkNetwork() {
      try {
        const state = await Network.getNetworkStateAsync();
        setIsOnline(!!state.isConnected && state.isInternetReachable !== false);
      } catch (error) {
        console.warn("Network check failed", error);
        setIsOnline(false);
      }
    }

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
      checkNetwork();
      interval = setInterval(checkNetwork, 5000);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, []);

  return (
    <OnlineContext.Provider value={{ isOnline }}>
      {children}
    </OnlineContext.Provider>
  );
};

export const useOnline = () => {
  return useContext(OnlineContext) as OnlineContextType;
};
