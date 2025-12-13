import SessionQrPayload from "../../infrastructure/cloud/model/SessionQrPayload";

function isSessionQrPayload(value: unknown): value is SessionQrPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;

  return (
    v.kind === "clavispass:session" &&
    v.version === 1 &&
    typeof v.provider === "string" &&
    typeof v.refreshToken === "string"
  );
}

export default isSessionQrPayload;
