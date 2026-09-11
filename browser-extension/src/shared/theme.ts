export type ExtensionThemeMode = "light" | "dark";

export const EXTENSION_THEME_STORAGE_KEY = "clavispass.extension.theme";

export function isExtensionThemeMode(value: unknown): value is ExtensionThemeMode {
  return value === "light" || value === "dark";
}
