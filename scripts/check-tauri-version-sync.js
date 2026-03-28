const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

const VERSION_MAP = [
  { rustCrate: "tauri", npmPackage: "@tauri-apps/api" },
  { rustCrate: "tauri-plugin-updater", npmPackage: "@tauri-apps/plugin-updater" },
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function parseCargoLockVersions(lockContent) {
  const versions = new Map();
  const packageBlocks = lockContent.split("[[package]]");

  for (const block of packageBlocks) {
    const nameMatch = block.match(/^\s*name\s*=\s*"([^"]+)"/m);
    const versionMatch = block.match(/^\s*version\s*=\s*"([^"]+)"/m);

    if (!nameMatch || !versionMatch) {
      continue;
    }

    versions.set(nameMatch[1], versionMatch[1]);
  }

  return versions;
}

function getNpmLockVersion(packageLock, packageName) {
  const packageEntry = packageLock.packages?.[`node_modules/${packageName}`];
  if (packageEntry?.version) {
    return packageEntry.version;
  }

  return packageLock.dependencies?.[packageName]?.version ?? null;
}

function getMajorMinor(version) {
  const match = String(version).match(/^(\d+)\.(\d+)/);
  return match ? `${match[1]}.${match[2]}` : null;
}

function collectMismatches() {
  const packageLock = readJson("package-lock.json");
  const cargoVersions = parseCargoLockVersions(readText("src-tauri/Cargo.lock"));
  const mismatches = [];

  for (const { rustCrate, npmPackage } of VERSION_MAP) {
    const rustVersion = cargoVersions.get(rustCrate) ?? null;
    const npmVersion = getNpmLockVersion(packageLock, npmPackage);

    if (!rustVersion || !npmVersion || getMajorMinor(rustVersion) !== getMajorMinor(npmVersion)) {
      mismatches.push({
        rustCrate,
        rustVersion: rustVersion ?? "missing",
        npmPackage,
        npmVersion: npmVersion ?? "missing",
      });
    }
  }

  return mismatches;
}

const mismatches = collectMismatches();

if (mismatches.length > 0) {
  console.error("Tauri version mismatch detected between Cargo.lock and package-lock.json:");
  for (const mismatch of mismatches) {
    console.error(
      `- ${mismatch.rustCrate} (${mismatch.rustVersion}) <> ${mismatch.npmPackage} (${mismatch.npmVersion})`
    );
  }

  console.error("");
  console.error("Recommended fix:");
  console.error("- Do not run `cargo update` as part of the release bump.");
  console.error("- Upgrade Tauri dependencies intentionally on both JS and Rust sides.");
  console.error("- Regenerate both lockfiles only after both sides target the same minor release.");
  process.exit(1);
}

console.log("Tauri versions are aligned between Cargo.lock and package-lock.json.");
