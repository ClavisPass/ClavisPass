import { Platform } from "react-native";

import { logger } from "../../logging/logger";
import { triggerGlobalError } from "../../events/errorBus";
import UserInfoType from "../../../features/sync/model/UserInfoType";
import { VaultFetchResult } from "../model/VaultFetchResult";
import type { UploadContent } from "../model/UploadFileParams";

const ensureDesktop = () => {
  if (Platform.OS !== "web") {
    throw new Error("[LocalFile] Local file provider is desktop-only");
  }
};

const getFileName = (path: string) => {
  const normalized = path.replace(/\\/g, "/");
  return normalized.split("/").filter(Boolean).pop() ?? path;
};

export const fetchUserInfo = async (
  path: string,
  setUserInfo: (data: UserInfoType) => void,
  callback?: () => void,
): Promise<void> => {
  setUserInfo({
    username: getFileName(path) || "Local Vault",
    avatar: null,
  });
  callback?.();
};

export const fetchFile = async (path: string): Promise<VaultFetchResult> => {
  try {
    ensureDesktop();
    if (!path) return { status: "not_found" };

    const tauriFs = require("@tauri-apps/plugin-fs");
    const content = await tauriFs.readTextFile(path);

    return {
      status: "ok",
      content,
    };
  } catch (error) {
    logger.error("[LocalFile] Error reading vault file:", error);

    triggerGlobalError?.({
      title: "LocalFile",
      message: "Error reading local vault file.",
      code: "LOCAL_FILE_READ_FAILED",
    });

    return {
      status: "error",
      message: "Local vault file could not be read.",
      cause: error,
    };
  }
};

export const uploadFile = async (
  path: string,
  content: UploadContent,
  onCompleted?: () => void,
): Promise<void> => {
  try {
    ensureDesktop();
    if (!path) throw new Error("[LocalFile] Missing vault file path");

    const tauriFs = require("@tauri-apps/plugin-fs");
    await tauriFs.writeTextFile(path, content);
    onCompleted?.();
  } catch (error) {
    logger.error("[LocalFile] Error writing vault file:", error);

    triggerGlobalError({
      title: "LocalFile",
      message: "Error writing local vault file.",
      code: "LOCAL_FILE_WRITE_FAILED",
    });

    throw new Error("Error writing local vault file");
  }
};

export const pickVaultFile = async (): Promise<string | null> => {
  ensureDesktop();

  const tauriDialog = require("@tauri-apps/plugin-dialog");
  const selected = await tauriDialog.open({
    multiple: false,
    directory: false,
    title: "Load Vault",
    filters: [
      {
        name: "ClavisPass Vault",
        extensions: ["lock", "json"],
      },
    ],
  });

  if (!selected || Array.isArray(selected)) return null;
  return selected;
};
