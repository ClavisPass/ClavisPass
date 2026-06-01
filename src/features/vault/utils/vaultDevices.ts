import type VaultDeviceType from "../model/VaultDeviceType";
import { getDateTime } from "../../../shared/utils/Timestamp";

export type DeviceUiStatus = "new" | "active" | "archived";

export type DeviceUiPolicy = {
  newWindowDays: number;     // e.g. 7
  archiveAfterDays: number;  // e.g. 180
};

export const DEFAULT_DEVICE_UI_POLICY: DeviceUiPolicy = {
  newWindowDays: 7,
  archiveAfterDays: 180,
};

function parseIso(iso: string): number {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

function daysBetween(nowIso: string, pastIso: string): number {
  const now = parseIso(nowIso);
  const past = parseIso(pastIso);
  if (!now || !past) return 0;
  return (now - past) / (1000 * 60 * 60 * 24);
}

function normalizeDeviceIdentityPart(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function hasSameDeviceIdentity(
  left: Pick<VaultDeviceType, "name" | "platform">,
  right: Pick<VaultDeviceType, "name" | "platform">
): boolean {
  return (
    normalizeDeviceIdentityPart(left.name) ===
      normalizeDeviceIdentityPart(right.name) &&
    normalizeDeviceIdentityPart(left.platform) ===
      normalizeDeviceIdentityPart(right.platform)
  );
}

function earliestIso(values: string[]): string {
  return values.reduce((earliest, value) => {
    const currentTime = Date.parse(value);
    const earliestTime = Date.parse(earliest);
    if (!Number.isFinite(currentTime)) return earliest;
    if (!Number.isFinite(earliestTime)) return value;
    return currentTime < earliestTime ? value : earliest;
  });
}

/**
 * UI-only derived status based on timestamps.
 * - archived: lastSeenAt older than archiveAfterDays
 * - new: firstSeenAt within newWindowDays
 * - otherwise: active
 *
 * NOTE: "new" is derived from firstSeenAt to avoid an old device becoming "new" again.
 */
export function deriveDeviceUiStatus(
  d: Pick<VaultDeviceType, "firstSeenAt" | "lastSeenAt">,
  nowIso: string,
  policy: DeviceUiPolicy = DEFAULT_DEVICE_UI_POLICY
): DeviceUiStatus {
  const sinceFirst = daysBetween(nowIso, d.firstSeenAt);
  const sinceLast = daysBetween(nowIso, d.lastSeenAt);

  if (policy.archiveAfterDays > 0 && sinceLast >= policy.archiveAfterDays) {
    return "archived";
  }
  if (policy.newWindowDays > 0 && sinceFirst <= policy.newWindowDays) {
    return "new";
  }
  return "active";
}

/**
 * Persisted upsert: only id/name/platform + firstSeenAt/lastSeenAt.
 * Call this before encrypt/upload so the uploaded vault contains the updated timestamps.
 */
export function upsertVaultDevice(
  devices: VaultDeviceType[] | undefined,
  device: Pick<VaultDeviceType, "id" | "name" | "platform">,
  nowIso: string = getDateTime()
): VaultDeviceType[] {
  const list = devices ?? [];
  const matchingDevices = list.filter(
    (d) => d.id === device.id || hasSameDeviceIdentity(d, device)
  );

  if (matchingDevices.length === 0) {
    return [
      ...list,
      {
        id: device.id,
        name: device.name,
        platform: device.platform,
        firstSeenAt: nowIso,
        lastSeenAt: nowIso,
      },
    ];
  }

  const existing = matchingDevices[0];
  const merged: VaultDeviceType = {
    ...existing,
    id: device.id,
    name: device.name,
    platform: device.platform,
    firstSeenAt: earliestIso(matchingDevices.map((d) => d.firstSeenAt)),
    lastSeenAt: nowIso,
  };

  const next = list.filter(
    (d) => d.id !== device.id && !hasSameDeviceIdentity(d, device)
  );
  return [...next, merged];
}

export function sortByLastSeenDesc(list: VaultDeviceType[]) {
  return [...list].sort((a, b) => {
    const ta = Date.parse(a.lastSeenAt || a.firstSeenAt || "1970-01-01T00:00:00.000Z");
    const tb = Date.parse(b.lastSeenAt || b.firstSeenAt || "1970-01-01T00:00:00.000Z");
    return tb - ta;
  });
}
