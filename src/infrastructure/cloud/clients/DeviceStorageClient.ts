import AsyncStorage from "@react-native-async-storage/async-storage";
import RemoteFileContent from "../model/RemoteFileContent";
import CryptoType from "../../crypto/CryptoType";
import { logger } from "../../logging/logger";
import { triggerGlobalError } from "../../events/errorBus";
import UserInfoType from "../../../features/sync/model/UserInfoType";
import { VaultFetchResult } from "../model/VaultFetchResult";

const LOCAL_SYNC_KEY = "LOCAL_SYNC";

export const fetchUserInfo = async (
  _token: string,
  setUserInfo: (data: UserInfoType) => void,
  callback?: () => void
): Promise<void> => {
  setUserInfo(null);
  callback?.();
};

export const fetchFile = async (): Promise<VaultFetchResult> => {
  try {
    const data = await AsyncStorage.getItem(LOCAL_SYNC_KEY);

    if (!data) {
      logger.info(`[LocalSync] No local file found for key "${LOCAL_SYNC_KEY}"`);
      return { status: "not_found" };
    }

    return { status: "ok", content: data };
  } catch (error) {
    logger.error("[LocalSync] Error reading file from local storage:", error);

    triggerGlobalError?.({
      title: "LocalSync",
      message: "Error reading file from local storage.",
      code: "READING_FILE_FAILED",
    });

    return {
      status: "error",
      message: "Local storage read error",
      cause: error,
    };
  }
};

export const uploadFile = async (
  content: CryptoType,
  onCompleted?: () => void
): Promise<void> => {
  try {
    await AsyncStorage.setItem(LOCAL_SYNC_KEY, JSON.stringify(content));
    onCompleted?.();
  } catch (error) {
    logger.error(
      `[LocalSync] Error writing file "${LOCAL_SYNC_KEY}" to local storage:`,
      error
    );
    triggerGlobalError({
      title: "LocalSync",
      message: "Error writing file to local storage.",
      code: "WRITING_FILE_FAILED",
    });
    throw new Error("Error writing file to local device storage");
  }
};
