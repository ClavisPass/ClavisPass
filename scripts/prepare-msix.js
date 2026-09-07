const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

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

function escapePowerShellSingleQuoted(value) {
  return String(value).replace(/'/g, "''");
}

function createUnplatedTargetSizeIcons() {
  if (process.platform !== "win32") {
    return;
  }

  const source = path.join(tauriDir, "icons", "icon.png");
  const sizes = [16, 20, 24, 30, 32, 36, 40, 44, 48, 60, 64, 72, 80, 96, 256];
  const script = `
Add-Type -AssemblyName System.Drawing
$source = '${escapePowerShellSingleQuoted(source)}'
$outputDir = '${escapePowerShellSingleQuoted(assetsOutputDir)}'
$sourceImage = [System.Drawing.Bitmap]::FromFile($source)
try {
  foreach ($size in @(${sizes.join(",")})) {
    $target = Join-Path $outputDir "Square44x44Logo.targetsize-$($size)_altform-unplated.png"
    $bitmap = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.Clear([System.Drawing.Color]::Transparent)
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.DrawImage($sourceImage, 0, 0, $size, $size)
      $bitmap.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $graphics.Dispose()
      $bitmap.Dispose()
    }
  }
} finally {
  $sourceImage.Dispose()
}
`;

  const result = spawnSync("powershell.exe", [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    script,
  ], {
    cwd: repoRoot,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error("Failed to generate unplated MSIX target-size icons.");
  }
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

createUnplatedTargetSizeIcons();

const manifestSource = path.join(repoRoot, "msix", "Package.appxmanifest");
const manifestTarget = path.join(outputDir, "Package.appxmanifest");
const manifest = fs
  .readFileSync(manifestSource, "utf-8")
  .replace(/Version="[^"]+"/, `Version="${appVersion}"`);

fs.writeFileSync(manifestTarget, manifest);

console.log(`Prepared MSIX staging folder at ${path.relative(repoRoot, outputDir)}`);
console.log(`MSIX package version: ${appVersion}`);
console.log(`Included native host sidecar: ${nativeHostExe ? "yes" : "no"}`);
