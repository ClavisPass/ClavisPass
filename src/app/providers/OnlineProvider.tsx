import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import * as Network from "expo-network";
import { Platform } from "react-native";
import { logger } from "../../infrastructure/logging/logger";
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

  const probeBrowserConnectivity = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined") {
      return true;
    }

    if (!navigator.onLine) {
      return false;
    }

    const probeUrls = [
      "https://www.gstatic.com/generate_204",
      "https://clavispass.github.io/ClavisPass/",
    ];

    for (const url of probeUrls) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      try {
        await fetch(`${url}?_=${Date.now()}`, {
          method: "GET",
          cache: "no-store",
          mode: "no-cors",
          signal: controller.signal,
        });

        return true;
      } catch (error) {
        logger.warn("[OnlineProvider] Browser connectivity probe failed:", {
          url,
          error,
        });
      } finally {
        clearTimeout(timeoutId);
      }
    }

    return false;
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    async function checkNetwork() {
      try {
        if (Platform.OS === "web") {
          const online = await probeBrowserConnectivity();
          setIsCloudOnline(online);
          return;
        }

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
      const handleOnline = () => {
        void checkNetwork();
      };
      const handleOffline = () => setIsCloudOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      void checkNetwork();
      interval = setInterval(checkNetwork, 15000);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        if (interval) clearInterval(interval);
      };
    } else {
      checkNetwork();
      interval = setInterval(checkNetwork, 5000);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [probeBrowserConnectivity]);

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
