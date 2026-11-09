import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "../../logging/logger";
import { triggerGlobalError } from "../../events/errorBus";
import UserInfoType from "../../../features/sync/model/UserInfoType";
import { VaultFetchResult } from "../model/VaultFetchResult";
import type { UploadContent } from "../model/UploadFileParams";
import { getDateTime } from "../../../shared/utils/Timestamp";
import { getDesktopDistributionStorageKey } from "../../storage/distributionStorage";
import { getVaultFormatVersion } from "../../crypto/vault/vaultFormatVersion";

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

export function isVersionedRecoveryVault(content: string): boolean {
  return getVaultFormatVersion(content) === 3;
}

let pendingWrite: Promise<unknown> = Promise.resolve();

/** Refresh the local copy only after the provider has accepted the write. */
export async function cacheSyncedVault(
  content: string,
  vaultId: string | undefined,
  previous?: string | null,
): Promise<void> {
  try {
    const current = await fetchFile();
    if (current.status === "error") return;
    const cached = current.status === "ok" ? current.content : null;
    if (cached === content) return;
    if (cached !== null && isVersionedRecoveryVault(cached) && cached !== previous) return;
    await uploadFile(content, undefined, vaultId, cached, cached === previous);
  } catch (error) {
    logger.warn("[LocalSync] Could not update the synced vault cache", error);
  }
}

export function uploadFile(
  content: UploadContent,
  onCompleted?: () => void,
  vaultId?: string,
  expectedContent?: string | null,
  allowRecoveryRemoval = false,
): Promise<void> {
  const next = pendingWrite.then(async () => {
    const current = await fetchFile();
    if (current.status === "error") throw new Error("Cannot check the saved vault");
    const saved = current.status === "ok" ? current.content : null;
    if (expectedContent !== undefined && saved !== expectedContent) {
      throw new Error("The saved vault changed before the write");
    }
    if (saved !== null && isVersionedRecoveryVault(saved) &&
        (expectedContent === undefined ||
          (!allowRecoveryRemoval && !isVersionedRecoveryVault(content)))) {
      throw new Error("A recovery vault requires a checked write and cannot be downgraded");
    }
    await writeFile(content, onCompleted, vaultId);
  });
  pendingWrite = next.catch(() => {});
  return next;
}

const writeFile = async (
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
