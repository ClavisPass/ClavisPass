import AsyncStorage from "@react-native-async-storage/async-storage";
import ModulesEnum from "../enums/ModulesEnum"; // <-- [NEW] für das Favorites-Array

type EnumDef<V extends readonly string[], D extends V[number]> = {
  readonly type: "enum";
  readonly values: V;
  readonly default: D;
};

type NumberDef<D extends number> = {
  readonly type: "number";
  readonly default: D;
};

type BooleanDef<D extends boolean> = {
  readonly type: "boolean";
  readonly default: D;
};

type JsonDef<D> = {
  readonly type: "json";
  readonly default: D;
  readonly validate?: (v: unknown) => v is D;
};

const MODULES_ENUM_VALUES = new Set(Object.values(ModulesEnum) as string[]);

function isModulesEnumValue(v: unknown): v is ModulesEnum {
  return typeof v === "string" && MODULES_ENUM_VALUES.has(v);
}

function normalizeFavoriteModules(input: unknown): ModulesEnum[] | null {
  let arr: unknown[];

  if (Array.isArray(input)) {
    arr = input;
  } else if (typeof input === "string") {
    arr = input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (input instanceof Set) {
    arr = Array.from(input as Set<unknown>);
  } else {
    return null;
  }

  const filtered = arr.filter(isModulesEnumValue) as ModulesEnum[];
  if (filtered.length === 0) return [];

  const deduped = Array.from(new Set(filtered));
  return deduped.every(isModulesEnumValue) ? deduped : null;
}

export const storeSchema = {
  THEME_PREFERENCE: {
    type: "enum",
    values: ["light", "dark"] as const,
    default: "light",
  },
  CLOSE_BEHAVIOR: {
    type: "enum",
    values: ["hide", "exit"] as const,
    default: "exit",
  },
  START_BEHAVIOR: {
    type: "enum",
    values: ["shown", "hidden"] as const,
    default: "shown",
  },
  FAST_ACCESS: {
    type: "enum",
    values: ["disabled", "auto"] as const,
    default: "disabled",
  },
  SIDEBAR_WIDTH: {
    type: "number",
    default: 180,
  },
  FAVORITE_FILTER: {
    type: "boolean",
    default: false,
  },
  FAVORITE_MODULES: {
    type: "json",
    default: [] as ModulesEnum[],
    validate: (v: unknown): v is ModulesEnum[] =>
      normalizeFavoriteModules(v) !== null,
  },
  LANGUAGE: {
    type: "enum",
    values: ["en", "de"] as const,
    default: "en",
  },
  DATE_FORMAT: {
    type: "enum",
    values: ["en-US", "de-DE"] as const,
    default: "en-US",
  },
  TIME_FORMAT: {
    type: "enum",
    values: ["en-US", "de-DE"] as const,
    default: "en-US",
  },
} as const satisfies Record<
  string,
  | EnumDef<readonly string[], string>
  | NumberDef<number>
  | BooleanDef<boolean>
  | JsonDef<any>
>;

type StoreSchema = typeof storeSchema;
export type DataKey = keyof StoreSchema;

type StoreValueMap = {
  [K in DataKey]: StoreSchema[K] extends EnumDef<infer V, any>
    ? V[number]
    : StoreSchema[K] extends NumberDef<any>
      ? number
      : StoreSchema[K] extends BooleanDef<any>
        ? boolean
        : StoreSchema[K] extends JsonDef<infer D>
          ? D
          : never;
};

export async function get<K extends DataKey>(
  key: K
): Promise<StoreValueMap[K]> {
  const schema = storeSchema[key];
  try {
    const raw = await AsyncStorage.getItem(key as string);
    if (raw !== null) {
      switch (schema.type) {
        case "enum": {
          if ((schema.values as readonly string[]).includes(raw)) {
            return raw as StoreValueMap[K];
          }
          break;
        }
        case "number": {
          const n = Number(raw);
          if (!Number.isNaN(n)) {
            return n as StoreValueMap[K];
          }
          break;
        }
        case "boolean": {
          if (raw === "true") return true as StoreValueMap[K];
          if (raw === "false") return false as StoreValueMap[K];
          // optional: 1/0 ebenfalls akzeptieren
          if (raw === "1") return true as StoreValueMap[K];
          if (raw === "0") return false as StoreValueMap[K];
          break;
        }
        case "json": {
          try {
            const parsed: unknown = JSON.parse(raw);
            if (key === "FAVORITE_MODULES") {
              const norm = normalizeFavoriteModules(parsed);
              if (norm !== null) {
                return norm as StoreValueMap[K];
              }
              break; // fallback auf default
            }
            if (!schema.validate || schema.validate(parsed)) {
              return parsed as StoreValueMap[K];
            }
          } catch {
            // ignore, fällt auf default zurück
          }
          break;
        }
      }
    }
  } catch (e) {
    console.error(`Failed to get ${String(key)}`, e);
  }
  return schema.default as StoreValueMap[K];
}

export async function set<K extends DataKey>(
  key: K,
  value: StoreValueMap[K]
): Promise<void> {
  const schema = storeSchema[key];
  try {
    switch (schema.type) {
      case "enum": {
        const v = value as unknown as string;
        if (!(schema.values as readonly string[]).includes(v)) {
          console.warn(`Invalid value '${v}' for key '${String(key)}'`);
          return;
        }
        await AsyncStorage.setItem(key as string, v);
        break;
      }
      case "number": {
        await AsyncStorage.setItem(key as string, String(value));
        break;
      }
      case "boolean": {
        await AsyncStorage.setItem(key as string, value ? "true" : "false");
        break;
      }
      case "json": {
        let v: unknown = value;
        if (v instanceof Set) v = Array.from(v as Set<unknown>);

        if (key === "FAVORITE_MODULES") {
          const norm = normalizeFavoriteModules(v);
          if (norm === null) {
            console.warn(`Invalid JSON value for key '${String(key)}'`, v);
            return;
          }
          await AsyncStorage.setItem(key as string, JSON.stringify(norm));
          break;
        }

        if (schema.validate && !schema.validate(v)) {
          console.warn(`Invalid JSON value for key '${String(key)}'`, v);
          return;
        }
        await AsyncStorage.setItem(key as string, JSON.stringify(v));
        break;
      }
    }
  } catch (e) {
    console.error(`Failed to set ${String(key)}`, e);
  }
}
