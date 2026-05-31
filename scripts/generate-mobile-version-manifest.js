const fs = require("fs");

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function writeJson(path, obj) {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2) + "\n");
}

const versionData = readJson("version.json");
const latest = versionData.version;

if (!latest) {
  console.error("version.json is missing 'version'");
  process.exit(1);
}

const tagName = process.env.GITHUB_REF_NAME || `v${latest}`;
const repository = process.env.GITHUB_REPOSITORY || "ClavisPass/ClavisPass";
const releaseUrl =
  process.env.RELEASE_URL ||
  `https://github.com/${repository}/releases/download/${tagName}`;
const androidApkFilename =
  process.env.ANDROID_APK_FILENAME || `ClavisPass_${latest}_android.apk`;
const minimumSupported =
  process.env.MOBILE_MINIMUM_SUPPORTED ||
  versionData.minimumSupportedMobileVersion ||
  versionData.minimumSupported ||
  latest;

writeJson("mobile-version.json", {
  latest,
  minimumSupported,
  downloadUrl: `https://github.com/${repository}/releases/latest`,
  androidApkUrl: `${releaseUrl}/${androidApkFilename}`,
  message: {
    de: "Bitte installiere die neueste App-Version.",
    en: "Please install the latest app version.",
  },
});

console.log(
  `Generated mobile-version.json for ${latest} (minimumSupported ${minimumSupported})`,
);
