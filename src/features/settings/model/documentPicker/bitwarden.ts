import FolderType from "../../../vault/model/FolderType";
import ModulesEnum from "../../../vault/model/ModulesEnum";
import { ModuleType } from "../../../vault/model/ModulesType";
import ValuesType, { ValuesListType } from "../../../vault/model/ValuesType";
import createUniqueID from "../../../../shared/utils/createUniqueID";
import getModuleData from "../../../vault/utils/getModuleData";

type BitwardenFolder = {
  id?: string | null;
  name?: string | null;
};

type BitwardenField = {
  name?: string | null;
  value?: string | boolean | number | null;
  type?: number | null;
};

type BitwardenUri = {
  uri?: string | null;
};

type BitwardenItem = {
  id?: string | null;
  folderId?: string | null;
  type?: number | null;
  name?: string | null;
  notes?: string | null;
  favorite?: boolean | null;
  creationDate?: string | null;
  revisionDate?: string | null;
  fields?: BitwardenField[] | null;
  login?: {
    username?: string | null;
    password?: string | null;
    totp?: string | null;
    uris?: BitwardenUri[] | null;
  } | null;
  secureNote?: Record<string, unknown> | null;
  card?: {
    cardholderName?: string | null;
    brand?: string | null;
    number?: string | null;
    expMonth?: string | null;
    expYear?: string | null;
    code?: string | null;
  } | null;
  identity?: {
    title?: string | null;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    address1?: string | null;
    address2?: string | null;
    address3?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
    company?: string | null;
    email?: string | null;
    phone?: string | null;
    username?: string | null;
    passportNumber?: string | null;
    licenseNumber?: string | null;
    ssn?: string | null;
  } | null;
  sshKey?: {
    privateKey?: string | null;
    publicKey?: string | null;
    keyFingerprint?: string | null;
  } | null;
};

type BitwardenExport = {
  encrypted?: boolean;
  folders?: BitwardenFolder[];
  items?: BitwardenItem[];
};

export type BitwardenImportResult = {
  values: ValuesListType;
  folders: FolderType[];
};

function asString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

function clean(value: unknown): string {
  return asString(value).trim();
}

