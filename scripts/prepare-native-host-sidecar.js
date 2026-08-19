const { execFileSync } = require("node:child_process");
const { copyFileSync, existsSync, mkdirSync, writeFileSync } = require("node:fs");
const { join, resolve } = require("node:path");

const repoRoot = resolve(__dirname, "..");
const tauriDir = join(repoRoot, "src-tauri");
const manifestPath = join(tauriDir, "Cargo.toml");
const binaryName = "clavispass_native_host";

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit"
  });
}

function detectHostTriple() {
  try {
    const value = run("rustc", ["--print", "host-tuple"], { capture: true }).trim();
    if (value) {
      return value;
    }
  } catch {
  }

  const verbose = run("rustc", ["-vV"], { capture: true });
  const match = verbose.match(/^host:\s*(\S+)/m);
  if (!match?.[1]) {
    throw new Error("Could not determine the Rust host target triple.");
  }
  return match[1];
}

const targetTriple =
  process.env.CLAVISPASS_NATIVE_HOST_TARGET ||
  process.env.TAURI_TARGET_TRIPLE ||
  detectHostTriple();

const cargoArgs = [
  "build",
  "--manifest-path",
  manifestPath,
  "--bin",
  binaryName,
  "--release"
];

if (targetTriple) {
  cargoArgs.push("--target", targetTriple);
}

const exe = targetTriple.includes("windows") ? ".exe" : "";
const outputDir = join(tauriDir, "binaries");
const outputPath = join(outputDir, `${binaryName}-${targetTriple}${exe}`);

mkdirSync(outputDir, { recursive: true });
if (!existsSync(outputPath)) {
  writeFileSync(outputPath, "");
}

run("cargo", cargoArgs);

const sourcePath = join(tauriDir, "target", targetTriple, "release", `${binaryName}${exe}`);
copyFileSync(sourcePath, outputPath);

console.log(`Prepared native host sidecar: ${outputPath}`);
