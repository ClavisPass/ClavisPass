import { NativeMessagingClient, NativeMessagingError } from "../native/client";
import type { FillDataResult, GetStatusResult, SearchEntrySuggestion } from "../shared/bridge";
import type { DesktopBridgeStatusView } from "../shared/types";

const PAIRING_STORAGE_KEY = "clavispass.desktop.pairingStatus";

async function getStoredPairingStatus() {
  const stored = await chrome.storage.local.get(PAIRING_STORAGE_KEY);
  const status = stored[PAIRING_STORAGE_KEY];
  return status === "paired" || status === "pending" || status === "unpaired"
    ? status
    : "unpaired";
}

function normalizeSuggestions(items: unknown): SearchEntrySuggestion[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({
      entryId: typeof item.entryId === "string" ? item.entryId : typeof item.id === "string" ? item.id : "",
      title: typeof item.title === "string" ? item.title : "Untitled entry",
      fav: Boolean(item.fav),
      folderId: typeof item.folderId === "string" ? item.folderId : undefined,
      username: typeof item.username === "string" ? item.username : undefined,
      email: typeof item.email === "string" ? item.email : undefined,
      hasPassword: Boolean(item.hasPassword),
      hasTotp: Boolean(item.hasTotp),
      matchedHost: typeof item.matchedHost === "string" ? item.matchedHost : undefined
    }))
    .filter((item) => item.entryId.length > 0);
}

function normalizeFillData(result: FillDataResult): FillDataResult {
  return {
    entryId: result.entryId,
    title: result.title,
    username: result.username,
    password: result.password,
    totp: result.totp
  };
}

function deriveAppState(result: GetStatusResult): DesktopBridgeStatusView["appState"] {
  return result.ready ? "ready" : "locked";
}

function normalizeDesktopStatus(result: GetStatusResult): DesktopBridgeStatusView {
  const appState = deriveAppState(result);
  const shared = {
    transport: "native-messaging" as const,
    pairingStatus: result.pairingStatus,
    appState,
    appVersion: result.appVersion,
    hostVersion:
      typeof result.protocolVersion === "number"
        ? `protocol ${result.protocolVersion}`
        : undefined,
    desktopName: result.hostName || "ClavisPass"
  };

  if (result.pairingStatus === "unpaired") {
    return {
      ...shared,
      state: "unpaired",
      label: "Desktop App Reachable",
      detail: "Pairing required before ClavisPass can exchange secure data."
    };
  }

  if (result.pairingStatus === "pending") {
    return {
      ...shared,
      state: "pending",
      label: "Pairing Pending",
      detail: "Approve the connection in the ClavisPass desktop app."
    };
  }

  if (!result.ready) {
    return {
      ...shared,
      state: "locked",
      label: "Desktop App Locked",
      detail: "Unlock the ClavisPass desktop app to continue."
    };
  }

  return {
    ...shared,
    state: "ready",
    label: "Desktop Bridge Ready",
    detail: "Native messaging is connected and ClavisPass is ready."
  };
}

export class DesktopBridgeService {
  constructor(private readonly client: NativeMessagingClient = new NativeMessagingClient()) {}

  async getDesktopBridgeStatus(): Promise<DesktopBridgeStatusView> {
    const pairingStatus = await getStoredPairingStatus();

    try {
      const result = await this.client.request("getStatus", undefined, { status: pairingStatus });
      await chrome.storage.local.set({ [PAIRING_STORAGE_KEY]: result.pairingStatus });
      return normalizeDesktopStatus(result);
    } catch (error) {
      const bridgeError = error instanceof NativeMessagingError ? error.bridgeError : undefined;

      if (bridgeError?.code === "protocol_error") {
        return {
          transport: "native-messaging",
          state: "protocol_error",
          label: "Protocol Error",
          detail: "Desktop app answered with an unexpected native messaging payload.",
          lastError: bridgeError
        };
      }

      return {
        transport: "native-messaging",
        state: "host_unreachable",
        label: "Desktop App Unreachable",
        detail: "Native host could not be reached. Make sure ClavisPass desktop is running and its host is registered.",
        lastError: bridgeError
      };
    }
  }

  async searchDesktopEntriesByDomain(domain: string): Promise<SearchEntrySuggestion[]> {
    const pairingStatus = await getStoredPairingStatus();
    const result = await this.client.request("searchEntriesByDomain", { domain }, { status: pairingStatus });
    return normalizeSuggestions(result);
  }

  async getDesktopFillData(entryId: string): Promise<FillDataResult> {
    const pairingStatus = await getStoredPairingStatus();
    const result = await this.client.request("getFillDataForEntry", { entryId }, { status: pairingStatus });
    return normalizeFillData(result);
  }
}
