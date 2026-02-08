const { withXcodeProject } = require("@expo/config-plugins");

function setBundleIdForAllConfigurations(xcodeProject, bundleId) {
  const pbxProject = xcodeProject.pbxproj;

  // XCBuildConfiguration sections
  const configs = pbxProject.hash.project.objects["XCBuildConfiguration"];
  for (const key of Object.keys(configs)) {
    const cfg = configs[key];
    if (!cfg || typeof cfg !== "object") continue;
    if (!cfg.buildSettings) continue;

    // Only set when it looks like an app target build setting (common heuristic)
    // If you have multiple targets, we still set for all configs by default.
    cfg.buildSettings.PRODUCT_BUNDLE_IDENTIFIER = bundleId;
  }
}

module.exports = function withIosBundleIdentifier(config) {
  const variant = process.env.APP_VARIANT || "production";
  const prodId = "com.clavispass.app";
  const devId = "com.clavispass.app.dev";
  const bundleId = variant === "development" ? devId : prodId;

  return withXcodeProject(config, (cfg) => {
    if (!cfg.modResults) return cfg;
    setBundleIdForAllConfigurations(cfg.modResults, bundleId);
    return cfg;
  });
};
