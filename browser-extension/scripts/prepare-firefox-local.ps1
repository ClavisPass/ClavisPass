param(
  [string]$DistDir = "dist",
  [string]$OutputDir = "dist-firefox",
  [string]$FirefoxExtensionId = "clavispass@arratel.dev"
)

$ErrorActionPreference = "Stop"
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

$projectRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $projectRoot $DistDir
$outputPath = Join-Path $projectRoot $OutputDir

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

if (!(Test-Path $distPath)) {
  throw "Build output not found at '$distPath'. Run 'npm run build' first."
}

if (!(Test-Path (Join-Path $distPath "manifest.json"))) {
  throw "No manifest.json found in '$distPath'. The extension bundle looks incomplete."
}

if (Test-Path $outputPath) {
  Remove-Item -LiteralPath $outputPath -Recurse -Force
}

New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
Copy-Item -Path (Join-Path $distPath "*") -Destination $outputPath -Recurse -Force

$manifestPath = Join-Path $outputPath "manifest.json"
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json

$manifest.background = [ordered]@{
  scripts = @("background/index.js")
  type = "module"
}

$manifest.browser_specific_settings = [ordered]@{
  gecko = [ordered]@{
    id = $FirefoxExtensionId
    data_collection_permissions = [ordered]@{
      required = @("none")
    }
  }
}

$manifestJson = $manifest | ConvertTo-Json -Depth 20
[System.IO.File]::WriteAllText($manifestPath, $manifestJson, $utf8NoBom)

Disable-UnusedReactDomHtmlInjectionPaths -PackageDirectory $outputPath

Write-Host "Firefox local extension prepared:" $outputPath
Write-Host "Load this manifest in about:debugging:" (Join-Path $outputPath "manifest.json")
