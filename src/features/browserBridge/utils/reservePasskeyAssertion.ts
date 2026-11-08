import ModulesEnum from "../../vault/model/ModulesEnum";
import type ValuesType from "../../vault/model/ValuesType";
import type PasskeyModuleType from "../../vault/model/modules/PasskeyModuleType";

export type ReservePasskeyAssertionPayload = {
  entryId: string;
  moduleId?: string | null;
  relyingPartyId: string;
  credentialId: string;
  minimumSignCount: number;
};

function validCounter(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 0xffffffff;
}

function normalizeRpId(value: string): string {
  return value.trim().replace(/\.$/, "").toLowerCase();
}

function normalizeCredentialId(value: string): string {
  return value.trim().replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function reservePasskeyAssertion(
  entry: ValuesType,
  payload: ReservePasskeyAssertionPayload,
  issuedAt: string,
): { entry: ValuesType; signCount: number } {
  if (entry.id !== payload.entryId || !validCounter(payload.minimumSignCount)) {
    throw new Error("INVALID_PAYLOAD");
  }

  const matches = entry.modules.filter((module): module is PasskeyModuleType =>
    module.module === ModulesEnum.PASSKEY &&
    (!payload.moduleId || module.id === payload.moduleId) &&
    "credentialId" in module && typeof module.credentialId === "string" &&
    normalizeCredentialId(module.credentialId) === payload.credentialId &&
    "relyingPartyId" in module && typeof module.relyingPartyId === "string" &&
    normalizeRpId(module.relyingPartyId) === normalizeRpId(payload.relyingPartyId),
  );
  if (matches.length !== 1) throw new Error("PASSKEY_NOT_FOUND");

  const passkey = matches[0];
  const current = passkey.signCount ?? 0;
  if (!validCounter(current)) throw new Error("INVALID_SIGN_COUNT");
  const previous = Math.max(current, payload.minimumSignCount);
  if (previous === 0xffffffff) throw new Error("SIGN_COUNT_EXHAUSTED");
  // Zero-counter credentials remain counterless, including synced passkeys.
  const signCount = previous === 0 ? 0 : previous + 1;

  return {
    signCount,
    entry: {
      ...entry,
      lastUpdated: issuedAt,
      modules: entry.modules.map((module) => module === passkey
        ? { ...passkey, signCount, lastUsedAt: issuedAt }
        : module),
    },
  };
}
