export type VaultFetchResult =
  | { status: "ok"; content: string; updatedAt?: string }
  | { status: "not_found" }
  | { status: "error"; message: string; cause?: unknown };