function toIso(value: unknown, fallback: string): string {
  const text = clean(value);
  if (!text) return fallback;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function addValueModule(
  modules: ModuleType[],
  module: ModulesEnum,
  value: unknown,
) {
  const text = clean(value);
  if (!text) return;

  const nextModule = getModuleData(module) as any;
  nextModule.value = text;
  modules.push(nextModule);
}

function addNote(modules: ModuleType[], value: unknown) {
  const text = clean(value);
  if (!text) return;

  modules.push({
    id: createUniqueID(),
    module: ModulesEnum.NOTE,
    value: text,
    displayMode: "normal",
    variant: "plain",
  } as ModuleType);
}

function addCustomField(modules: ModuleType[], field: BitwardenField) {
  const title = clean(field.name);
  const value = asString(field.value).trim();
  if (!title || !value) return;

  modules.push({
    id: createUniqueID(),
    module: ModulesEnum.CUSTOM_FIELD,
    title,
    value,
    inputType: field.type === 1 ? "secret" : field.type === 2 ? "text" : "text",
  } as ModuleType);
}

function addTotp(modules: ModuleType[], value: unknown) {
  const text = clean(value);
  if (!text) return;

  modules.push({
    id: createUniqueID(),
    module: ModulesEnum.TOTP,
    value: /^otpauth:\/\//i.test(text)
      ? text
      : `otpauth://totp/Bitwarden?secret=${encodeURIComponent(text)}`,
  } as ModuleType);
}

function addLoginModules(modules: ModuleType[], item: BitwardenItem) {
  const login = item.login;
  if (!login) return;

  addValueModule(modules, ModulesEnum.USERNAME, login.username);
  addValueModule(modules, ModulesEnum.PASSWORD, login.password);

  (login.uris ?? []).forEach((uri) => {
    addValueModule(modules, ModulesEnum.URL, uri.uri);
  });

  addTotp(modules, login.totp);
}

function addCardModule(modules: ModuleType[], item: BitwardenItem) {
  const card = item.card;
  if (!card) return;

  if (
    ![
      card.cardholderName,
      card.brand,
      card.number,
      card.expMonth,
      card.expYear,
      card.code,
    ].some((value) => clean(value))
  ) {
    return;
  }

  modules.push({
    id: createUniqueID(),
    module: ModulesEnum.CREDIT_CARD,
    cardholderName: clean(card.cardholderName),
    number: clean(card.number),
    brand: clean(card.brand),
    expiryMonth: clean(card.expMonth),
    expiryYear: clean(card.expYear),
    securityCode: clean(card.code),
    bankName: "",
    note: "",
  } as ModuleType);
}

function addIdentityModules(modules: ModuleType[], item: BitwardenItem) {
  const identity = item.identity;
  if (!identity) return;

  if (
    [
      identity.title,
      identity.firstName,
      identity.middleName,
      identity.lastName,
      identity.username,
    ].some((value) => clean(value))
  ) {
    const displayName = [
      identity.title,
      identity.firstName,
      identity.middleName,
      identity.lastName,
    ]
      .map(clean)
      .filter(Boolean)
      .join(" ");

    modules.push({
      id: createUniqueID(),
      module: ModulesEnum.PERSON,
      title: clean(identity.title),
      firstName: clean(identity.firstName),
      middleName: clean(identity.middleName),
      lastName: clean(identity.lastName),
      displayName,
      username: clean(identity.username),
    } as ModuleType);
  }

  if (
    [
      identity.address1,
      identity.address2,
      identity.address3,
      identity.city,
      identity.state,
      identity.postalCode,
      identity.country,
    ].some((value) => clean(value))
  ) {
    modules.push({
      id: createUniqueID(),
      module: ModulesEnum.ADDRESS,
      street1: clean(identity.address1),
      street2: [identity.address2, identity.address3]
        .map(clean)
        .filter(Boolean)
        .join(" "),
      postalCode: clean(identity.postalCode),
      city: clean(identity.city),
      state: clean(identity.state),
      country: clean(identity.country),
    } as ModuleType);
  }

  if (clean(identity.company)) {
    modules.push({
      id: createUniqueID(),
      module: ModulesEnum.COMPANY,
      name: clean(identity.company),
      department: "",
      jobTitle: "",
    } as ModuleType);
  }

  addValueModule(modules, ModulesEnum.E_MAIL, identity.email);
  addValueModule(modules, ModulesEnum.PHONE_NUMBER, identity.phone);

  [
    ["Passport", identity.passportNumber],
    ["License", identity.licenseNumber],
    ["SSN", identity.ssn],
  ].forEach(([documentType, number]) => {
    if (!clean(number)) return;
    modules.push({
      id: createUniqueID(),
      module: ModulesEnum.DOCUMENT,
      documentType,
      number: clean(number),
      issuer: "",
      expiryDate: "",
    } as ModuleType);
  });
}

function addSshKeyModule(modules: ModuleType[], item: BitwardenItem) {
  const sshKey = item.sshKey;
  if (!sshKey) return;

  const value = [
    clean(sshKey.privateKey),
    clean(sshKey.publicKey),
    clean(sshKey.keyFingerprint),
  ]
    .filter(Boolean)
    .join("\n\n");

  addValueModule(modules, ModulesEnum.KEY, value);
}

function createFolderMap(folders: BitwardenFolder[] = []) {
  const byBitwardenId = new Map<string, FolderType>();
  const output: FolderType[] = [];

  folders.forEach((folder) => {
    const id = clean(folder.id);
    const name = clean(folder.name);
    if (!id || !name) return;

    const nextFolder: FolderType = {
      id: createUniqueID(),
      name,
    };
    byBitwardenId.set(id, nextFolder);
    output.push(nextFolder);
  });

  return { byBitwardenId, output };
}

function mapItem(
  item: BitwardenItem,
  folder: FolderType | null,
  now: string,
): ValuesType {
  const modules: ModuleType[] = [];

  addLoginModules(modules, item);
  addCardModule(modules, item);
  addIdentityModules(modules, item);
  addSshKeyModule(modules, item);
  addNote(modules, item.notes);
  (item.fields ?? []).forEach((field) => addCustomField(modules, field));

  return {
    id: createUniqueID(),
    title: clean(item.name) || "Bitwarden Entry",
    modules,
    folder,
    fav: Boolean(item.favorite),
    created: toIso(item.creationDate, now),
    lastUpdated: toIso(item.revisionDate, now),
  };
}

export default function importBitwarden(fileData: string): BitwardenImportResult {
  const parsed = JSON.parse(fileData) as BitwardenExport;

  if (parsed.encrypted) {
    throw new Error("Encrypted Bitwarden exports are not supported.");
  }

  const now = new Date().toISOString();
  const { byBitwardenId, output: folders } = createFolderMap(parsed.folders);

  return {
    folders,
    values: (parsed.items ?? []).map((item) =>
      mapItem(
        item,
        item.folderId ? (byBitwardenId.get(item.folderId) ?? null) : null,
        now,
      ),
    ),
  };
}
