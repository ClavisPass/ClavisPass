import { useEffect, useRef } from "react";

import { useAuth } from "../../../app/providers/AuthProvider";
import { useVault } from "../../../app/providers/VaultProvider";
import ModulesEnum from "../../vault/model/ModulesEnum";
import type ValuesType from "../../vault/model/ValuesType";
import type FolderType from "../../vault/model/FolderType";
import getModuleData from "../../vault/utils/getModuleData";
import createUniqueID from "../../../shared/utils/createUniqueID";
import { getDateTime } from "../../../shared/utils/Timestamp";
import { logger } from "../../../infrastructure/logging/logger";
import { detectTauriEnvironment } from "../../../infrastructure/platform/isTauri";

type BrowserWriteKind = "createEntryFromBrowser" | "updateEntryFromBrowser";

type BrowserWriteRequest = {
  id: string;
  kind: BrowserWriteKind;
  payload: Record<string, unknown>;
};

type CreatePayload = {
  title: string;
  username?: string | null;
  email?: string | null;
  password: string;
  url?: string | null;
  matchedHost?: string | null;
  folderId?: string | null;
  totp?: string | null;
};

type UpdatePayload = {
  entryId: string;
  title?: string | null;
  username?: string | null;
  email?: string | null;
  password: string;
  url?: string | null;
  matchedHost?: string | null;
  totp?: string | null;
};

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function effectiveUrl(url: unknown, matchedHost: unknown): string | null {
  const normalizedUrl = normalizeText(url);
  if (normalizedUrl) return normalizedUrl;

  const host = normalizeText(matchedHost);
  if (!host) return null;
  return `https://${host}`;
}

function pickFolder(
  folders: FolderType[],
  folderId: unknown
): FolderType | null {
  const normalizedFolderId = normalizeText(folderId);
  if (!normalizedFolderId) return null;
  return (
    folders.find((folder) => folder.id === normalizedFolderId) ?? null
  );
}

function upsertSimpleModule(
  modules: ValuesType["modules"],
  moduleName: ModulesEnum,
  value: string | null
) {
  if (!value) return;

  const index = modules.findIndex((module) => module.module === moduleName);
  if (index >= 0) {
    modules[index] = {
      ...modules[index],
      value,
    } as (typeof modules)[number];
    return;
  }

  const moduleData = getModuleData(moduleName);
  modules.push({
    ...moduleData,
    value,
  } as (typeof modules)[number]);
}

function createBrowserEntry(
  payload: CreatePayload,
  folders: FolderType[]
): ValuesType {
  const now = getDateTime();
  const modules: ValuesType["modules"] = [];

  upsertSimpleModule(modules, ModulesEnum.USERNAME, normalizeText(payload.username));
  upsertSimpleModule(modules, ModulesEnum.E_MAIL, normalizeText(payload.email));
  upsertSimpleModule(modules, ModulesEnum.PASSWORD, normalizeText(payload.password));
  upsertSimpleModule(modules, ModulesEnum.URL, effectiveUrl(payload.url, payload.matchedHost));
  upsertSimpleModule(modules, ModulesEnum.TOTP, normalizeText(payload.totp));

  return {
    id: createUniqueID(),
    title: normalizeText(payload.title) ?? normalizeText(payload.matchedHost) ?? "New entry",
    modules,
    folder: pickFolder(folders, payload.folderId),
    fav: false,
    created: now,
    lastUpdated: now,
  };
}

function applyUpdateToEntry(entry: ValuesType, payload: UpdatePayload): ValuesType {
  const modules = [...entry.modules];
  upsertSimpleModule(modules, ModulesEnum.USERNAME, normalizeText(payload.username));
  upsertSimpleModule(modules, ModulesEnum.E_MAIL, normalizeText(payload.email));
  upsertSimpleModule(modules, ModulesEnum.PASSWORD, normalizeText(payload.password));
  upsertSimpleModule(modules, ModulesEnum.URL, effectiveUrl(payload.url, payload.matchedHost));
  upsertSimpleModule(modules, ModulesEnum.TOTP, normalizeText(payload.totp));

  return {
    ...entry,
    title: normalizeText(payload.title) ?? entry.title,
    modules,
    lastUpdated: getDateTime(),
  };
}

function BrowserBridgeWriteSync() {
  const auth = useAuth();
  const vault = useVault();
  const processingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let isTauriRuntime = false;

    const processPendingWrites = async () => {
      if (
        cancelled ||
        !isTauriRuntime ||
        processingRef.current ||
        !auth.isLoggedIn ||
        !vault.isUnlocked
      ) {
        return;
      }

      processingRef.current = true;

      try {
        const { invoke } = await import("@tauri-apps/api/core");
        const requests = await invoke<BrowserWriteRequest[]>(
          "bridge_claim_pending_writes"
        );

        for (const request of requests) {
          try {
            if (request.kind === "createEntryFromBrowser") {
              const entry = createBrowserEntry(
                request.payload as unknown as CreatePayload,
                vault.folders
              );
              vault.upsertEntry(entry);
              await invoke("bridge_complete_write_request", {
                requestId: request.id,
                ok: true,
                result: {
                  entryId: entry.id,
                  title: entry.title,
                  createdAt: entry.created,
                },
              });
              continue;
            }

            if (request.kind === "updateEntryFromBrowser") {
              const payload = request.payload as unknown as UpdatePayload;
              let updateResult:
                | { entryId: string; updatedAt: string; title: string }
                | null = null;

              vault.update((draft) => {
                const index = draft.values.findIndex(
                  (entry) => entry.id === payload.entryId
                );
                if (index < 0) {
                  throw new Error("ENTRY_NOT_FOUND");
                }

                const updatedEntry = applyUpdateToEntry(
                  draft.values[index],
                  payload
                );
                draft.values[index] = updatedEntry;
                updateResult = {
                  entryId: updatedEntry.id,
                  updatedAt: updatedEntry.lastUpdated,
                  title: updatedEntry.title,
                };
              });

              if (!updateResult) {
                throw new Error("WRITE_FAILED");
              }

              await invoke("bridge_complete_write_request", {
                requestId: request.id,
                ok: true,
                result: updateResult,
              });
            }
          } catch (error) {
            const code =
              error instanceof Error && error.message === "ENTRY_NOT_FOUND"
                ? "ENTRY_NOT_FOUND"
                : "WRITE_FAILED";
            const message =
              code === "ENTRY_NOT_FOUND"
                ? "Entry could not be resolved for browser update."
                : "Browser write request could not be applied.";

            await invoke("bridge_complete_write_request", {
              requestId: request.id,
              ok: false,
              errorCode: code,
              errorMessage: message,
            });
          }
        }
      } catch (error) {
        logger.warn("[BrowserBridge] Failed to process browser writes:", error);
      } finally {
        processingRef.current = false;
      }
    };

    void (async () => {
      isTauriRuntime = await detectTauriEnvironment();
      if (!isTauriRuntime || cancelled) {
        return;
      }
      await processPendingWrites();
    })();
    const timer = setInterval(() => {
      void processPendingWrites();
    }, 1200);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [auth.isLoggedIn, vault, vault.isUnlocked, vault.folders]);

  return null;
}

export default BrowserBridgeWriteSync;
