param(
  [string]$DistDir = "dist",
  [string]$ArtifactsDir = "artifacts",
  [string]$ArchiveName = "clavispass-firefox-test.zip"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $projectRoot $DistDir
$artifactsPath = Join-Path $projectRoot $ArtifactsDir
$archivePath = Join-Path $artifactsPath $ArchiveName
$tempRoot = Join-Path $projectRoot ".tmp-firefox-package"
$tempPackageDir = Join-Path $tempRoot "package"

if (!(Test-Path $distPath)) {
  throw "Build output not found at '$distPath'. Run 'npm run build' first."
}

if (!(Test-Path (Join-Path $distPath "manifest.json"))) {
  throw "No manifest.json found in '$distPath'. The extension bundle looks incomplete."
}

if (!(Test-Path $artifactsPath)) {
  New-Item -ItemType Directory -Path $artifactsPath | Out-Null
}

if (Test-Path $archivePath) {
  Remove-Item -LiteralPath $archivePath -Force
}

if (Test-Path $tempRoot) {
  Remove-Item -LiteralPath $tempRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $tempPackageDir -Force | Out-Null
Copy-Item -Path (Join-Path $distPath "*") -Destination $tempPackageDir -Recurse -Force
Compress-Archive -Path (Join-Path $tempPackageDir "*") -DestinationPath $archivePath -Force
Remove-Item -LiteralPath $tempRoot -Recurse -Force

Write-Host "Firefox test archive created:" $archivePath
