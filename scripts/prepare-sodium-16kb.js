const fs = require("fs");
const https = require("https");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const version = "1.0.22-2";
const url = `https://repo1.maven.org/maven2/io/github/ronickg/sodium/${version}/sodium-${version}.aar`;
const root = path.resolve(__dirname, "..");
const sodiumRoot = path.join(root, "node_modules", "react-native-sodium-jsi");

const targets = [
  ["android.arm64-v8a", "libsodium-android-armv8-a", "arm64-v8a"],
  ["android.armeabi-v7a", "libsodium-android-armv7-a", "armeabi-v7a"],
  ["android.x86", "libsodium-android-i686", "x86"],
  ["android.x86_64", "libsodium-android-westmere", "x86_64"],
];

function download(file) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download sodium AAR: HTTP ${response.statusCode}`));
        response.resume();
        return;
      }

      const output = fs.createWriteStream(file);
      response.pipe(output);
      output.on("finish", () => output.close(resolve));
    });

    request.on("error", reject);
  });
}

function extract(archive, destination) {
  fs.mkdirSync(destination, { recursive: true });
  execFileSync("tar", ["-xf", archive, "-C", destination], { stdio: "inherit" });
}

async function main() {
  if (!fs.existsSync(sodiumRoot)) {
    console.log("[prepare-sodium-16kb] react-native-sodium-jsi not installed, skipping.");
    return;
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "clavispass-sodium-"));
  const archive = path.join(tempRoot, `sodium-${version}.aar`);
  const extracted = path.join(tempRoot, "extracted");

  try {
    await download(archive);
    extract(archive, extracted);

    for (const [prefabAbi, packageArch, androidAbi] of targets) {
      const source = path.join(
        extracted,
        "prefab",
        "modules",
        "sodium",
        "libs",
        prefabAbi,
        "libsodium.so"
      );
      const packageDestination = path.join(
        sodiumRoot,
        "libsodium",
        packageArch,
        "lib",
        "libsodium.so"
      );
      const androidDestination = path.join(
        sodiumRoot,
        "android",
        "lib",
        androidAbi,
        "libsodium.so"
      );

      if (!fs.existsSync(source)) {
        throw new Error(`Missing compatible libsodium binary: ${source}`);
      }

      fs.mkdirSync(path.dirname(packageDestination), { recursive: true });
      fs.mkdirSync(path.dirname(androidDestination), { recursive: true });
      fs.copyFileSync(source, packageDestination);
      fs.copyFileSync(source, androidDestination);
    }

    console.log(`[prepare-sodium-16kb] Installed 16 KB-aligned libsodium ${version}.`);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
