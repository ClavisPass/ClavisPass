import { detectTauriEnvironment } from "../../../infrastructure/platform/isTauri";

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
  if (!(await detectTauriEnvironment())) {
    return {
      pending: [] as PendingPairing[],
      paired: [] as PairedClient[],
    };
  }

  const { invoke } = await import("@tauri-apps/api/core");
  const [pending, paired] = await Promise.all([
    invoke<PendingPairing[]>("bridge_list_pending_pairings"),
    invoke<PairedClient[]>("bridge_list_paired_clients"),
  ]);

  return {
    pending: pending ?? [],
    paired: paired ?? [],
  };
}

export async function actOnBrowserExtensionPairing(
  action:
    | "bridge_approve_pairing"
    | "bridge_reject_pairing"
    | "bridge_revoke_pairing",
  item: { extensionId: string; clientInstanceId?: string | null },
) {
  if (!(await detectTauriEnvironment())) {
    return;
  }

  const { invoke } = await import("@tauri-apps/api/core");
  await invoke(action, {
    extensionId: item.extensionId,
    clientInstanceId: item.clientInstanceId ?? null,
  });
}

export function buildBrowserClientKey(
  extensionId: string,
  instanceId?: string | null,
) {
  return `${extensionId}::${instanceId ?? "default"}`;
}
