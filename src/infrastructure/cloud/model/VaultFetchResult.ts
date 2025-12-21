export type VaultFetchResult =
  | { status: "ok"; content: string }
  | { status: "not_found" }
  | { status: "error"; message: string; cause?: unknown };