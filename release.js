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

function cargoLockHasVersion(path, packageName, version) {
  if (!fs.existsSync(path)) return true;
  const cargoLock = fs.readFileSync(path, "utf-8");
  const escapedName = packageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matcher = new RegExp(
    `\\[\\[package\\]\\][\\s\\S]*?name\\s*=\\s*"${escapedName}"[\\s\\S]*?version\\s*=\\s*"${escapedVersion}"`,
    "m",
  );
  return matcher.test(cargoLock);
}

function tauriConfigHasVersion(path, version) {
  if (!fs.existsSync(path)) return true;
  return readJson(path).version === version;
}

function androidGradleHasVersionName(path, version) {
  if (!fs.existsSync(path)) return true;
  const gradle = fs.readFileSync(path, "utf-8");
  const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^\\s*versionName\\s+"${escapedVersion}"`, "m").test(
    gradle,
  );
}

function androidStringsHasRuntimeVersion(path, runtimeVersion) {
  if (!fs.existsSync(path)) return true;
  const stringsXml = fs.readFileSync(path, "utf-8");
  const escapedRuntimeVersion = runtimeVersion.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
  return new RegExp(
    `<string\\s+name="expo_runtime_version">${escapedRuntimeVersion}</string>`,
  ).test(stringsXml);
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
  const cargoLockOk = cargoLockHasVersion("src-tauri/Cargo.lock", "ClavisPass", version);
  const tauriConfOk = tauriConfigHasVersion("src-tauri/tauri.conf.json", version);
  const tauriConfigOk = tauriConfigHasVersion(
    "src-tauri/tauri.config.json",
    version,
  );
  const androidGradleOk = androidGradleHasVersionName(
    "android/app/build.gradle",
    version,
  );
  const androidRuntimeOk = androidStringsHasRuntimeVersion(
    "android/app/src/main/res/values/strings.xml",
    runtimeVersion,
  );

  return (
    packageOk &&
    appOk &&
    cargoOk &&
    cargoLockOk &&
    tauriConfOk &&
    tauriConfigOk &&
    androidGradleOk &&
    androidRuntimeOk
  );
}

function syncCargoLock() {
  if (!fs.existsSync("src-tauri/Cargo.toml")) {
    return;
  }

  execSync("cargo check --manifest-path src-tauri/Cargo.toml", {
    stdio: "inherit",
  });
}

function runReleaseChecks() {
  const checks = [
    { label: "tests", command: "npm run test" },
    { label: "typecheck", command: "npm run typecheck" },
  ];

  for (const check of checks) {
    console.log(`Running release check: ${check.label}...`);
    execSync(check.command, { stdio: "inherit" });
  }
}

function updateAndroidGradleVersionName(path, version) {
  if (!fs.existsSync(path)) return false;

  const gradle = fs.readFileSync(path, "utf-8");
  const nextGradle = gradle.replace(
    /^(\s*versionName\s+)".*?"/m,
    `$1"${version}"`,
  );

  if (nextGradle === gradle) {
    console.warn(`Could not find a versionName field to replace in ${path}`);
    return false;
  }

  fs.writeFileSync(path, nextGradle);
  console.log(`Updated ${path} (versionName)`);
  return true;
}

function updateAndroidExpoRuntimeVersion(path, runtimeVersion) {
  if (!fs.existsSync(path)) return false;

  const stringsXml = fs.readFileSync(path, "utf-8");
  const nextStringsXml = stringsXml.replace(
    /(<string\s+name="expo_runtime_version">).*?(<\/string>)/,
    `$1${runtimeVersion}$2`,
  );

  if (nextStringsXml === stringsXml) {
    console.warn(
      `Could not find an expo_runtime_version string to replace in ${path}`,
    );
    return false;
  }

  fs.writeFileSync(path, nextStringsXml);
  console.log(`Updated ${path} (expo_runtime_version)`);
  return true;
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

updateAndroidGradleVersionName("android/app/build.gradle", version);
updateAndroidExpoRuntimeVersion(
  "android/app/src/main/res/values/strings.xml",
  runtimeVersion,
);

try {
  execSync("node scripts/check-tauri-version-sync.js", { stdio: "inherit" });
} catch (e) {
  console.error("Aborting release because Tauri package versions are not aligned.");
  process.exit(1);
}

try {
  syncCargoLock();
} catch (e) {
  console.error("Aborting release because Cargo.lock could not be synchronized.");
  process.exit(1);
}

waitForVersionTargetsToSettle(version, runtimeVersion, [
  "version.json",
  "package.json",
  "app.json",
  "src-tauri/Cargo.toml",
  "src-tauri/Cargo.lock",
  "src-tauri/tauri.conf.json",
  "src-tauri/tauri.config.json",
  "android/app/build.gradle",
  "android/app/src/main/res/values/strings.xml",
]);

try {
  runReleaseChecks();
} catch (e) {
  console.error("Aborting release because release checks failed.");
  process.exit(1);
}

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
