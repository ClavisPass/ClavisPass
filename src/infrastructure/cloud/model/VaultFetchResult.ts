export type VaultSnapshot =
  | { status: "ok"; content: string; updatedAt?: string; revision?: string }
  | { status: "not_found" };

export type VaultFetchResult =
  | VaultSnapshot
  | { status: "error"; message: string; cause?: unknown };
