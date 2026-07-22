import { fromByteArray } from "base64-js";
import type {
  Kdbx,
  KdbxBinary,
  KdbxBinaryWithHash,
  KdbxEntry,
  KdbxEntryField,
  KdbxGroup,
  ProtectedValue,
} from "kdbxweb";

import FolderType from "../../../../vault/model/FolderType";
import ModulesEnum from "../../../../vault/model/ModulesEnum";
import { ModuleType } from "../../../../vault/model/ModulesType";
import ValuesType, {
  ValuesListType,
} from "../../../../vault/model/ValuesType";
import AttachmentModuleType, {
  AttachmentFile,
} from "../../../../vault/model/modules/AttachmentModuleType";
import CustomFieldModuleType from "../../../../vault/model/modules/CustomFieldModuleType";
import ExpiryModuleType from "../../../../vault/model/modules/ExpiryModuleType";
import NoteModuleType from "../../../../vault/model/modules/NoteModuleType";
import TotpModuleType from "../../../../vault/model/modules/TotpModuleType";
import createUniqueID from "../../../../../shared/utils/createUniqueID";
import getModuleData from "../../../../vault/utils/getModuleData";

const STANDARD_FIELD_NAMES = new Set([
  "Title",
  "UserName",
  "Password",
  "URL",
  "Notes",
]);

type KdbxImportResult = {
  values: ValuesListType;
  folders: FolderType[];
  warnings: string[];
};

function isProtectedValue(value: unknown): value is ProtectedValue {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as ProtectedValue).getText === "function" &&
    typeof (value as ProtectedValue).getBinary === "function"
  );
}

function fieldToString(field: KdbxEntryField | undefined): string {
  if (!field) return "";
  return isProtectedValue(field) ? field.getText() : String(field);
}

function isSecretField(field: KdbxEntryField | undefined): boolean {
  return isProtectedValue(field);
}

function isNumericText(value: string): boolean {
  return /^-?\d+([.,]\d+)?$/.test(value.trim());
}

function addValueModule(
  modules: ModuleType[],
  module: ModulesEnum,
  value: string,
) {
  if (!value) return;

  const nextModule = getModuleData(module) as any;
  nextModule.value = value;
  modules.push(nextModule);
}

function addCustomField(
  modules: ModuleType[],
  title: string,
  value: string,
  protectedField: boolean,
) {
  if (!title || !value) return;

  modules.push({
    id: createUniqueID(),
    module: ModulesEnum.CUSTOM_FIELD,
    title,
    value,
    inputType: protectedField
      ? "secret"
      : isNumericText(value)
        ? "number"
        : "text",
  } satisfies CustomFieldModuleType as ModuleType);
}

function addTotpModule(modules: ModuleType[], value: string) {
  if (!value || !/^otpauth:\/\//i.test(value)) return false;

  modules.push({
    id: createUniqueID(),
    module: ModulesEnum.TOTP,
    value,
  } satisfies TotpModuleType as ModuleType);

  return true;
}

function toIso(date: Date | undefined, fallback: string): string {
  return date instanceof Date && !Number.isNaN(date.getTime())
    ? date.toISOString()
    : fallback;
}

function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  tags.forEach((tag) => {
    const trimmed = tag.trim();
    const key = trimmed.toLocaleLowerCase();
    if (!trimmed || seen.has(key)) return;

    seen.add(key);
    normalized.push(trimmed);
  });

  return normalized;
}

function groupPath(group: KdbxGroup | undefined): string[] {
  const path: string[] = [];
  let current = group;

  while (current?.parentGroup) {
    if (current.name) path.unshift(current.name);
    current = current.parentGroup;
  }

  return path;
}

function groupTags(group: KdbxGroup | undefined): string[] {
  const tags: string[] = [];
  let current = group;

  while (current?.parentGroup) {
    tags.push(...(current.tags ?? []));
    current = current.parentGroup;
  }

  return tags;
}

function createFolderFromGroup(
  group: KdbxGroup | undefined,
  byPath: Map<string, FolderType>,
): FolderType | null {
  const path = groupPath(group);
  if (path.length === 0) return null;

  const key = path.join("\u001f");
  const existing = byPath.get(key);
  if (existing) return existing;

  const folder: FolderType = {
    id: createUniqueID(),
    name: path[path.length - 1],
  };
  byPath.set(key, folder);
  return folder;
}

