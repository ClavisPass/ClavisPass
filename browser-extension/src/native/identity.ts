import type { BridgeClientInfo } from "../shared/bridge";

const INSTANCE_STORAGE_KEY = "clavispass.extension.instanceId";

function createInstanceId(): string {
  return crypto.randomUUID();
}

async function getInstanceId(): Promise<string> {
  const stored = await chrome.storage.local.get(INSTANCE_STORAGE_KEY);
  const existingId = stored[INSTANCE_STORAGE_KEY];

  if (typeof existingId === "string" && existingId.length > 0) {
    return existingId;
  }

  const nextId = createInstanceId();
  await chrome.storage.local.set({ [INSTANCE_STORAGE_KEY]: nextId });
  return nextId;
}

export async function getBridgeClientInfo(): Promise<BridgeClientInfo> {
  const manifest = chrome.runtime.getManifest();

  return {
    extensionId: chrome.runtime.id,
    name: manifest.name,
    version: manifest.version,
    instanceId: await getInstanceId()
  };
}
