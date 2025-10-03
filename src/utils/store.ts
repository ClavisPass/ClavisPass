import AsyncStorage from "@react-native-async-storage/async-storage";

type EnumDef<V extends readonly string[], D extends V[number]> = {
  readonly type: "enum";
  readonly values: V;
  readonly default: D;
};

type NumberDef<D extends number> = {
  readonly type: "number";
  readonly default: D;
};

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
} as const satisfies Record<
  string,
  EnumDef<readonly string[], string> | NumberDef<number>
>;

type StoreSchema = typeof storeSchema;
export type DataKey = keyof StoreSchema;

type StoreValueMap = {
  [K in DataKey]:
    StoreSchema[K] extends EnumDef<infer V, any> ? V[number]
    : StoreSchema[K] extends NumberDef<any> ? number
    : never
};

export async function get<K extends DataKey>(key: K): Promise<StoreValueMap[K]> {
  const schema = storeSchema[key];
  try {
    const raw = await AsyncStorage.getItem(key as string);
    if (raw !== null) {
      if (schema.type === "enum") {
        if ((schema.values as readonly string[]).includes(raw)) {
          return raw as StoreValueMap[K];
        }
      } else if (schema.type === "number") {
        const n = Number(raw);
        if (!Number.isNaN(n)) {
          return n as StoreValueMap[K];
        }
      }
    }
  } catch (e) {
    console.error(`Failed to get ${String(key)}`, e);
  }
  return schema.default as StoreValueMap[K];
}

export async function set<K extends DataKey>(key: K, value: StoreValueMap[K]): Promise<void> {
  const schema = storeSchema[key];
  try {
    if (schema.type === "enum") {
      if (!(schema.values as readonly string[]).includes(value as unknown as string)) {
        console.warn(`Invalid value '${value}' for key '${String(key)}'`);
        return;
      }
      await AsyncStorage.setItem(key as string, value as unknown as string);
    } else if (schema.type === "number") {
      await AsyncStorage.setItem(key as string, String(value));
    }
  } catch (e) {
    console.error(`Failed to set ${String(key)}`, e);
  }
}
