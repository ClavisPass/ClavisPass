const fs = require("fs");
const { execSync } = require("child_process");

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
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
  console.log(`Updated ${path}`);
  return true;
}

function readFileSnapshot(path) {
  if (!fs.existsSync(path)) {
    return `${path}::missing`;
  }

  const stat = fs.statSync(path);
  const content = fs.readFileSync(path, "utf-8");
  return `${path}::${stat.mtimeMs}::${content}`;
}

function cargoTomlHasVersion(path, version) {
  if (!fs.existsSync(path)) return true;
  const cargoToml = fs.readFileSync(path, "utf-8");
  return new RegExp(`^version\\s*=\\s*"${version.replace(/\./g, "\\.")}"`, "m").test(
    cargoToml,
  );
}

function tauriConfigHasVersion(path, version) {
  if (!fs.existsSync(path)) return true;
  return readJson(path).version === version;
}

function versionTargetsMatch(version, runtimeVersion) {
  const packageOk =
    !fs.existsSync("package.json") || readJson("package.json").version === version;
  const appJson = fs.existsSync("app.json") ? readJson("app.json") : null;
  const appOk =
    !appJson ||
    (appJson.expo?.version === version &&
      appJson.expo?.runtimeVersion === runtimeVersion);
  const cargoOk = cargoTomlHasVersion("src-tauri/Cargo.toml", version);
  const tauriConfOk = tauriConfigHasVersion("src-tauri/tauri.conf.json", version);
  const tauriConfigOk = tauriConfigHasVersion(
    "src-tauri/tauri.config.json",
    version,
  );

  return packageOk && appOk && cargoOk && tauriConfOk && tauriConfigOk;
}

function waitForVersionTargetsToSettle(version, runtimeVersion, paths, options = {}) {
  const timeoutMs = options.timeoutMs ?? 30000;
  const pollMs = options.pollMs ?? 250;
  const quietMs = options.quietMs ?? 1500;
  const deadline = Date.now() + timeoutMs;
  let lastFingerprint = null;
  let stableSince = null;

  while (Date.now() < deadline) {
    const fingerprint = paths.map(readFileSnapshot).join("\n---\n");
    const targetsMatch = versionTargetsMatch(version, runtimeVersion);

    if (targetsMatch && fingerprint === lastFingerprint) {
      if (stableSince === null) {
        stableSince = Date.now();
      } else if (Date.now() - stableSince >= quietMs) {
        return;
      }
    } else {
      stableSince = null;
      lastFingerprint = fingerprint;
    }

    sleep(pollMs);
  }

  console.error("Aborting release because version files did not settle in time.");
  process.exit(1);
}

const versionPath = "version.json";
if (!fs.existsSync(versionPath)) {
  console.error("version.json not found");
  process.exit(1);
}

const versionData = readJson(versionPath);
const version = versionData.version;
const runtimeVersion = versionData.runtimeVersion;

if (!version) {
  console.error("version.json is missing 'version'");
  process.exit(1);
}
if (!runtimeVersion) {
  console.error("version.json is missing 'runtimeVersion' (required)");
  process.exit(1);
}

const tag = `v${version}`;

console.log(`Preparing release for version ${tag}...`);
console.log(`Expo runtimeVersion: ${runtimeVersion}`);

const filesToUpdate = [
  { path: "package.json", keyPath: ["version"], value: version },
  { path: "app.json", keyPath: ["expo", "version"], value: version },
  { path: "app.json", keyPath: ["expo", "runtimeVersion"], value: runtimeVersion },
];

for (const f of filesToUpdate) {
  if (!fs.existsSync(f.path)) continue;
  const json = readJson(f.path);
  setJsonKeyPath(json, f.keyPath, f.value);
  writeJson(f.path, json);
  console.log(`Updated ${f.path} (${f.keyPath.join(".")})`);
}

const tauriConfUpdated =
  updateTauriConfigVersion("src-tauri/tauri.conf.json", version) |
  updateTauriConfigVersion("src-tauri/tauri.config.json", version);

if (!tauriConfUpdated) {
  console.warn(
    "No Tauri config found at src-tauri/tauri.conf.json or src-tauri/tauri.config.json",
  );
}

const cargoTomlPath = "src-tauri/Cargo.toml";
if (fs.existsSync(cargoTomlPath)) {
  let cargoToml = fs.readFileSync(cargoTomlPath, "utf-8");
  const nextCargoToml = cargoToml.replace(
    /^version\s*=\s*".*?"/m,
    `version = "${version}"`,
  );

  if (nextCargoToml === cargoToml) {
    console.warn(`Could not find a version field to replace in ${cargoTomlPath}`);
  } else {
    cargoToml = nextCargoToml;
    fs.writeFileSync(cargoTomlPath, cargoToml);
    console.log(`Updated ${cargoTomlPath}`);
  }
} else {
  console.warn("src-tauri/Cargo.toml not found; skipping Cargo version sync.");
}

try {
  execSync("node scripts/check-tauri-version-sync.js", { stdio: "inherit" });
} catch (e) {
  console.error("Aborting release because Tauri package versions are not aligned.");
  process.exit(1);
}

waitForVersionTargetsToSettle(version, runtimeVersion, [
  "version.json",
  "package.json",
  "app.json",
  "src-tauri/Cargo.toml",
  "src-tauri/tauri.conf.json",
  "src-tauri/tauri.config.json",
]);

const existingTags = execSync("git tag")
  .toString()
  .split("\n")
  .map((t) => t.trim());
if (existingTags.includes(tag)) {
  console.error(`Tag ${tag} already exists!`);
  process.exit(1);
}

const status = execSync("git status --porcelain").toString().trim();
if (status) {
  execSync("git add .", { stdio: "inherit" });
  execSync(`git commit -m "Release version ${version}"`, { stdio: "inherit" });
  execSync("git push", { stdio: "inherit" });
  execSync(`git tag ${tag}`, { stdio: "inherit" });
  execSync(`git push origin ${tag}`, { stdio: "inherit" });
  console.log("Git commit created and tag pushed.");
} else {
  console.log("Nothing to commit - working directory is clean.");
}

console.log(`Release ${tag} done!`);
