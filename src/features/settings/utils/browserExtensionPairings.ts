import { Platform } from "react-native";
import { invoke } from "@tauri-apps/api/core";

export type PendingPairing = {
  extensionId: string;
  clientName?: string | null;
  clientVersion?: string | null;
  clientInstanceId?: string | null;
  requestedAtMs: number;
  lastSeenAtMs: number;
};

export type PairedClient = {
  extensionId: string;
  clientName?: string | null;
  clientVersion?: string | null;
  clientInstanceId?: string | null;
  grantedAtMs: number;
  lastSeenAtMs: number;
  capabilities?: string[];
};

export async function listBrowserExtensionPairings() {
  if (Platform.OS !== "web") {
    return {
      pending: [] as PendingPairing[],
      paired: [] as PairedClient[],
    };
  }

  const [pending, paired] = await Promise.all([
    invoke<PendingPairing[]>("bridge_list_pending_pairings"),
    invoke<PairedClient[]>("bridge_list_paired_clients"),
  ]);

  return {
    pending: pending ?? [],
    paired: paired ?? [],
  };
}

export function buildBrowserClientKey(
  extensionId: string,
  instanceId?: string | null,
) {
  return `${extensionId}::${instanceId ?? "default"}`;
}
