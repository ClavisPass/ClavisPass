const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const tauriDir = path.join(repoRoot, "src-tauri");
const outputDir = path.join(repoRoot, "dist-msix");
const assetsOutputDir = path.join(outputDir, "Assets");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function cleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(source, target) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing required file: ${path.relative(repoRoot, source)}`);
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function firstExisting(paths) {
  return paths.find((candidate) => fs.existsSync(candidate));
}

function toMsixVersion(version) {
  const parts = String(version)
    .replace(/^v/i, "")
    .split(".")
    .map((part) => Number.parseInt(part, 10));

  if (parts.length < 3 || parts.some((part) => !Number.isInteger(part) || part < 0)) {
    throw new Error(`Invalid package version for MSIX: ${version}`);
  }

  return [...parts.slice(0, 3), parts[3] ?? 0].join(".");
}

const packageJson = readJson(path.join(repoRoot, "package.json"));
const appVersion = toMsixVersion(packageJson.version);

const appExe = firstExisting([
  path.join(tauriDir, "target", "x86_64-pc-windows-msvc", "release", "ClavisPass.exe"),
  path.join(tauriDir, "target", "release", "ClavisPass.exe"),
]);

const nativeHostExe = firstExisting([
  path.join(tauriDir, "target", "x86_64-pc-windows-msvc", "release", "clavispass_native_host.exe"),
  path.join(tauriDir, "target", "release", "clavispass_native_host.exe"),
  path.join(tauriDir, "binaries", "clavispass_native_host-x86_64-pc-windows-msvc.exe"),
]);

cleanDir(outputDir);
fs.mkdirSync(assetsOutputDir, { recursive: true });

copyFile(appExe, path.join(outputDir, "ClavisPass.exe"));

if (nativeHostExe) {
  copyFile(nativeHostExe, path.join(outputDir, "clavispass_native_host.exe"));
}

[
  "StoreLogo.png",
  "Square30x30Logo.png",
  "Square44x44Logo.png",
  "Square71x71Logo.png",
  "Square89x89Logo.png",
  "Square107x107Logo.png",
  "Square142x142Logo.png",
  "Square150x150Logo.png",
  "Square284x284Logo.png",
  "Square310x310Logo.png",
].forEach((assetName) => {
  copyFile(
    path.join(tauriDir, "icons", assetName),
    path.join(assetsOutputDir, assetName),
  );
});

const manifestSource = path.join(repoRoot, "msix", "Package.appxmanifest");
const manifestTarget = path.join(outputDir, "Package.appxmanifest");
const manifest = fs
  .readFileSync(manifestSource, "utf-8")
  .replace(/Version="[^"]+"/, `Version="${appVersion}"`);

fs.writeFileSync(manifestTarget, manifest);

console.log(`Prepared MSIX staging folder at ${path.relative(repoRoot, outputDir)}`);
console.log(`MSIX package version: ${appVersion}`);
console.log(`Included native host sidecar: ${nativeHostExe ? "yes" : "no"}`);
