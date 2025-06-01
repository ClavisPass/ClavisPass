import AsyncStorage from "@react-native-async-storage/async-storage";

// Konkrete Werte definieren
const storeSchema = {
  THEME_PREFERENCE: {
    values: ["light", "dark"],
    default: "light",
  },
  CLOSE_BEHAVIOR: {
    values: ["hide", "exit"],
    default: "exit",
  },
} as const;

type StoreSchema = typeof storeSchema;
export type DataKey = keyof StoreSchema;

type StoreValueMap = {
  [K in keyof StoreSchema]: StoreSchema[K]["values"][number];
};
type StoreDefaultMap = {
  [K in keyof StoreSchema]: StoreSchema[K]["default"];
};

export async function get<K extends DataKey>(
  key: K
): Promise<StoreValueMap[K]> {
  const schema = storeSchema[key];
  try {
    const raw = await AsyncStorage.getItem(key);
    if (
      raw &&
      (schema.values as readonly string[]).includes(raw)
    ) {
      return raw as StoreValueMap[K];
    }
  } catch (e) {
    console.error(`Failed to get ${key}`, e);
  }

  return schema.default as StoreValueMap[K];
}

export async function set<K extends DataKey>(
  key: K,
  value: StoreValueMap[K]
): Promise<void> {
  const schema = storeSchema[key];
  if (
    !(schema.values as readonly string[]).includes(value)
  ) {
    console.warn(`Invalid value '${value}' for key '${key}'`);
    return;
  }

  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(`Failed to set ${key}`, e);
  }
}