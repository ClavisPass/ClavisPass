import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { logger } from "../../../infrastructure/logging/logger";
import ModulesEnum from "../model/ModulesEnum";
import ValuesType from "../model/ValuesType";

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeVCardText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function sanitizeFileName(value: string): string {
  const cleaned = value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 80);
  return cleaned || "contact";
}

function firstModule(entry: ValuesType, moduleName: ModulesEnum): any | null {
  return entry.modules.find((m) => (m as any).module === moduleName) ?? null;
}

function modules(entry: ValuesType, moduleName: ModulesEnum): any[] {
  return entry.modules.filter((m) => (m as any).module === moduleName);
}

function buildFormattedName(entry: ValuesType, person: any | null): string {
  const displayName = clean(person?.displayName);
  if (displayName) return displayName;

  const parts = [
    clean(person?.title),
    clean(person?.firstName),
    clean(person?.middleName),
    clean(person?.lastName),
  ].filter(Boolean);

  return parts.join(" ") || entry.title;
}

export function canExportVCard(entry: ValuesType): boolean {
  return entry.modules.some((module) =>
    [
      ModulesEnum.PERSON,
      ModulesEnum.ADDRESS,
      ModulesEnum.COMPANY,
      ModulesEnum.PHONE_NUMBER,
      ModulesEnum.E_MAIL,
      ModulesEnum.URL,
    ].includes((module as any).module),
  );
}

export function buildVCard(entry: ValuesType): string | null {
  if (!canExportVCard(entry)) return null;

  const person = firstModule(entry, ModulesEnum.PERSON);
  const company = firstModule(entry, ModulesEnum.COMPANY);
  const address = firstModule(entry, ModulesEnum.ADDRESS);

  const formattedName = buildFormattedName(entry, person);
  const lastName = clean(person?.lastName);
  const firstName = clean(person?.firstName);
  const middleName = clean(person?.middleName);
  const title = clean(person?.title);
  const org = [clean(company?.name), clean(company?.department)]
    .filter(Boolean)
    .join(";");
  const jobTitle = clean(company?.jobTitle);

  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  lines.push(
    `FN:${escapeVCardText(formattedName)}`,
    `N:${[lastName, firstName, middleName, title, ""]
      .map(escapeVCardText)
      .join(";")}`,
  );

  if (org) lines.push(`ORG:${org.split(";").map(escapeVCardText).join(";")}`);
  if (jobTitle) lines.push(`TITLE:${escapeVCardText(jobTitle)}`);

  modules(entry, ModulesEnum.PHONE_NUMBER).forEach((phone) => {
    const value = clean(phone.value);
    if (value) lines.push(`TEL;TYPE=CELL:${escapeVCardText(value)}`);
  });

  modules(entry, ModulesEnum.E_MAIL).forEach((email) => {
    const value = clean(email.value);
    if (value) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardText(value)}`);
  });

  modules(entry, ModulesEnum.URL).forEach((url) => {
    const value = clean(url.value);
    if (value) lines.push(`URL:${escapeVCardText(value)}`);
  });

  if (address) {
    const street = [clean(address.street1), clean(address.street2)]
      .filter(Boolean)
      .join(" ");
    const adrParts = [
      "",
      "",
      street,
      clean(address.city),
      clean(address.state),
      clean(address.postalCode),
      clean(address.country),
    ];
    if (adrParts.some(Boolean)) {
      lines.push(`ADR;TYPE=HOME:${adrParts.map(escapeVCardText).join(";")}`);
    }
  }

  lines.push("END:VCARD", "");
  return lines.join("\r\n");
}

export async function exportVCard(entry: ValuesType) {
  const content = buildVCard(entry);
  if (!content) return;

  const fileName = `${sanitizeFileName(entry.title)}.vcf`;

  try {
    if (Platform.OS === "web") {
      const tauriDialog = require("@tauri-apps/plugin-dialog");
      const filePath = await tauriDialog.save({
        defaultPath: fileName,
        filters: [
          {
            name: "vCard",
            extensions: ["vcf"],
          },
        ],
      });

      if (!filePath) return;

      const tauriFs = require("@tauri-apps/plugin-fs");
      await tauriFs.writeTextFile(filePath, content);
      return;
    }

    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: "text/vcard",
      dialogTitle: fileName,
      UTI: "public.vcard",
    });
  } catch (error) {
    logger.error("[VCardExport] Failed to export vCard:", error);
  }
}