function binaryToBytes(binary: KdbxBinary): Uint8Array {
  if (isProtectedValue(binary)) return binary.getBinary();
  return new Uint8Array(binary);
}

function binaryWithMetaToAttachment(
  name: string,
  binary: KdbxBinary | KdbxBinaryWithHash,
): AttachmentFile {
  const value = (
    typeof binary === "object" &&
    binary !== null &&
    "hash" in binary &&
    "value" in binary
      ? binary.value
      : binary
  ) as KdbxBinary;
  const protectedBinary = isProtectedValue(value);
  const bytes = binaryToBytes(value);

  return {
    id: createUniqueID(),
    name,
    size: bytes.byteLength,
    dataBase64: fromByteArray(bytes),
    protected: protectedBinary,
    importedFrom: "kdbx",
    keepassRef: {
      binaryKey: name,
      protected: protectedBinary,
    },
  };
}

function mapAttachments(entry: KdbxEntry): AttachmentModuleType | null {
  const files = Array.from(entry.binaries.entries()).map(([name, binary]) =>
    binaryWithMetaToAttachment(name, binary),
  );

  if (files.length === 0) return null;

  return {
    id: createUniqueID(),
    module: ModulesEnum.ATTACHMENT,
    files,
  };
}

function mapEntry(
  entry: KdbxEntry,
  folder: FolderType | null,
  now: string,
): ValuesType {
  const modules: ModuleType[] = [];

  const title = fieldToString(entry.fields.get("Title")) || "KeePass Entry";
  const username = fieldToString(entry.fields.get("UserName"));
  const password = fieldToString(entry.fields.get("Password"));
  const url = fieldToString(entry.fields.get("URL"));
  const notes = fieldToString(entry.fields.get("Notes"));

  addValueModule(modules, ModulesEnum.USERNAME, username);
  addValueModule(modules, ModulesEnum.PASSWORD, password);
  addValueModule(modules, ModulesEnum.URL, url);

  if (notes) {
    modules.push({
      id: createUniqueID(),
      module: ModulesEnum.NOTE,
      value: notes,
      displayMode: "normal",
      variant: "plain",
    } satisfies NoteModuleType as ModuleType);
  }

  for (const [fieldName, fieldValue] of entry.fields.entries()) {
    if (STANDARD_FIELD_NAMES.has(fieldName)) continue;

    const value = fieldToString(fieldValue);
    const lowerFieldName = fieldName.toLocaleLowerCase();
    if ((lowerFieldName === "otp" || lowerFieldName === "totp") && addTotpModule(modules, value)) {
      continue;
    }

    addCustomField(modules, fieldName, value, isSecretField(fieldValue));
  }

  if (entry.times.expires && entry.times.expiryTime) {
    modules.push({
      id: createUniqueID(),
      module: ModulesEnum.EXPIRY,
      value: entry.times.expiryTime.toISOString(),
    } satisfies ExpiryModuleType as ModuleType);
  }

  const attachmentModule = mapAttachments(entry);
  if (attachmentModule) modules.push(attachmentModule as ModuleType);

  const path = groupPath(entry.parentGroup);

  return {
    id: createUniqueID(),
    title,
    modules,
    folder,
    fav: normalizeTags([...(entry.tags ?? []), ...groupTags(entry.parentGroup)]).some(
      (tag) => tag.toLocaleLowerCase() === "favorite",
    ),
    tags: normalizeTags([...(entry.tags ?? []), ...groupTags(entry.parentGroup)]),
    created: toIso(entry.times.creationTime, now),
    lastUpdated: toIso(entry.times.lastModTime, now),
    externalRefs: {
      keepass: {
        uuid: entry.uuid.toString(),
        originalGroupPath: path,
        originalIconId:
          entry.customIcon?.toString() ?? entry.icon?.toString() ?? null,
      },
    },
  };
}

export function mapKdbxToClavisPass(kdbx: Kdbx): KdbxImportResult {
  const now = new Date().toISOString();
  const foldersByPath = new Map<string, FolderType>();
  const values: ValuesType[] = [];

  for (const rootGroup of kdbx.groups) {
    for (const entry of rootGroup.allEntries()) {
      const folder = createFolderFromGroup(entry.parentGroup, foldersByPath);
      values.push(mapEntry(entry, folder, now));
    }
  }

  return {
    values,
    folders: Array.from(foldersByPath.values()),
    warnings: [],
  };
}

export type { KdbxImportResult };
