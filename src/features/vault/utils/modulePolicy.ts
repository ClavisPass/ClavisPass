import ModulesEnum from "../model/ModulesEnum";
import { ModuleType } from "../model/ModulesType";
import ValuesType from "../model/ValuesType";

export type ModuleKind = "meta" | "secret" | "hybrid" | "structured";

export type EntryMeta = {
  id: string;
  title: string;
  fav: boolean;
  created: string;
  lastUpdated: string;
  folderId?: string | null;

  username?: string | null;
  email?: string | null;
  url?: string | null;
  phone?: string | null;

  wifiName?: string | null;
  wifiType?: "WEP" | "WPA" | "blank" | null;
};

type MetaExtractor = (entry: ValuesType, meta: EntryMeta) => EntryMeta;
type SecretGetter = (entry: ValuesType) => unknown;

export type ModulePolicy = {
  kind: ModuleKind;

  // Simple meta mapping: module.value -> meta[metaKey]
  metaKey?: keyof EntryMeta;

  // Complex meta extraction (e.g. WIFI)
  extractMeta?: MetaExtractor;

  // Secret getter for hybrid/structured/special cases
  getSecret?: SecretGetter;
};

type ManagedModules = Exclude<ModulesEnum, ModulesEnum.UNKNOWN>;

function isManagedModule(m: ModulesEnum): m is ManagedModules {
  return m !== ModulesEnum.UNKNOWN;
}

function firstModule(entry: ValuesType, moduleName: ModulesEnum): any | null {
  return (
    (entry.modules.find((m) => (m as any).module === moduleName) as any) ?? null
  );
}

function firstValue(entry: ValuesType, moduleName: ModulesEnum): string | null {
  const m = firstModule(entry, moduleName);
  return (m?.value ?? null) as string | null;
}

export const MODULE_POLICY: Record<ManagedModules, ModulePolicy> = {
  [ModulesEnum.USERNAME]: { kind: "meta", metaKey: "username" },
  [ModulesEnum.E_MAIL]: { kind: "meta", metaKey: "email" },
  [ModulesEnum.URL]: { kind: "meta", metaKey: "url" },
  [ModulesEnum.PHONE_NUMBER]: { kind: "meta", metaKey: "phone" },

  [ModulesEnum.PASSWORD]: { kind: "secret" },
  [ModulesEnum.NOTE]: { kind: "secret" },
  [ModulesEnum.KEY]: { kind: "secret" },
  [ModulesEnum.TOTP]: { kind: "secret" },

  [ModulesEnum.RECOVERY_CODES]: { kind: "structured" },

  [ModulesEnum.CUSTOM_FIELD]: {
    kind: "structured",
    getSecret: (entry) =>
      entry.modules
        .filter((m) => (m as any).module === ModulesEnum.CUSTOM_FIELD)
        .map((m) => ({
          id: (m as any).id,
          title: (m as any).title,
          value: (m as any).value,
        })),
  },

  [ModulesEnum.WIFI]: {
    kind: "hybrid",
    extractMeta: (entry, meta) => {
      const wifi = firstModule(entry, ModulesEnum.WIFI);
      if (!wifi) return meta;
      return {
        ...meta,
        wifiName: wifi.wifiName ?? null,
        wifiType: wifi.wifiType ?? null,
      };
    },
    getSecret: (entry) => {
      const wifi = firstModule(entry, ModulesEnum.WIFI);
      return wifi?.value ?? null;
    },
  },

  [ModulesEnum.EXPIRY]: { kind: "meta" },
  [ModulesEnum.TASK]: { kind: "meta" },
  [ModulesEnum.TITLE]: { kind: "meta" },
  [ModulesEnum.DIGITAL_CARD]: { kind: "meta" },
};

export function buildEntryMeta(entry: ValuesType): EntryMeta {
  let meta: EntryMeta = {
    id: entry.id,
    title: entry.title,
    fav: entry.fav,
    created: entry.created,
    lastUpdated: entry.lastUpdated,
    folderId: (entry.folder as any)?.id ?? null,
  };

  for (const mod of entry.modules as ModuleType[]) {
    const moduleName = (mod as any).module as ModulesEnum;

    // UNKNOWN (oder ungültige Daten) ignorieren
    if (!isManagedModule(moduleName)) continue;

    const policy = MODULE_POLICY[moduleName];

    if ("metaKey" in policy && policy.metaKey) {
      const v = (mod as any).value ?? null;
      meta = { ...meta, [policy.metaKey]: v };
    }

    if ("extractMeta" in policy && policy.extractMeta) {
      meta = policy.extractMeta(entry, meta);
    }
  }

  return meta;
}

/**
 * Returns secret payload for a module.
 * - string for most classic modules (PASSWORD/NOTE/KEY/TOTP/WIFI)
 * - array/object for structured modules (CUSTOM_FIELD, RECOVERY_CODES)
 * - null for unknown modules (secure default)
 */
export function getSecretFor(
  entry: ValuesType,
  moduleName: ModulesEnum
): unknown {
  if (!isManagedModule(moduleName)) return null;

  const policy = MODULE_POLICY[moduleName];

  if (policy.getSecret) return policy.getSecret(entry);

  return firstValue(entry, moduleName);
}
