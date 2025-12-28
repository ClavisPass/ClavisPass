import createUniqueID from "../../shared/utils/createUniqueID";
import * as store from "../storage/store";

export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await store.get("DEVICE_ID");
  if (typeof existing === "string" && existing.length > 0) return existing;

  const next = createUniqueID();
  await store.set("DEVICE_ID", next);
  return next;
}
