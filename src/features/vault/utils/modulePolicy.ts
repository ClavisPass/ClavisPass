import ModulesEnum from "../model/ModulesEnum";
import { ModuleType } from "../model/ModulesType";
import ValuesType from "../model/ValuesType";

export type ModuleKind = "meta" | "secret" | "hybrid" | "structured";

export type EntryMeta = {
  id: string;
  title: string;
  fav: boolean;
  pinnedAt?: string | null;
  tags?: string[];
  created: string;
  lastUpdated: string;
  folderId?: string | null;
  externalRefs?: ValuesType["externalRefs"];

  username?: string | null;
  email?: string | null;
  url?: string | null;
  phone?: string | null;
  personName?: string | null;
  address?: string | null;
  company?: string | null;
  creditCard?: string | null;
  document?: string | null;

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
const MANAGED_MODULE_VALUES = new Set(
  Object.values(ModulesEnum).filter((value) => value !== ModulesEnum.UNKNOWN),
);

function isManagedModule(m: unknown): m is ManagedModules {
  return (
    typeof m === "string" && MANAGED_MODULE_VALUES.has(m as ManagedModules)
  );
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
  [ModulesEnum.ADDRESS]: {
    kind: "meta",
    extractMeta: (entry, meta) => {
      const address = firstModule(entry, ModulesEnum.ADDRESS);
      if (!address) return meta;
      const line1 = [address.street1, address.street2]
        .map((part) => (typeof part === "string" ? part.trim() : ""))
        .filter(Boolean)
        .join(" ");
      const line2 = [address.postalCode, address.city]
        .map((part) => (typeof part === "string" ? part.trim() : ""))
        .filter(Boolean)
        .join(" ");
      const value = [line1, line2, address.state, address.country]
        .map((part) => (typeof part === "string" ? part.trim() : ""))
        .filter(Boolean)
        .join("\n");
      return {
        ...meta,
        address: value || null,
      };
    },
  },

  [ModulesEnum.ATTACHMENT]: {
    kind: "structured",
    getSecret: (entry) =>
      entry.modules
        .filter((m) => (m as any).module === ModulesEnum.ATTACHMENT)
        .map((m) => ({
          id: (m as any).id,
          files: (m as any).files ?? [],
        })),
  },

  [ModulesEnum.COMPANY]: {
    kind: "meta",
    extractMeta: (entry, meta) => {
      const company = firstModule(entry, ModulesEnum.COMPANY);
      if (!company) return meta;
      const value = [company.name, company.department, company.jobTitle]
        .map((part) => (typeof part === "string" ? part.trim() : ""))
        .filter(Boolean)
        .join("\n");
      return {
        ...meta,
        company: value || null,
      };
    },
  },

  [ModulesEnum.CREDIT_CARD]: {
    kind: "hybrid",
    extractMeta: (entry, meta) => {
      const card = firstModule(entry, ModulesEnum.CREDIT_CARD);
      if (!card) return meta;
      const value = [card.cardholderName, card.brand, card.bankName]
        .map((part) => (typeof part === "string" ? part.trim() : ""))
        .filter(Boolean)
        .join("\n");
      return {
        ...meta,
        creditCard: value || null,
      };
    },
    getSecret: (entry) =>
      entry.modules
        .filter((m) => (m as any).module === ModulesEnum.CREDIT_CARD)
        .map((m) => ({
          id: (m as any).id,
          cardholderName: (m as any).cardholderName,
          number: (m as any).number,
          brand: (m as any).brand,
          expiryMonth: (m as any).expiryMonth,
          expiryYear: (m as any).expiryYear,
          securityCode: (m as any).securityCode,
          bankName: (m as any).bankName,
          note: (m as any).note,
        })),
  },

  [ModulesEnum.USERNAME]: { kind: "meta", metaKey: "username" },
  [ModulesEnum.E_MAIL]: { kind: "meta", metaKey: "email" },
  [ModulesEnum.URL]: { kind: "meta", metaKey: "url" },
  [ModulesEnum.PHONE_NUMBER]: { kind: "meta", metaKey: "phone" },

  [ModulesEnum.PASSWORD]: { kind: "secret" },
  [ModulesEnum.PERSON]: {
    kind: "meta",
    extractMeta: (entry, meta) => {
      const person = firstModule(entry, ModulesEnum.PERSON);
      if (!person) return meta;
      const personName =
        person.displayName ??
        [person.title, person.firstName, person.middleName, person.lastName]
          .map((part) => (typeof part === "string" ? part.trim() : ""))
          .filter(Boolean)
          .join(" ") ??
        null;
      return {
        ...meta,
        personName: personName || null,
      };
    },
  },
  [ModulesEnum.PIN]: { kind: "secret" },
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
          inputType: (m as any).inputType,
        })),
  },

  [ModulesEnum.DOCUMENT]: {
    kind: "hybrid",
    extractMeta: (entry, meta) => {
      const document = firstModule(entry, ModulesEnum.DOCUMENT);
      if (!document) return meta;
      const value = [document.documentType, document.issuer, document.expiryDate]
        .map((part) => (typeof part === "string" ? part.trim() : ""))
        .filter(Boolean)
        .join("\n");
      return {
        ...meta,
        document: value || null,
      };
    },
    getSecret: (entry) =>
      entry.modules
        .filter((m) => (m as any).module === ModulesEnum.DOCUMENT)
        .map((m) => ({
          id: (m as any).id,
          documentType: (m as any).documentType,
          number: (m as any).number,
          issuer: (m as any).issuer,
          expiryDate: (m as any).expiryDate,
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
    pinnedAt: entry.pinnedAt ?? null,
    tags: entry.tags ?? [],
    created: entry.created,
    lastUpdated: entry.lastUpdated,
    folderId: (entry.folder as any)?.id ?? null,
    externalRefs: entry.externalRefs,
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
  moduleName: ModulesEnum,
): unknown {
  if (!isManagedModule(moduleName)) return null;

  const policy = MODULE_POLICY[moduleName];

  if (policy.getSecret) return policy.getSecret(entry);

  return firstValue(entry, moduleName);
}
