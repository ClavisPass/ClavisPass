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

function New-ZipArchiveFromDirectory {
  param(
    [string]$SourceDirectory,
    [string]$DestinationPath
  )

  Add-Type -AssemblyName System.IO.Compression
  Add-Type -AssemblyName System.IO.Compression.FileSystem

  $sourceRoot = [System.IO.Path]::GetFullPath($SourceDirectory).TrimEnd(
    [System.IO.Path]::DirectorySeparatorChar,
    [System.IO.Path]::AltDirectorySeparatorChar
  )

  if (Test-Path $DestinationPath) {
    Remove-Item -LiteralPath $DestinationPath -Force
  }

  $fileStream = [System.IO.File]::Open($DestinationPath, [System.IO.FileMode]::CreateNew)

  try {
    $zip = [System.IO.Compression.ZipArchive]::new(
      $fileStream,
      [System.IO.Compression.ZipArchiveMode]::Create,
      $false
    )

    try {
      Get-ChildItem -LiteralPath $sourceRoot -Recurse -File | ForEach-Object {
        $fullPath = [System.IO.Path]::GetFullPath($_.FullName)
        $relativePath = $fullPath.Substring($sourceRoot.Length).TrimStart("\", "/")
        $entryName = $relativePath -replace "\\", "/"

        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
          $zip,
          $fullPath,
          $entryName,
          [System.IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
      }
    } finally {
      $zip.Dispose()
    }
  } finally {
    $fileStream.Dispose()
  }
}

function Disable-UnusedReactDomHtmlInjectionPaths {
  param([string]$PackageDirectory)

  Get-ChildItem -LiteralPath $PackageDirectory -Recurse -Filter "*.js" | ForEach-Object {
    $content = Get-Content -LiteralPath $_.FullName -Raw
    $updated = $content.Replace("e.innerHTML=t", "e.textContent=t")
    $updated = [regex]::Replace(
      $updated,
      '([A-Za-z_$][A-Za-z0-9_$]*)\.innerHTML=`<svg>`\+([A-Za-z_$][A-Za-z0-9_$]*)\.valueOf\(\)\.toString\(\)\+`</svg>`',
      '$1.textContent=``'
    )
    $updated = [regex]::Replace(
      $updated,
      '([A-Za-z_$][A-Za-z0-9_$]*)=([A-Za-z_$][A-Za-z0-9_$]*)\.createElement\(`div`\),\1\.innerHTML=`<script><\\\/script>`,\1=\1\.removeChild\(\1\.firstChild\)',
      '$1=$2.createElement(`script`)'
    )

    if ($updated -ne $content) {
      Set-Content -LiteralPath $_.FullName -Value $updated -Encoding UTF8 -NoNewline
    }
  }
}

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
    data_collection_permissions = [ordered]@{
      required = @("none")
    }
  }
}

$manifest | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

Disable-UnusedReactDomHtmlInjectionPaths -PackageDirectory $tempPackageDir
New-ZipArchiveFromDirectory -SourceDirectory $tempPackageDir -DestinationPath $archivePath
Remove-Item -LiteralPath $tempRoot -Recurse -Force

Write-Host "Firefox release archive created:" $archivePath
Write-Host "Firefox extension ID:" $FirefoxExtensionId
