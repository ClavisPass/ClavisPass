import { z } from "zod";
import catalog from "../data/websitePresets.json";
import ModulesEnum from "../model/ModulesEnum";
import type ValuesType from "../model/ValuesType";
import getModuleData from "./getModuleData";

const websitePresetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  aliases: z.array(z.string()),
  url: z.string().url().startsWith("https://"),
  modules: z.array(
    z.enum([
      ModulesEnum.E_MAIL,
      ModulesEnum.USERNAME,
      ModulesEnum.PHONE_NUMBER,
      ModulesEnum.PASSWORD,
      ModulesEnum.URL,
    ]),
  ),
});

export type WebsitePreset = z.infer<typeof websitePresetSchema>;
export const websitePresets = z.array(websitePresetSchema).parse(catalog);

function normalize(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .normalize("NFKD")
    .replace(/[^a-z0-9]/g, "");
}

const searchIndex = websitePresets.map((preset, index) => ({
  preset,
  index,
  name: normalize(preset.name),
  aliases: [...preset.aliases, new URL(preset.url).hostname].map(normalize),
}));

export function findWebsitePresets(query: string, limit = 5): WebsitePreset[] {
  const term = normalize(query);
  if (!term || limit <= 0) return [];

  return searchIndex
    .map((item) => {
      const score =
        item.name === term
          ? 0
          : item.name.startsWith(term)
            ? 1
            : item.aliases.some((alias) => alias === term)
              ? 2
              : item.aliases.some((alias) => alias.startsWith(term))
                ? 3
                : item.name.includes(term)
                  ? 4
                  : item.aliases.some((alias) => alias.includes(term))
                    ? 5
                    : 6;
      return { ...item, score };
    })
    .filter((item) => item.score < 6)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .slice(0, limit)
    .map((item) => item.preset);
}

/** Preserve existing modules and values; only a blank URL may be filled. */
export function applyWebsitePreset(
  entry: ValuesType,
  preset: WebsitePreset,
): ValuesType {
  const existingTypes = new Set(entry.modules.map((module) => module.module));
  const modules = entry.modules.map((module) =>
    module.module === ModulesEnum.URL && !module.value.trim()
      ? { ...module, value: preset.url }
      : module,
  );

  for (const type of preset.modules) {
    if (existingTypes.has(type)) continue;
    const module = getModuleData(type);
    modules.push(
      module.module === ModulesEnum.URL
        ? { ...module, value: preset.url }
        : module,
    );
    existingTypes.add(type);
  }

  return { ...entry, title: preset.name, modules };
}
