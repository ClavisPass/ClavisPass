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
  {
    id: "demo-folder-security",
    name: "Security",
    icon: "shield-key-outline",
    color: "#dc2626",
  },
  {
    id: "demo-folder-home",
    name: "Home",
    icon: "home-outline",
    color: "#f59e0b",
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
      lastUpdated: "2026-08-30T09:12:00.000Z",
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
          value: "northstar-demo",
        },
        {
          id: "demo-github-email",
          module: ModulesEnum.E_MAIL,
          value: "dev-team@example.com",
        },
        {
          id: "demo-github-password",
          module: ModulesEnum.PASSWORD,
          value: "demo.GitHub-2026!safe",
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
      id: "demo-entry-notion",
      title: "Notion Workspace",
      fav: true,
      pinnedAt: "2026-08-30T09:02:00.000Z",
      tags: ["work", "docs", "team"],
      created: now,
      lastUpdated: "2026-08-30T09:14:00.000Z",
      folder: folders[0],
      modules: [
        {
          id: "demo-notion-url",
          module: ModulesEnum.URL,
          value: "https://www.notion.so",
        },
        {
          id: "demo-notion-email",
          module: ModulesEnum.E_MAIL,
          value: "workspace@example.com",
        },
        {
          id: "demo-notion-password",
          module: ModulesEnum.PASSWORD,
          value: "demo.Notion-Boards-84!",
        },
        {
          id: "demo-notion-workspace",
          module: ModulesEnum.CUSTOM_FIELD,
          title: "Workspace",
          value: "Northstar Product",
          inputType: "text",
        },
        {
          id: "demo-notion-note",
          module: ModulesEnum.NOTE,
          value:
            "Shared demo workspace for launch notes, roadmap planning, and screenshot checklists.",
          displayMode: "normal",
          variant: "plain",
        },
      ],
    },
    {
      id: "demo-entry-figma",
      title: "Figma",
      fav: false,
      tags: ["design", "work"],
      created: now,
      lastUpdated: "2026-08-30T09:18:00.000Z",
      folder: folders[0],
      modules: [
        {
          id: "demo-figma-url",
          module: ModulesEnum.URL,
          value: "https://www.figma.com",
        },
        {
          id: "demo-figma-email",
          module: ModulesEnum.E_MAIL,
          value: "design@example.com",
        },
        {
          id: "demo-figma-password",
          module: ModulesEnum.PASSWORD,
          value: "demo.Figma-Components-31!",
        },
        {
          id: "demo-figma-custom",
          module: ModulesEnum.CUSTOM_FIELD,
          title: "Team URL",
          value: "https://www.figma.com/files/team/demo-clavispass",
          inputType: "text",
        },
      ],
    },
    {
      id: "demo-entry-aws",
      title: "AWS Console",
      fav: false,
      tags: ["work", "cloud", "2fa"],
      created: now,
      lastUpdated: "2026-08-30T09:21:00.000Z",
      folder: folders[0],
      modules: [
        {
          id: "demo-aws-url",
          module: ModulesEnum.URL,
          value: "https://aws.amazon.com/console",
        },
        {
          id: "demo-aws-username",
          module: ModulesEnum.USERNAME,
          value: "demo-admin",
        },
        {
          id: "demo-aws-password",
          module: ModulesEnum.PASSWORD,
          value: "demo.AWS-Console-73!",
        },
        {
          id: "demo-aws-account",
          module: ModulesEnum.CUSTOM_FIELD,
          title: "Account alias",
          value: "northstar-demo-prod",
          inputType: "text",
        },
        {
          id: "demo-aws-totp",
          module: ModulesEnum.TOTP,
          value: "JBSWY3DPEHPK3PXP",
        },
      ],
    },
    {
      id: "demo-entry-proton",
      title: "Proton Mail",
      fav: true,
      pinnedAt: "2026-08-30T09:03:00.000Z",
      tags: ["personal", "email", "2fa"],
      created: now,
      lastUpdated: "2026-08-30T09:25:00.000Z",
      folder: folders[1],
      modules: [
        {
          id: "demo-proton-url",
          module: ModulesEnum.URL,
          value: "https://account.proton.me",
        },
        {
          id: "demo-proton-email",
          module: ModulesEnum.E_MAIL,
          value: "mailbox.demo@example.com",
        },
        {
          id: "demo-proton-password",
          module: ModulesEnum.PASSWORD,
          value: "demo.Proton-Mailbox-91!",
        },
        {
          id: "demo-proton-totp",
          module: ModulesEnum.TOTP,
          value: "JBSWY3DPEHPK3PXP",
        },
      ],
    },
    {
      id: "demo-entry-identity",
      title: "Mira Klein",
      fav: false,
      tags: ["identity", "profile"],
      created: now,
      lastUpdated: "2026-08-30T09:28:00.000Z",
      folder: folders[1],
      modules: [
        {
          id: "demo-identity-person",
          module: ModulesEnum.PERSON,
          title: "Ms.",
          firstName: "Mira",
          middleName: "Elena",
          lastName: "Klein",
          displayName: "Mira E. Klein",
          username: "mira.demo",
        },
        {
          id: "demo-identity-email",
          module: ModulesEnum.E_MAIL,
          value: "mira.klein@example.com",
        },
        {
          id: "demo-identity-phone",
          module: ModulesEnum.PHONE_NUMBER,
          value: "+49 151 2345 6789",
        },
        {
          id: "demo-identity-company",
          module: ModulesEnum.COMPANY,
          name: "Northstar Studio",
          department: "Product",
          jobTitle: "Design Lead",
        },
        {
          id: "demo-identity-address",
          module: ModulesEnum.ADDRESS,
          street1: "Lindenweg 24",
          street2: "Apartment 5B",
          postalCode: "20457",
          city: "Hamburg",
          state: "Hamburg",
          country: "Germany",
        },
      ],
    },
    {
      id: "demo-entry-paypal",
      title: "PayPal",
      fav: false,
      tags: ["finance", "payments", "2fa"],
      created: now,
      lastUpdated: "2026-08-30T09:32:00.000Z",
      folder: folders[2],
      modules: [
        {
          id: "demo-paypal-url",
          module: ModulesEnum.URL,
          value: "https://www.paypal.com/signin",
        },
        {
          id: "demo-paypal-email",
          module: ModulesEnum.E_MAIL,
          value: "payments.demo@example.com",
        },
        {
          id: "demo-paypal-password",
          module: ModulesEnum.PASSWORD,
          value: "demo.PayPal-Receipts-58!",
        },
        {
          id: "demo-paypal-totp",
          module: ModulesEnum.TOTP,
          value: "JBSWY3DPEHPK3PXP",
        },
        {
          id: "demo-paypal-note",
          module: ModulesEnum.NOTE,
          value: "Used only for demo invoices and test subscriptions.",
          displayMode: "compact",
        },
      ],
    },
    {
      id: "demo-entry-credit-card",
      title: "Aurora Travel Visa",
      fav: false,
      tags: ["finance", "card", "travel"],
      created: now,
      lastUpdated: "2026-08-30T09:36:00.000Z",
      folder: folders[2],
      modules: [
        {
          id: "demo-card-credit",
          module: ModulesEnum.CREDIT_CARD,
          cardholderName: "MIRA E KLEIN",
          number: "4242 4242 4242 4242",
          brand: "Visa",
          expiryMonth: "11",
          expiryYear: "2029",
          securityCode: "482",
          bankName: "Aurora Demo Bank",
          note: "Fictional demo card for screenshots. Not a real payment card.",
        },
        { id: "demo-card-pin", module: ModulesEnum.PIN, value: "4826" },
        {
          id: "demo-card-expiry",
          module: ModulesEnum.EXPIRY,
          value: "2029-11-30",
        },
      ],
    },
    {
      id: "demo-entry-bank-card",
      title: "Hanseatic Debit Card",
      fav: false,
      tags: ["finance", "banking"],
      created: now,
      lastUpdated: "2026-08-30T09:38:00.000Z",
      folder: folders[2],
      modules: [
        {
          id: "demo-bank-url",
          module: ModulesEnum.URL,
          value: "https://www.n26.com",
        },
        {
          id: "demo-bank-card",
          module: ModulesEnum.CREDIT_CARD,
          cardholderName: "MIRA E KLEIN",
          number: "5555 4444 3333 1111",
          brand: "Mastercard",
          expiryMonth: "07",
          expiryYear: "2028",
          securityCode: "719",
          bankName: "Hanseatic Demo Bank",
          note: "Demo banking card with fake data.",
        },
        {
          id: "demo-bank-customer",
          module: ModulesEnum.CUSTOM_FIELD,
          title: "Customer ID",
          value: "CUST-8429-DEM",
          inputType: "text",
        },
      ],
    },
    {
      id: "demo-entry-booking",
      title: "Booking.com",
      fav: false,
      tags: ["travel", "hotel"],
      created: now,
      lastUpdated: "2026-08-30T09:42:00.000Z",
      folder: folders[3],
      modules: [
        {
          id: "demo-booking-url",
          module: ModulesEnum.URL,
          value: "https://www.booking.com",
        },
        {
          id: "demo-booking-email",
          module: ModulesEnum.E_MAIL,
          value: "travel.demo@example.com",
        },
        {
          id: "demo-booking-password",
          module: ModulesEnum.PASSWORD,
          value: "demo.Booking-Weekend-64!",
        },
        {
          id: "demo-booking-note",
          module: ModulesEnum.NOTE,
          value:
            "Upcoming demo trip:\n- Hotel check-in after 15:00\n- Late checkout requested\n- Keep passport copy attached",
          displayMode: "normal",
          variant: "markdown",
        },
      ],
    },
    {
      id: "demo-entry-passport",
      title: "Passport",
      fav: false,
      tags: ["document", "travel", "expiry"],
      created: now,
      lastUpdated: "2026-08-30T09:44:00.000Z",
      folder: folders[3],
      modules: [
        {
          id: "demo-passport-document",
          module: ModulesEnum.DOCUMENT,
          documentType: "Passport",
          number: "P-DEMO-847219",
          issuer: "City Office Hamburg",
        },
        {
          id: "demo-passport-attachment",
          module: ModulesEnum.ATTACHMENT,
          files: [
            {
              id: "demo-passport-note",
              name: "passport-demo-note.txt",
              mimeType: "text/plain",
              size: 74,
              dataBase64:
                "RGVtbyBhdHRhY2htZW50IGZvciBzdG9yZSBzY3JlZW5zaG90cy4gTm8gcmVhbCBkb2N1bWVudCBkYXRhLg==",
            },
          ],
        },
        {
          id: "demo-passport-expiry",
          module: ModulesEnum.EXPIRY,
          value: "2031-04-15",
        },
      ],
    },
    {
      id: "demo-entry-airline",
      title: "Lufthansa Miles",
      fav: false,
      tags: ["travel", "loyalty", "card"],
      created: now,
      lastUpdated: "2026-08-30T09:46:00.000Z",
      folder: folders[3],
      modules: [
        {
          id: "demo-airline-url",
          module: ModulesEnum.URL,
          value: "https://www.lufthansa.com",
        },
        {
          id: "demo-airline-username",
          module: ModulesEnum.USERNAME,
          value: "LH-DEMO-482910",
        },
        {
          id: "demo-airline-password",
          module: ModulesEnum.PASSWORD,
          value: "demo.Lufthansa-Miles-29!",
        },
        {
          id: "demo-airline-card",
          module: ModulesEnum.DIGITAL_CARD,
          value: "LH482910DEMO",
          type: "CODE128",
        },
      ],
    },
    {
      id: "demo-entry-netflix",
      title: "Netflix",
      fav: false,
      tags: ["personal", "streaming"],
      created: now,
      lastUpdated: "2026-08-30T09:50:00.000Z",
      folder: folders[1],
      modules: [
        {
          id: "demo-netflix-url",
          module: ModulesEnum.URL,
          value: "https://www.netflix.com/login",
        },
        {
          id: "demo-netflix-email",
          module: ModulesEnum.E_MAIL,
          value: "streaming.demo@example.com",
        },
        {
          id: "demo-netflix-password",
          module: ModulesEnum.PASSWORD,
          value: "demo.Netflix-MovieNight-17!",
        },
        { id: "demo-netflix-pin", module: ModulesEnum.PIN, value: "2048" },
      ],
    },
    {
      id: "demo-entry-spotify",
      title: "Spotify Family",
      fav: false,
      tags: ["personal", "music"],
      created: now,
      lastUpdated: "2026-08-30T09:52:00.000Z",
      folder: folders[1],
      modules: [
        {
          id: "demo-spotify-url",
          module: ModulesEnum.URL,
          value: "https://www.spotify.com/account",
        },
        {
          id: "demo-spotify-email",
          module: ModulesEnum.E_MAIL,
          value: "music.demo@example.com",
        },
        {
          id: "demo-spotify-password",
          module: ModulesEnum.PASSWORD,
          value: "demo.Spotify-Playlist-63!",
        },
        {
          id: "demo-spotify-renewal",
          module: ModulesEnum.EXPIRY,
          value: "2027-01-12",
        },
      ],
    },
    {
      id: "demo-entry-home-wifi",
      title: "Home WiFi",
      fav: true,
      tags: ["wifi", "home", "qr"],
      created: now,
      lastUpdated: "2026-08-30T09:55:00.000Z",
      folder: folders[5],
      modules: [
        {
          id: "demo-home-wifi",
          module: ModulesEnum.WIFI,
          wifiName: "Northstar Guest",
          wifiType: "WPA",
          hidden: false,
          value: "demo-wifi-blue-harbor-42",
        },
        {
          id: "demo-home-router-url",
          module: ModulesEnum.URL,
          value: "http://192.168.1.1",
        },
        {
          id: "demo-home-router-user",
          module: ModulesEnum.USERNAME,
          value: "admin-demo",
        },
      ],
    },
    {
      id: "demo-entry-api-keys",
      title: "API Keys",
      fav: false,
      tags: ["developer", "secret", "keys"],
      created: now,
      lastUpdated: "2026-08-30T10:00:00.000Z",
      folder: folders[4],
      modules: [
        {
          id: "demo-api-openai-url",
          module: ModulesEnum.URL,
          value: "https://platform.openai.com/api-keys",
        },
        {
          id: "demo-api-key",
          module: ModulesEnum.KEY,
          value: "sk-demo-not-a-real-api-key-4n7x9p2q",
        },
        {
          id: "demo-api-env",
          module: ModulesEnum.NOTE,
          value:
            "OPENAI_API_KEY=sk-demo-not-a-real-api-key-4n7x9p2q\nCLAVISPASS_ENV=demo\nSYNC_PROVIDER=dropbox",
          displayMode: "normal",
          variant: "snippet",
          language: "env",
          showLineNumbers: true,
        },
      ],
    },
    {
      id: "demo-entry-server",
      title: "Production SSH",
      fav: false,
      tags: ["server", "ssh", "security"],
      created: now,
      lastUpdated: "2026-08-30T10:04:00.000Z",
      folder: folders[4],
      modules: [
        {
          id: "demo-server-url",
          module: ModulesEnum.URL,
          value: "https://console.hetzner.cloud",
        },
        {
          id: "demo-server-username",
          module: ModulesEnum.USERNAME,
          value: "deploy",
        },
        {
          id: "demo-server-key",
          module: ModulesEnum.KEY,
          value:
            "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDemoKeyForScreenshotsOnly demo@clavispass",
        },
        {
          id: "demo-server-note",
          module: ModulesEnum.NOTE,
          value:
            "Host demo-prod\n  HostName 203.0.113.24\n  User deploy\n  IdentityFile ~/.ssh/demo_prod",
          displayMode: "normal",
          variant: "snippet",
          language: "shell",
          showLineNumbers: true,
        },
      ],
    },
    {
      id: "demo-entry-recovery-kit",
      title: "Recovery Kit",
      fav: false,
      tags: ["security", "backup"],
      created: now,
      lastUpdated: "2026-08-30T10:08:00.000Z",
      folder: folders[4],
      modules: [
        {
          id: "demo-recovery-note",
          module: ModulesEnum.NOTE,
          value:
            "Emergency checklist:\n1. Unlock offline backup\n2. Rotate shared credentials\n3. Verify recovery codes\n4. Export updated vault backup",
          displayMode: "large",
          variant: "markdown",
        },
        {
          id: "demo-recovery-codes",
          module: ModulesEnum.RECOVERY_CODES,
          codes: [
            { code: "SAFE-DEMO-1048-2291", used: false },
            { code: "SAFE-DEMO-6720-1184", used: false },
            { code: "SAFE-DEMO-9305-4472", used: false },
            { code: "SAFE-DEMO-3159-8840", used: true },
          ],
        },
      ],
    },
    {
      id: "demo-entry-checklist",
      title: "Store Release Checklist",
      fav: false,
      tags: ["tasks", "release", "screenshots"],
      created: now,
      lastUpdated: "2026-08-30T10:12:00.000Z",
      folder: folders[0],
      modules: [
        {
          id: "demo-task-1",
          module: ModulesEnum.TASK,
          value: "Capture mobile vault overview screenshot",
          completed: true,
        },
        {
          id: "demo-task-2",
          module: ModulesEnum.TASK,
          value: "Show 2FA, recovery codes, and secure notes",
          completed: true,
        },
        {
          id: "demo-task-3",
          module: ModulesEnum.TASK,
          value: "Review card and document examples",
          completed: false,
        },
        {
          id: "demo-task-4",
          module: ModulesEnum.TASK,
          value: "Export final screenshots for app stores",
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
