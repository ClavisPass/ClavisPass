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
    id: "demo-folder-finance",
    name: "Finance",
    icon: "credit-card-outline",
    color: "#0891b2",
  },
  {
    id: "demo-folder-travel",
    name: "Travel",
    icon: "airplane",
    color: "#7c3aed",
  },
];

const demoVault: VaultDataType = {
  version: "1",
  vaultId: "vault_demo",
  folder: folders,
  devices: [],
  deletedEntries: [],
  values: [
    {
      id: "demo-entry-github",
      title: "GitHub",
      fav: true,
      pinnedAt: "2026-08-30T09:01:00.000Z",
      tags: ["work", "developer", "2fa"],
      created: now,
      lastUpdated: now,
      folder: folders[0],
      modules: [
        {
          id: "demo-github-url",
          module: ModulesEnum.URL,
          value: "https://github.com",
        },
        {
          id: "demo-github-username",
          module: ModulesEnum.USERNAME,
          value: "ricardo-demo",
        },
        {
          id: "demo-github-email",
          module: ModulesEnum.E_MAIL,
          value: "clavispass@arratel.dev",
        },
        {
          id: "demo-github-password",
          module: ModulesEnum.PASSWORD,
          value: "demo-only-github-42!",
        },
        {
          id: "demo-github-totp",
          module: ModulesEnum.TOTP,
          value: "JBSWY3DPEHPK3PXP",
        },
        {
          id: "demo-github-recovery",
          module: ModulesEnum.RECOVERY_CODES,
          codes: [
            { code: "GH-DEMO-1842-ALPHA", used: false },
            { code: "GH-DEMO-7301-BRAVO", used: false },
            { code: "GH-DEMO-4928-CHARLIE", used: true },
            { code: "GH-DEMO-6150-DELTA", used: false },
            { code: "GH-DEMO-2674-ECHO", used: false },
          ],
        },
      ],
    },
    {
      id: "demo-entry-vercel",
      title: "Vercel",
      fav: true,
      pinnedAt: "2026-08-30T09:02:00.000Z",
      tags: ["work", "hosting", "demo"],
      created: now,
      lastUpdated: now,
      folder: folders[0],
      modules: [
        {
          id: "demo-vercel-url",
          module: ModulesEnum.URL,
          value: "https://vercel.com",
        },
        {
          id: "demo-vercel-email",
          module: ModulesEnum.E_MAIL,
          value: "contact@arratel.dev",
        },
        {
          id: "demo-vercel-password",
          module: ModulesEnum.PASSWORD,
          value: "demo-only-vercel-2026!",
        },
        {
          id: "demo-vercel-custom-team",
          module: ModulesEnum.CUSTOM_FIELD,
          title: "Team slug",
          value: "arratel-demo",
          inputType: "text",
        },
      ],
    },
    {
      id: "demo-entry-stripe",
      title: "Stripe Test Dashboard",
      fav: false,
      tags: ["work", "billing", "demo"],
      created: now,
      lastUpdated: now,
      folder: folders[2],
      modules: [
        {
          id: "demo-stripe-url",
          module: ModulesEnum.URL,
          value: "https://dashboard.stripe.com",
        },
        {
          id: "demo-stripe-email",
          module: ModulesEnum.E_MAIL,
          value: "billing@arratel.dev",
        },
        {
          id: "demo-stripe-password",
          module: ModulesEnum.PASSWORD,
          value: "demo-only-stripe-test!",
        },
        {
          id: "demo-stripe-recovery",
          module: ModulesEnum.RECOVERY_CODES,
          codes: [
            { code: "ST-DEMO-1184-2903", used: false },
            { code: "ST-DEMO-6402-8715", used: false },
            { code: "ST-DEMO-5309-4471", used: false },
          ],
        },
      ],
    },
    {
      id: "demo-entry-identity",
      title: "Ricardo Demo",
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
          middleName: "Valente",
          lastName: "Demo",
          displayName: "Ricardo V. Demo",
          username: "rdemo",
        },
        {
          id: "demo-identity-email",
          module: ModulesEnum.E_MAIL,
          value: "ricardo.demo@example.com",
        },
        {
          id: "demo-identity-phone",
          module: ModulesEnum.PHONE_NUMBER,
          value: "+49 170 1234567",
        },
        {
          id: "demo-identity-company",
          module: ModulesEnum.COMPANY,
          name: "Arratel",
          department: "Product",
          jobTitle: "Founder",
        },
        {
          id: "demo-identity-address",
          module: ModulesEnum.ADDRESS,
          street1: "Demoallee 14",
          street2: "2nd floor",
          postalCode: "50667",
          city: "Cologne",
          state: "NRW",
          country: "Germany",
        },
      ],
    },
    {
      id: "demo-entry-passport",
      title: "Passport",
      fav: false,
      tags: ["document", "travel"],
      created: now,
      lastUpdated: now,
      folder: folders[3],
      modules: [
        {
          id: "demo-passport-document",
          module: ModulesEnum.DOCUMENT,
          documentType: "Passport",
          number: "C01X92847",
          issuer: "City of Cologne",
        },
        {
          id: "demo-passport-attachment",
          module: ModulesEnum.ATTACHMENT,
          files: [
            {
              id: "demo-passport-note",
              name: "passport-demo-note.txt",
              mimeType: "text/plain",
              size: 61,
              dataBase64:
                "VGhpcyBpcyBhIGRlbW8gYXR0YWNobWVudC4gSXQgZG9lcyBub3QgY29udGFpbiByZWFsIGRhdGEu",
            },
          ],
        },
        {
          id: "demo-passport-expiry",
          module: ModulesEnum.EXPIRY,
          value: "2027-04-15",
        },
      ],
    },
    {
      id: "demo-entry-credit-card",
      title: "Travel Credit Card",
      fav: false,
      tags: ["finance", "travel"],
      created: now,
      lastUpdated: now,
      folder: folders[2],
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
          bankName: "Example Bank",
          note: "Demo card number for UI demonstration only.",
        },
        {
          id: "demo-card-expiry",
          module: ModulesEnum.EXPIRY,
          value: "2028-12-31",
        },
      ],
    },
    {
      id: "demo-entry-membership-card",
      title: "Gym Membership",
      fav: false,
      tags: ["personal", "card"],
      created: now,
      lastUpdated: now,
      folder: folders[1],
      modules: [
        {
          id: "demo-membership-url",
          module: ModulesEnum.URL,
          value: "https://www.urban-sportsclub.com",
        },
        {
          id: "demo-membership-card",
          module: ModulesEnum.DIGITAL_CARD,
          value: "GYM-2026-4458-2190",
          type: "membership",
        },
      ],
    },
    {
      id: "demo-entry-wifi",
      title: "Office Guest WiFi",
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
      title: "Store Release Checklist",
      fav: false,
      tags: ["checklist", "release"],
      created: now,
      lastUpdated: now,
      folder: folders[0],
      modules: [
        {
          id: "demo-task-1",
          module: ModulesEnum.TASK,
          value: "Prepare Microsoft Store screenshots",
          completed: true,
        },
        {
          id: "demo-task-2",
          module: ModulesEnum.TASK,
          value: "Review privacy policy and license text",
          completed: false,
        },
        {
          id: "demo-task-3",
          module: ModulesEnum.TASK,
          value: "Publish the demo page",
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
