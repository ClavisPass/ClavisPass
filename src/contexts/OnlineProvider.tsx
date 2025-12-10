import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import * as Network from "expo-network";
import { Platform } from "react-native";
import { logger } from "../utils/logger";
import { useToken } from "./CloudProvider";

interface OnlineContextType {
  /**
   * Raw network status: true if the device has Internet access.
   * (Independent of the selected provider.)
   */
  isCloudOnline: boolean;
}

export const OnlineContext = createContext<OnlineContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const OnlineProvider = ({ children }: Props) => {
  const [isCloudOnline, setIsCloudOnline] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    async function checkNetwork() {
      try {
        const state = await Network.getNetworkStateAsync();
        setIsCloudOnline(
          !!state.isConnected && state.isInternetReachable !== false
        );
      } catch (error) {
        logger.warn("Network check failed", error);
        setIsCloudOnline(false);
      }
    }

    if (Platform.OS === "web") {
      const handleOnline = () => setIsCloudOnline(true);
      const handleOffline = () => setIsCloudOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      setIsCloudOnline(navigator.onLine);

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
    <OnlineContext.Provider value={{ isCloudOnline }}>
      {children}
    </OnlineContext.Provider>
  );
};

export interface UseOnlineResult {
  /**
   * Effective online status for the app:
   *
   * - If provider === "device": always true
   * - Otherwise: equals isCloudOnline
   */
  isOnline: boolean;

  /**
   * Raw network status (is the Internet reachable?),
   * independent of the selected provider.
   */
  isCloudOnline: boolean;
}

/**
 * Hook for online status.
 *
 * - useOnline().isOnline:
 *   - device → always true
 *   - dropbox/googleDrive → depends on network availability
 *
 * - useOnline().isCloudOnline:
 *   - raw network state (connectivity only)
 */
export const useOnline = (): UseOnlineResult => {
  const ctx = useContext(OnlineContext);
  if (!ctx) {
    throw new Error("useOnline must be used within an OnlineProvider");
  }

  const { provider } = useToken();

  const isCloudOnline = ctx.isCloudOnline;
  const isOnline = provider === "device" ? true : isCloudOnline;

  return { isOnline, isCloudOnline };
};
