const fs = require("fs");

// Read version from `version.json`
const versionJsonPath = "version.json";
const versionData = JSON.parse(fs.readFileSync(versionJsonPath, "utf-8"));
const version = versionData.version;

console.log(`🔄 Syncing version: ${version}`);

// Update `package.json`
const packageJsonPath = "package.json";
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
packageJson.version = version;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
console.log("✅ Updated package.json");

// Update `app.json` (Expo configuration)
const appJsonPath = "app.json";
const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
appJson.expo.version = version;
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + "\n");
console.log("✅ Updated app.json");

// Update `tauri.conf.json`
const tauriConfPath = "src-tauri/tauri.conf.json";
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, "utf-8"));
tauriConf.package.version = version;
fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + "\n");
console.log("✅ Updated tauri.conf.json");

console.log("Version synchronization complete!");