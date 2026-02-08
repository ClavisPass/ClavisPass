import CryptoType from "../../../infrastructure/crypto/legacy/CryptoType";

type BackupStateType =
  | { status: "loading" }
  | { status: "ready"; crypto: CryptoType }
  | { status: "empty" }
  | { status: "error"; message: string };

export default BackupStateType;
