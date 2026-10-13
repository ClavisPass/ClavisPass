const fs = require("fs");
const https = require("https");
const os = require("os");
const path = require("path");
const zlib = require("zlib");

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

function download(file, sourceUrl = url) {
  return new Promise((resolve, reject) => {
    const request = https.get(sourceUrl, (response) => {
      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        response.resume();
        download(file, new URL(response.headers.location, sourceUrl).toString())
          .then(resolve)
          .catch(reject);
        return;
      }

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

function findEndOfCentralDirectory(buffer) {
  const signature = 0x06054b50;
  const minOffset = Math.max(0, buffer.length - 0xffff - 22);

  for (let offset = buffer.length - 22; offset >= minOffset; offset--) {
    if (buffer.readUInt32LE(offset) === signature) {
      return offset;
    }
  }

  throw new Error("Downloaded sodium AAR is not a valid ZIP archive.");
}

function readZipEntries(archive) {
  const buffer = fs.readFileSync(archive);
  const entries = new Map();
  const eocdOffset = findEndOfCentralDirectory(buffer);
  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  let centralOffset = buffer.readUInt32LE(eocdOffset + 16);

  for (let index = 0; index < entryCount; index++) {
    if (buffer.readUInt32LE(centralOffset) !== 0x02014b50) {
      throw new Error("Downloaded sodium AAR has an invalid central directory.");
    }

    const method = buffer.readUInt16LE(centralOffset + 10);
    const compressedSize = buffer.readUInt32LE(centralOffset + 20);
    const fileNameLength = buffer.readUInt16LE(centralOffset + 28);
    const extraLength = buffer.readUInt16LE(centralOffset + 30);
    const commentLength = buffer.readUInt16LE(centralOffset + 32);
    const localOffset = buffer.readUInt32LE(centralOffset + 42);
    const name = buffer
      .subarray(centralOffset + 46, centralOffset + 46 + fileNameLength)
      .toString("utf8");

    if (buffer.readUInt32LE(localOffset) !== 0x04034b50) {
      throw new Error(`Downloaded sodium AAR has an invalid local header for ${name}.`);
    }

    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);

    if (method === 0) {
      entries.set(name, Buffer.from(compressed));
    } else if (method === 8) {
      entries.set(name, zlib.inflateRawSync(compressed));
    }

    centralOffset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

async function main() {
  if (!fs.existsSync(sodiumRoot)) {
    console.log("[prepare-sodium-16kb] react-native-sodium-jsi not installed, skipping.");
    return;
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "clavispass-sodium-"));
  const archive = path.join(tempRoot, `sodium-${version}.aar`);

  try {
    await download(archive);
    const zipEntries = readZipEntries(archive);

    for (const [prefabAbi, packageArch, androidAbi] of targets) {
      const source = [
        "prefab",
        "modules",
        "sodium",
        "libs",
        prefabAbi,
        "libsodium.so",
      ].join("/");
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

      const sourceContent = zipEntries.get(source);

      if (!sourceContent) {
        throw new Error(`Missing compatible libsodium binary: ${source}`);
      }

      fs.mkdirSync(path.dirname(packageDestination), { recursive: true });
      fs.mkdirSync(path.dirname(androidDestination), { recursive: true });
      fs.writeFileSync(packageDestination, sourceContent);
      fs.writeFileSync(androidDestination, sourceContent);
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
