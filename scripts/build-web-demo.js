const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputDir = "dist-demo";
const demoDotenvPath = path.join(process.cwd(), ".env.demo");

const env = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => value !== undefined),
);

const demoEnv = {
  ...env,
  BROWSER: "none",
  CLAVISPASS_DOTENV_PATH: ".env.demo",
  DROPBOX_CLIENT_ID: "",
  GOOGLE_CLIENT_ID: "",
  GOOGLE_CLIENT_ID_ANDROID: "",
  GOOGLE_CLIENT_ID_IOS: "",
  GOOGLE_CLIENT_ID_DESKTOP: "",
  GOOGLE_CLIENT_SECRET_DESKTOP: "",
  EXPO_PUBLIC_CLAVISPASS_DISTRIBUTION: "demo",
};

fs.writeFileSync(
  demoDotenvPath,
  [
    "BROWSER=none",
    "DROPBOX_CLIENT_ID=",
    "GOOGLE_CLIENT_ID=",
    "GOOGLE_CLIENT_ID_ANDROID=",
    "GOOGLE_CLIENT_ID_IOS=",
    "GOOGLE_CLIENT_ID_DESKTOP=",
    "GOOGLE_CLIENT_SECRET_DESKTOP=",
    "",
  ].join("\n"),
);

const command = process.platform === "win32" ? "cmd.exe" : "npx";
const args =
  process.platform === "win32"
    ? ["/d", "/c", `npx expo export --platform web --clear --output-dir ${outputDir}`]
    : ["expo", "export", "--platform", "web", "--clear", "--output-dir", outputDir];

const result = spawnSync(
  command,
  args,
  {
    cwd: process.cwd(),
    env: demoEnv,
    stdio: "inherit",
  },
);

if (result.error) {
  console.error(result.error);
}

try {
  fs.unlinkSync(demoDotenvPath);
} catch {}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

rewriteDemoPublicPaths(path.join(process.cwd(), outputDir));

function rewriteDemoPublicPaths(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      rewriteDemoPublicPaths(entryPath);
      continue;
    }

    if (!/\.(html|js|css)$/.test(entry.name)) {
      continue;
    }

    const source = fs.readFileSync(entryPath, "utf8");
    const rewritten = source
      .replaceAll('"/_expo/', '"./_expo/')
      .replaceAll("'/_expo/", "'./_expo/")
      .replaceAll('"/assets/', '"./assets/')
      .replaceAll("'/assets/", "'./assets/")
      .replaceAll('"/favicon.ico"', '"./favicon.ico"')
      .replaceAll("'/favicon.ico'", "'./favicon.ico'");

    if (rewritten !== source) {
      fs.writeFileSync(entryPath, rewritten);
    }
  }
}

process.exit(0);
