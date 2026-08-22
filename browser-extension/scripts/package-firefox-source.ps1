param(
  [string]$ArtifactsDir = "artifacts",
  [string]$ArchiveName = ""
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$artifactsPath = Join-Path $projectRoot $ArtifactsDir
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

if ([string]::IsNullOrWhiteSpace($ArchiveName)) {
  $ArchiveName = "clavispass-firefox-source-$($packageJson.version).zip"
}

$archivePath = Join-Path $artifactsPath $ArchiveName
$tempRoot = Join-Path $projectRoot ".tmp-firefox-source-package"
$tempPackageDir = Join-Path $tempRoot "source"

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

$files = @(
  "README.md",
  "REVIEWER_BUILD.md",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "tsconfig.node.json",
  "vite.config.ts",
  "vite.content.config.ts",
  ".gitignore"
)

foreach ($file in $files) {
  Copy-Item -LiteralPath (Join-Path $projectRoot $file) -Destination $tempPackageDir -Force
}

$directories = @(
  "public",
  "scripts",
  "src"
)

foreach ($directory in $directories) {
  Copy-Item `
    -LiteralPath (Join-Path $projectRoot $directory) `
    -Destination (Join-Path $tempPackageDir $directory) `
    -Recurse `
    -Force
}

New-ZipArchiveFromDirectory -SourceDirectory $tempPackageDir -DestinationPath $archivePath
Remove-Item -LiteralPath $tempRoot -Recurse -Force

Write-Host "Firefox source archive created:" $archivePath
