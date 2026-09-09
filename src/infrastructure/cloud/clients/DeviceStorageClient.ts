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
const ACTIVE_LOCAL_VAULT_ID_KEY = "ACTIVE_LOCAL_VAULT_ID";

const getLocalSyncKey = () => getDesktopDistributionStorageKey(LOCAL_SYNC_KEY);
const getVaultLocalSyncKey = (vaultId: string) =>
  getDesktopDistributionStorageKey(`${LOCAL_SYNC_KEY}:${vaultId}`);
const getLocalSyncMetadataKey = () =>
  getDesktopDistributionStorageKey(LOCAL_SYNC_METADATA_KEY);
const getVaultLocalSyncMetadataKey = (vaultId: string) =>
  getDesktopDistributionStorageKey(`${LOCAL_SYNC_METADATA_KEY}:${vaultId}`);
const getActiveLocalVaultIdKey = () =>
  getDesktopDistributionStorageKey(ACTIVE_LOCAL_VAULT_ID_KEY);

type LocalSyncMetadata = {
  updatedAt?: string;
};

const readLocalSyncMetadata = async (
  metadataKey = getLocalSyncMetadataKey(),
): Promise<LocalSyncMetadata | null> => {
  const raw = await AsyncStorage.getItem(metadataKey);
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
    const activeVaultId = await AsyncStorage.getItem(
      getActiveLocalVaultIdKey(),
    );
    const localSyncKey = activeVaultId
      ? getVaultLocalSyncKey(activeVaultId)
      : getLocalSyncKey();
    const data = await AsyncStorage.getItem(localSyncKey);

    if (!data) {
      if (activeVaultId) {
        const legacyData = await AsyncStorage.getItem(getLocalSyncKey());
        if (legacyData) {
          const metadata = await readLocalSyncMetadata();
          return {
            status: "ok",
            content: legacyData,
            updatedAt: metadata?.updatedAt,
          };
        }
      }

      logger.info(`[LocalSync] No local file found for key "${localSyncKey}"`);
      return { status: "not_found" };
    }

    const metadata = await readLocalSyncMetadata(
      activeVaultId ? getVaultLocalSyncMetadataKey(activeVaultId) : undefined,
    );

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
  vaultId?: string,
): Promise<void> => {
  try {
    const toStore =
      typeof content === "string" ? content : JSON.stringify(content);
    const localSyncKey = getLocalSyncKey();
    const vaultLocalSyncKey = vaultId ? getVaultLocalSyncKey(vaultId) : null;

    await AsyncStorage.setItem(localSyncKey, toStore);
    if (vaultId && vaultLocalSyncKey) {
      await AsyncStorage.setItem(vaultLocalSyncKey, toStore);
      await AsyncStorage.setItem(getActiveLocalVaultIdKey(), vaultId);
    }

    try {
      const metadata = JSON.stringify({
        updatedAt: getDateTime(),
      } satisfies LocalSyncMetadata);
      await AsyncStorage.setItem(getLocalSyncMetadataKey(), metadata);
      if (vaultId) {
        await AsyncStorage.setItem(
          getVaultLocalSyncMetadataKey(vaultId),
          metadata,
        );
      }
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
    const activeVaultId = await AsyncStorage.getItem(
      getActiveLocalVaultIdKey(),
    );
    if (activeVaultId) {
      await AsyncStorage.removeItem(getVaultLocalSyncKey(activeVaultId));
      await AsyncStorage.removeItem(
        getVaultLocalSyncMetadataKey(activeVaultId),
      );
      await AsyncStorage.removeItem(getActiveLocalVaultIdKey());
    }
  } catch (error) {
    logger.error(
      `[LocalSync] Error removing file "${LOCAL_SYNC_KEY}" from local storage:`,
      error,
    );
    throw new Error("Error removing file from local device storage");
  }
};
