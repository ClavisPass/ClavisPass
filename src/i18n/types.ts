export type AppLanguage = "de" | "en";
export const DEFAULT_LANG: AppLanguage = "de";

export function toAppLanguage(input: unknown): AppLanguage {
  const s = String(input || "").toLowerCase();
  if (s.startsWith("de")) return "de";
  if (s.startsWith("en")) return "en";
  return DEFAULT_LANG;
}
