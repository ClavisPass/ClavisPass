param(
  [string]$DistDir = "dist",
  [string]$ArtifactsDir = "artifacts",
  [string]$ArchiveName = "",
  [string]$FirefoxExtensionId = "clavispass@arratel.dev"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $projectRoot $DistDir
$artifactsPath = Join-Path $projectRoot $ArtifactsDir
$tempRoot = Join-Path $projectRoot ".tmp-firefox-package"
$tempPackageDir = Join-Path $tempRoot "package"
$packageJsonPath = Join-Path $projectRoot "package.json"
$packageJson = Get-Content -LiteralPath $packageJsonPath -Raw | ConvertFrom-Json

if ([string]::IsNullOrWhiteSpace($ArchiveName)) {
  $ArchiveName = "clavispass-firefox-$($packageJson.version).zip"
}

$archivePath = Join-Path $artifactsPath $ArchiveName

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

$manifestPath = Join-Path $tempPackageDir "manifest.json"
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json

$manifest.background = [ordered]@{
  scripts = @("background/index.js")
  type = "module"
}

if (!$manifest.browser_specific_settings) {
  $manifest | Add-Member -MemberType NoteProperty -Name "browser_specific_settings" -Value ([ordered]@{})
}

$manifest.browser_specific_settings = [ordered]@{
  gecko = [ordered]@{
    id = $FirefoxExtensionId
  }
}

$manifest | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

Compress-Archive -Path (Join-Path $tempPackageDir "*") -DestinationPath $archivePath -Force
Remove-Item -LiteralPath $tempRoot -Recurse -Force

Write-Host "Firefox release archive created:" $archivePath
Write-Host "Firefox extension ID:" $FirefoxExtensionId
