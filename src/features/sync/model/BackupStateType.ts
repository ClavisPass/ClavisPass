type BackupStateType =
  | { status: "loading" }
  | { status: "ready"; content: string; updatedAt?: string }
  | { status: "empty" }
  | { status: "error"; message: string };

export default BackupStateType;
