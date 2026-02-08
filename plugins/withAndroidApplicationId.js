const fs = require("fs");
const path = require("path");
const { withDangerousMod } = require("@expo/config-plugins");

function patchAndroidAppGradle(contents, applicationId) {
  // Groovy: applicationId "..."
  if (/applicationId\s+["'][^"']+["']/.test(contents)) {
    return contents.replace(/applicationId\s+["'][^"']+["']/, `applicationId "${applicationId}"`);
  }

  // Kotlin DSL: applicationId = "..."
  if (/applicationId\s*=\s*["'][^"']+["']/.test(contents)) {
    return contents.replace(/applicationId\s*=\s*["'][^"']+["']/, `applicationId = "${applicationId}"`);
  }

  // If nothing found, try inserting into defaultConfig block (Groovy)
  if (/defaultConfig\s*{/.test(contents)) {
    return contents.replace(/defaultConfig\s*{/, `defaultConfig {\n        applicationId "${applicationId}"`);
  }

  // Kotlin DSL insert into defaultConfig { ... } is harder reliably; better to fail loudly.
  throw new Error("Could not find applicationId in app Gradle file (Groovy/KTS).");
}

module.exports = function withAndroidApplicationId(config) {
  return withDangerousMod(config, [
    "android",
    async (cfg) => {
      const variant = process.env.APP_VARIANT || "production";
      const prodId = "com.clavispass.app";
      const devId = "com.clavispass.app.dev";
      const applicationId = variant === "development" ? devId : prodId;

      const androidAppDir = path.join(cfg.modRequest.platformProjectRoot, "app");
      const gradleGroovy = path.join(androidAppDir, "build.gradle");
      const gradleKts = path.join(androidAppDir, "build.gradle.kts");

      const target = fs.existsSync(gradleGroovy)
        ? gradleGroovy
        : fs.existsSync(gradleKts)
          ? gradleKts
          : null;

      if (!target) {
        throw new Error("Could not find android/app/build.gradle or build.gradle.kts");
      }

      const before = fs.readFileSync(target, "utf8");
      const after = patchAndroidAppGradle(before, applicationId);

      if (before !== after) {
        fs.writeFileSync(target, after, "utf8");
      }

      return cfg;
    },
  ]);
};
