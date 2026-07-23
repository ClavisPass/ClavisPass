import type { KdbxImportResult } from "./mapKdbxToClavisPass";

export async function importKdbx(): Promise<KdbxImportResult> {
  throw new Error("KeePass KDBX import is only available on desktop.");
}
