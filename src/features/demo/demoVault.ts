import VaultDataType from "../vault/model/VaultDataType";
import ModulesEnum from "../vault/model/ModulesEnum";

const now = "2026-08-30T09:00:00.000Z";

const folders = [
  {
    id: "demo-folder-work",
    name: "Work",
    icon: "briefcase-outline",
    color: "#2563eb",
  },
  {
    id: "demo-folder-personal",
    name: "Personal",
    icon: "account-outline",
    color: "#16a34a",
  },
  {
    id: "demo-folder-documents",
    name: "Documents",
    icon: "file-document-outline",
    color: "#7c3aed",
  },
];

const demoVault: VaultDataType = {
  version: "1",
  folder: folders,
  devices: [],
  values: [
    {
      id: "demo-entry-arratel",
      title: "Arratel Admin",
      fav: true,
      pinnedAt: "2026-08-30T09:01:00.000Z",
      tags: ["work", "admin", "demo"],
      created: now,
      lastUpdated: now,
      folder: folders[0],
      modules: [
        {
          id: "demo-arratel-url",
          module: ModulesEnum.URL,
          value: "https://arratel.dev",
        },
        {
          id: "demo-arratel-username",
          module: ModulesEnum.USERNAME,
          value: "demo.admin",
        },
        {
          id: "demo-arratel-email",
          module: ModulesEnum.E_MAIL,
          value: "demo@arratel.dev",
        },
        {
          id: "demo-arratel-password",
          module: ModulesEnum.PASSWORD,
          value: "Demo-Password-Only-2026!",
        },
        {
          id: "demo-arratel-totp",
          module: ModulesEnum.TOTP,
          value: "JBSWY3DPEHPK3PXP",
        },
        {
          id: "demo-arratel-recovery",
          module: ModulesEnum.RECOVERY_CODES,
          codes: [
            { code: "DEMO-ALPHA-1432", used: false },
            { code: "DEMO-BRAVO-9271", used: false },
            { code: "DEMO-CHARLIE-5088", used: true },
            { code: "DEMO-DELTA-6602", used: false },
          ],
        },
      ],
    },
    {
      id: "demo-entry-identity",
      title: "Demo Identity",
      fav: false,
      tags: ["identity", "personal"],
      created: now,
      lastUpdated: now,
      folder: folders[1],
      modules: [
        {
          id: "demo-identity-person",
          module: ModulesEnum.PERSON,
          title: "Mr.",
          firstName: "Ricardo",
          middleName: "",
          lastName: "Demo",
          displayName: "Ricardo Demo",
          username: "rdemo",
        },
        {
          id: "demo-identity-address",
          module: ModulesEnum.ADDRESS,
          street1: "Example Street 12",
          street2: "Apartment 4",
          postalCode: "12345",
          city: "Demo City",
          state: "NRW",
          country: "Germany",
        },
        {
          id: "demo-identity-phone",
          module: ModulesEnum.PHONE_NUMBER,
          value: "+49 170 1234567",
        },
        {
          id: "demo-identity-email",
          module: ModulesEnum.E_MAIL,
          value: "ricardo.demo@example.com",
        },
      ],
    },
    {
      id: "demo-entry-passport",
      title: "Demo Passport",
      fav: false,
      tags: ["document", "travel"],
      created: now,
      lastUpdated: now,
      folder: folders[2],
      modules: [
        {
          id: "demo-passport-document",
          module: ModulesEnum.DOCUMENT,
          documentType: "Passport",
          number: "123456789",
          issuer: "Demo Authority",
        },
        {
          id: "demo-passport-expiry",
          module: ModulesEnum.EXPIRY,
          value: "2026-12-20",
        },
        {
          id: "demo-passport-attachment",
          module: ModulesEnum.ATTACHMENT,
          files: [
            {
              id: "demo-passport-note",
              name: "passport-demo-note.txt",
              mimeType: "text/plain",
              size: 45,
              dataBase64: "VGhpcyBpcyBhIGRlbW8gYXR0YWNobWVudC4gTm8gcmVhbCBkYXRhLg==",
            },
          ],
        },
      ],
    },
    {
      id: "demo-entry-card",
      title: "Demo Credit Card",
      fav: false,
      tags: ["finance", "demo"],
      created: now,
      lastUpdated: now,
      folder: folders[1],
      modules: [
        {
          id: "demo-card-credit",
          module: ModulesEnum.CREDIT_CARD,
          cardholderName: "RICARDO DEMO",
          number: "4111 1111 1111 1111",
          brand: "Visa",
          expiryMonth: "12",
          expiryYear: "2028",
          securityCode: "123",
          bankName: "Demo Bank",
          note: "Test card number for UI demonstration only.",
        },
        {
          id: "demo-card-expiry",
          module: ModulesEnum.EXPIRY,
          value: "2028-12-31",
        },
      ],
    },
    {
      id: "demo-entry-wifi",
      title: "Guest WiFi",
      fav: false,
      tags: ["wifi", "office"],
      created: now,
      lastUpdated: now,
      folder: folders[0],
      modules: [
        {
          id: "demo-wifi",
          module: ModulesEnum.WIFI,
          wifiName: "Arratel Guest",
          wifiType: "WPA",
          hidden: false,
          value: "demo-wifi-password",
        },
      ],
    },
    {
      id: "demo-entry-checklist",
      title: "Launch Checklist",
      fav: false,
      tags: ["task", "release"],
      created: now,
      lastUpdated: now,
      folder: folders[0],
      modules: [
        {
          id: "demo-task-1",
          module: ModulesEnum.TASK,
          value: "Check Microsoft Store listing",
          completed: true,
        },
        {
          id: "demo-task-2",
          module: ModulesEnum.TASK,
          value: "Prepare screenshots",
          completed: false,
        },
      ],
    },
  ],
};

export const DEMO_MASTER_PASSWORD = "demo";

export function createDemoVault(): VaultDataType {
  return JSON.parse(JSON.stringify(demoVault)) as VaultDataType;
}
