import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "../../logging/logger";
import { triggerGlobalError } from "../../events/errorBus";
import UserInfoType from "../../../features/sync/model/UserInfoType";
import { VaultFetchResult } from "../model/VaultFetchResult";
import type { UploadContent } from "../model/UploadFileParams";
import { getDateTime } from "../../../shared/utils/Timestamp";
import { getDesktopDistributionStorageKey } from "../../storage/distributionStorage";

const LOCAL_SYNC_KEY = "LOCAL_SYNC";
const LOCAL_SYNC_METADATA_KEY = "LOCAL_SYNC_METADATA";

const getLocalSyncKey = () => getDesktopDistributionStorageKey(LOCAL_SYNC_KEY);
const getLocalSyncMetadataKey = () =>
  getDesktopDistributionStorageKey(LOCAL_SYNC_METADATA_KEY);

type LocalSyncMetadata = {
  updatedAt?: string;
};

const readLocalSyncMetadata = async (): Promise<LocalSyncMetadata | null> => {
  const raw = await AsyncStorage.getItem(getLocalSyncMetadataKey());
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as LocalSyncMetadata;
    return typeof parsed?.updatedAt === "string" ? parsed : null;
  } catch {
    return null;
  }
};

export const fetchUserInfo = async (
  _token: string,
  setUserInfo: (data: UserInfoType) => void,
  callback?: () => void,
): Promise<void> => {
  setUserInfo(null);
  callback?.();
};

export const fetchFile = async (): Promise<VaultFetchResult> => {
  try {
    const localSyncKey = getLocalSyncKey();
    const data = await AsyncStorage.getItem(localSyncKey);

    if (!data) {
      logger.info(`[LocalSync] No local file found for key "${localSyncKey}"`);
      return { status: "not_found" };
    }

    const metadata = await readLocalSyncMetadata();

    return {
      status: "ok",
      content: data,
      updatedAt: metadata?.updatedAt,
    };
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
  content: UploadContent,
  onCompleted?: () => void,
): Promise<void> => {
  try {
    const toStore =
      typeof content === "string" ? content : JSON.stringify(content);
    const localSyncKey = getLocalSyncKey();
    await AsyncStorage.setItem(localSyncKey, toStore);
    try {
      await AsyncStorage.setItem(
        getLocalSyncMetadataKey(),
        JSON.stringify({
          updatedAt: getDateTime(),
        } satisfies LocalSyncMetadata),
      );
    } catch (metadataError) {
      logger.warn(
        "[LocalSync] Error writing local sync metadata:",
        metadataError,
      );
    }
    onCompleted?.();
  } catch (error) {
    logger.error(
      `[LocalSync] Error writing file "${getLocalSyncKey()}" to local storage:`,
      error,
    );
    triggerGlobalError({
      title: "LocalSync",
      message: "Error writing file to local storage.",
      code: "WRITING_FILE_FAILED",
    });
    throw new Error("Error writing file to local device storage");
  }
};

export const removeFile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(getLocalSyncKey());
    await AsyncStorage.removeItem(getLocalSyncMetadataKey());
  } catch (error) {
    logger.error(
      `[LocalSync] Error removing file "${LOCAL_SYNC_KEY}" from local storage:`,
      error,
    );
    throw new Error("Error removing file from local device storage");
  }
};
