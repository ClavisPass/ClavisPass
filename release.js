const fs = require("fs");
const { execSync } = require("child_process");

// 1. Hole Version aus version.json
const versionPath = "version.json";
const versionData = JSON.parse(fs.readFileSync(versionPath, "utf-8"));
const version = versionData.version;
const tag = `v${version}`;

console.log(`🚀 Preparing release for version ${tag}...`);

// 2. Dateien synchronisieren
const filesToUpdate = [
  {
    path: "package.json",
    keyPath: ["version"],
  },
  {
    path: "src-tauri/tauri.conf.json",
    keyPath: ["package", "version"],
  },
  {
    path: "app.json", // Expo config (optional)
    keyPath: ["expo", "version"],
  },
];

for (const file of filesToUpdate) {
  if (!fs.existsSync(file.path)) continue;

  const json = JSON.parse(fs.readFileSync(file.path, "utf-8"));
  let ref = json;
  for (let i = 0; i < file.keyPath.length - 1; i++) {
    const key = file.keyPath[i];
    ref[key] = ref[key] || {};
    ref = ref[key];
  }
  const finalKey = file.keyPath[file.keyPath.length - 1];
  ref[finalKey] = version;

  fs.writeFileSync(file.path, JSON.stringify(json, null, 2));
  console.log(`✅ Updated ${file.path}`);
}

// 3. Git commit, tag & push
const tagExists = execSync(`git tag`).toString().split("\n").includes(`v${version}`);
if (tagExists) {
  console.error(`❌ Tag v${version} already exists!`);
  process.exit(1);
}

const status = execSync("git status --porcelain").toString().trim();
if (status) {
  execSync("git add .");
  execSync(`git commit -m "🔖 Release version ${version}"`);
  execSync(`git tag ${tag}`);
  execSync(`git push origin ${tag}`);
  console.log("✅ Git commit created.");
} else {
  console.log("ℹ️  Nothing to commit – working directory is clean.");
}

console.log(`🎉 Release ${tag} committed and pushed!`);
