const storage = new Map<string, string>();

const AsyncStorage = {
  async getItem(key: string) {
    return storage.has(key) ? storage.get(key)! : null;
  },

  async setItem(key: string, value: string) {
    storage.set(key, value);
  },

  async removeItem(key: string) {
    storage.delete(key);
  },

  async clear() {
    storage.clear();
  },

  __setRaw(key: string, value: string) {
    storage.set(key, value);
  },

  __snapshot() {
    return new Map(storage);
  },
};

export default AsyncStorage;
