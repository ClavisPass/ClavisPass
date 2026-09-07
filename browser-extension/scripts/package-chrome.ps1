param(
  [string]$DistDir = "dist",
  [string]$ArtifactsDir = "artifacts",
  [string]$ArchiveName = ""
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $projectRoot $DistDir
$artifactsPath = Join-Path $projectRoot $ArtifactsDir
$tempRoot = Join-Path $projectRoot ".tmp-chrome-package"
$tempPackageDir = Join-Path $tempRoot "package"
$packageJsonPath = Join-Path $projectRoot "package.json"
$packageJson = Get-Content -LiteralPath $packageJsonPath -Raw | ConvertFrom-Json
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

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
      [System.IO.File]::WriteAllText($_.FullName, $updated, $utf8NoBom)
    }
  }
}

if ([string]::IsNullOrWhiteSpace($ArchiveName)) {
  $ArchiveName = "clavispass-chrome-$($packageJson.version).zip"
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

if ($manifest.PSObject.Properties.Name -contains "browser_specific_settings") {
  $manifest.PSObject.Properties.Remove("browser_specific_settings")
}

if (!$manifest.background -or !$manifest.background.service_worker) {
  throw "Chrome package requires a Manifest V3 background.service_worker entry."
}

if ($manifest.background.PSObject.Properties.Name -contains "scripts") {
  $manifest.background.PSObject.Properties.Remove("scripts")
}

$manifestJson = $manifest | ConvertTo-Json -Depth 20
[System.IO.File]::WriteAllText($manifestPath, $manifestJson, $utf8NoBom)

Disable-UnusedReactDomHtmlInjectionPaths -PackageDirectory $tempPackageDir
New-ZipArchiveFromDirectory -SourceDirectory $tempPackageDir -DestinationPath $archivePath
Remove-Item -LiteralPath $tempRoot -Recurse -Force

Write-Host "Chrome release archive created:" $archivePath
