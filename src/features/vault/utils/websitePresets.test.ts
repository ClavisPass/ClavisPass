import { describe, expect, it } from "vitest";
import ModulesEnum from "../model/ModulesEnum";
import { ValuesTypeSchema } from "../model/ValuesType";
import getTemplate from "./getTemplate";
import TemplateEnum from "../model/TemplateEnum";
import getModuleData from "./getModuleData";
import {
  applyWebsitePreset,
  findWebsitePresets,
  websitePresets,
} from "./websitePresets";

const amazon = websitePresets.find((preset) => preset.id === "amazon")!;

describe("website presets", () => {
  it("provides at least 100 unique, valid HTTPS presets compatible with vault schemas", () => {
    expect(websitePresets.length).toBeGreaterThanOrEqual(100);
    expect(new Set(websitePresets.map((preset) => preset.id)).size).toBe(
      websitePresets.length,
    );
    for (const preset of websitePresets) {
      expect(new URL(preset.url).protocol).toBe("https:");
      expect(preset.modules).toContain(ModulesEnum.URL);
      expect(new Set(preset.modules).size).toBe(preset.modules.length);
      const entry = applyWebsitePreset(getTemplate(TemplateEnum.BLANK), preset);
      expect(ValuesTypeSchema.safeParse(entry).success).toBe(true);
      for (const module of entry.modules) {
        expect(module.value).toBe(
          module.module === ModulesEnum.URL ? preset.url : "",
        );
      }
    }
  });

  it("suggests Amazon from the first letter, caps results, and ignores empty input", () => {
    expect(findWebsitePresets("a")[0]).toEqual(amazon);
    expect(findWebsitePresets("a")).toHaveLength(5);
    expect(findWebsitePresets(" ")).toEqual([]);
    expect(findWebsitePresets("https://www.")).toEqual([]);
    expect(findWebsitePresets("no-matching-website-123")).toEqual([]);
  });

  it("finds names, aliases and domains regardless of case and punctuation", () => {
    expect(findWebsitePresets(" AMAZON.DE ")[0]).toEqual(amazon);
    expect(findWebsitePresets("gmail")[0].id).toBe("google");
    expect(findWebsitePresets("twitter")[0].id).toBe("x");
    expect(findWebsitePresets("1und1")[0].id).toBe("1und1");
    expect(
      findWebsitePresets("git")
        .slice(0, 2)
        .map((preset) => preset.id),
    ).toEqual(["github", "gitlab"]);
  });

  it("keeps existing credentials and other modules without mutating the source", () => {
    const entry = getTemplate(TemplateEnum.PASSWORD);
    entry.title = "am";
    entry.modules = entry.modules.map((module) => ({
      ...module,
      value: `existing-${module.module}`,
    }));
    const note = getModuleData(ModulesEnum.NOTE);
    entry.modules.push({ ...note, value: "Keep this note" });
    const original = JSON.parse(JSON.stringify(entry));
    const result = applyWebsitePreset(entry, amazon);
    expect(entry).toEqual(original);
    expect(result.title).toBe("Amazon");
    expect(result.modules.slice(0, entry.modules.length)).toEqual(
      entry.modules,
    );
    expect(
      result.modules.filter((module) => module.module === ModulesEnum.E_MAIL),
    ).toHaveLength(1);
    expect(
      result.modules.filter((module) => module.module === ModulesEnum.PASSWORD),
    ).toHaveLength(1);
    expect(result.modules.at(-1)).toMatchObject({
      module: ModulesEnum.URL,
      value: amazon.url,
    });
  });

  it("fills an existing empty URL in place and preserves a populated URL", () => {
    const entry = getTemplate(TemplateEnum.BLANK);
    const url = getModuleData(ModulesEnum.URL);
    entry.modules = [{ ...url, value: "  " }];
    const filled = applyWebsitePreset(entry, amazon);
    expect(filled.modules[0]).toMatchObject({ id: url.id, value: amazon.url });
    expect(
      filled.modules.filter((module) => module.module === ModulesEnum.URL),
    ).toHaveLength(1);
    entry.modules = [{ ...url, value: "https://www.amazon.com" }];
    expect(applyWebsitePreset(entry, amazon).modules[0]).toEqual(
      entry.modules[0],
    );
  });

  it("can be applied repeatedly without duplicates or changed module IDs", () => {
    const first = applyWebsitePreset(getTemplate(TemplateEnum.BLANK), amazon);
    expect(applyWebsitePreset(first, amazon)).toEqual(first);
  });
});
