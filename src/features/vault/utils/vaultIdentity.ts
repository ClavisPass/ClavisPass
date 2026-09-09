import VaultDataType from "../model/VaultDataType";
import createUniqueID from "../../../shared/utils/createUniqueID";

type VaultData = NonNullable<VaultDataType>;

const VAULT_ID_PREFIX = "vault_";

export class VaultIdentityMismatchError extends Error {
  readonly localVaultId: string;
  readonly remoteVaultId: string;

  constructor(localVaultId: string, remoteVaultId: string) {
    super("[VaultIdentity] Local and remote vault IDs do not match.");
    this.name = "VaultIdentityMismatchError";
    this.localVaultId = localVaultId;
    this.remoteVaultId = remoteVaultId;
  }
}

export const createVaultId = () => `${VAULT_ID_PREFIX}${createUniqueID()}`;

export const normalizeVaultId = (vaultId: unknown): string | null =>
  typeof vaultId === "string" && vaultId.trim().length > 0
    ? vaultId.trim()
    : null;

export const ensureVaultId = (
  vault: VaultData,
): { vault: VaultData; changed: boolean } => {
  const vaultId = normalizeVaultId(vault.vaultId);
  if (vaultId) {
    if (vaultId === vault.vaultId) return { vault, changed: false };
    return { vault: { ...vault, vaultId }, changed: true };
  }

  return {
    vault: {
      ...vault,
      vaultId: createVaultId(),
    },
    changed: true,
  };
};

export const resolveMergedVaultId = (
  localVault: VaultData,
  remoteVault: VaultData,
) => {
  const localVaultId = normalizeVaultId(localVault.vaultId);
  const remoteVaultId = normalizeVaultId(remoteVault.vaultId);

  if (localVaultId && remoteVaultId && localVaultId !== remoteVaultId) {
    throw new VaultIdentityMismatchError(localVaultId, remoteVaultId);
  }

  return localVaultId ?? remoteVaultId ?? createVaultId();
};
