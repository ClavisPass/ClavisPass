export const LATEST_VAULT_FORMAT = 3;

export function readVaultVersion(value: unknown): number | null {
  if (typeof value !== "object" || value === null || !("v" in value)) return null;
  return typeof value.v === "number" && Number.isInteger(value.v) ? value.v : null;
}

export function getVaultFormatVersion(content: string): number | null {
  try {
    return readVaultVersion(JSON.parse(content));
  } catch {
    return null;
  }
}
