const { spawnSync } = require("child_process");

const env = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => value !== undefined),
);

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["expo", "export", "--platform", "web", "--output-dir", "dist-demo"],
  {
    cwd: process.cwd(),
    env: {
      ...env,
      EXPO_PUBLIC_CLAVISPASS_DISTRIBUTION: "demo",
    },
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
