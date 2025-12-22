const fs = require("fs");
const { execSync } = require("child_process");

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function writeJson(path, obj) {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2) + "\n");
}

function setJsonKeyPath(obj, keyPath, value) {
  let ref = obj;
  for (let i = 0; i < keyPath.length - 1; i++) {
    const key = keyPath[i];
    ref[key] = ref[key] || {};
    ref = ref[key];
  }
  ref[keyPath[keyPath.length - 1]] = value;
}

function updateTauriConfigVersion(path, version) {
  if (!fs.existsSync(path)) return false;
  const json = readJson(path);
  json.version = version;
  writeJson(path, json);
  console.log(`✅ Updated ${path}`);
  return true;
}

// 1) Read version + runtimeVersion from version.json (both REQUIRED)
const versionPath = "version.json";
if (!fs.existsSync(versionPath)) {
  console.error("❌ version.json not found");
  process.exit(1);
}

const versionData = readJson(versionPath);

const version = versionData.version;
const runtimeVersion = versionData.runtimeVersion;

if (!version) {
  console.error("❌ version.json is missing 'version'");
  process.exit(1);
}
if (!runtimeVersion) {
  console.error("❌ version.json is missing 'runtimeVersion' (required)");
  process.exit(1);
}

const tag = `v${version}`;

console.log(`🚀 Preparing release for version ${tag}...`);
console.log(`🧩 Expo runtimeVersion: ${runtimeVersion}`);

// 2) Synchronize versions in multiple files
const filesToUpdate = [
  { path: "package.json", keyPath: ["version"], value: version },

  // Expo
  { path: "app.json", keyPath: ["expo", "version"], value: version },
  { path: "app.json", keyPath: ["expo", "runtimeVersion"], value: runtimeVersion },

  // Tauri (common names across versions)
  // We'll update whichever exists.
];

for (const f of filesToUpdate) {
  if (!fs.existsSync(f.path)) continue;
  const json = readJson(f.path);
  setJsonKeyPath(json, f.keyPath, f.value);
  writeJson(f.path, json);
  console.log(`✅ Updated ${f.path} (${f.keyPath.join(".")})`);
}

// 2a) Tauri config: support both tauri.conf.json and tauri.config.json if present
const tauriConfUpdated =
  updateTauriConfigVersion("src-tauri/tauri.conf.json", version) |
  updateTauriConfigVersion("src-tauri/tauri.config.json", version);

if (!tauriConfUpdated) {
  console.warn("⚠️  No Tauri config found at src-tauri/tauri.conf.json or src-tauri/tauri.config.json");
}

// 2b) Update version in Cargo.toml (src-tauri)
const cargoTomlPath = "src-tauri/Cargo.toml";
if (fs.existsSync(cargoTomlPath)) {
  let cargoToml = fs.readFileSync(cargoTomlPath, "utf-8");

  // Replace first matching version = "x.y.z" line (typical under [package])
  const nextCargoToml = cargoToml.replace(
    /^version\s*=\s*".*?"/m,
    `version = "${version}"`
  );

  if (nextCargoToml === cargoToml) {
    console.warn(`⚠️  Could not find a version field to replace in ${cargoTomlPath}`);
  } else {
    cargoToml = nextCargoToml;
    fs.writeFileSync(cargoTomlPath, cargoToml);
    console.log(`✅ Updated ${cargoTomlPath}`);
  }

  // Keep Cargo.lock consistent
  try {
    execSync("cargo update --manifest-path src-tauri/Cargo.toml", { stdio: "inherit" });
    console.log("✅ Cargo.lock updated");
  } catch (e) {
    console.error("❌ cargo update failed. Fix the error above and re-run.");
    process.exit(1);
  }
} else {
  console.warn("⚠️  src-tauri/Cargo.toml not found; skipping Cargo version sync.");
}

// Ensure Cargo.lock is staged if present
if (fs.existsSync("src-tauri/Cargo.lock")) {
  try {
    execSync("git add src-tauri/Cargo.lock", { stdio: "inherit" });
  } catch {}
}

// 3) Commit, tag and push changes via Git
const existingTags = execSync("git tag").toString().split("\n").map((t) => t.trim());
if (existingTags.includes(tag)) {
  console.error(`❌ Tag ${tag} already exists!`);
  process.exit(1);
}

const status = execSync("git status --porcelain").toString().trim();
if (status) {
  execSync("git add .", { stdio: "inherit" });
  execSync(`git commit -m "🔖 Release version ${version}"`, { stdio: "inherit" });
  execSync(`git tag ${tag}`, { stdio: "inherit" });
  execSync(`git push origin ${tag}`, { stdio: "inherit" });
  console.log("✅ Git commit created and tag pushed.");
} else {
  console.log("ℹ️  Nothing to commit – working directory is clean.");
  // Still push tag? No, because no tag created either. (We didn't create it if nothing changed.)
}

console.log(`🎉 Release ${tag} done!`);
