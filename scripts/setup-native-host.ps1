[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [Parameter(Mandatory = $false)]
  [string]$HostExecutablePath,

  [Parameter(Mandatory = $false)]
  [string]$ManifestOutputDirectory,

  [Parameter(Mandatory = $false)]
  [string]$ChromiumExtensionId,

  [Parameter(Mandatory = $false)]
  [string]$EdgeExtensionId,

  [Parameter(Mandatory = $false)]
  [string]$ChromeExtensionId,

  [Parameter(Mandatory = $false)]
  [string[]]$ChromiumExtensionIds,

  [Parameter(Mandatory = $false)]
  [string[]]$AdditionalChromiumOrigins,

  [Parameter(Mandatory = $false)]
  [string]$FirefoxExtensionId = "clavispass-extension@clavispass.local",

  [switch]$SkipChromium,
  [switch]$SkipFirefox
)

$ErrorActionPreference = "Stop"

$nativeHostName = "com.clavispass.native_host"
$scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$chromiumOrigins = @()

if ([string]::IsNullOrWhiteSpace($HostExecutablePath)) {
  $HostExecutablePath = Join-Path $scriptRoot "..\src-tauri\target\debug\clavispass_native_host.exe"
}

if ([string]::IsNullOrWhiteSpace($ManifestOutputDirectory)) {
  $ManifestOutputDirectory = Join-Path $env:LOCALAPPDATA "ClavisPass\bridge\native-hosts"
}

$resolvedHostPath = [System.IO.Path]::GetFullPath($HostExecutablePath)
$resolvedManifestDir = [System.IO.Path]::GetFullPath($ManifestOutputDirectory)

function Ensure-Directory {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    if ($PSCmdlet.ShouldProcess($Path, "Create directory")) {
      New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
  }
}

function Write-JsonFile {
  param(
    [string]$Path,
    [hashtable]$Content
  )

  $json = $Content | ConvertTo-Json -Depth 8
  if ($PSCmdlet.ShouldProcess($Path, "Write manifest")) {
    Set-Content -LiteralPath $Path -Value $json -Encoding UTF8
  }
}

function Set-RegistryDefaultValue {
  param(
    [string]$RegistryPath,
    [string]$Value
  )

  if ($PSCmdlet.ShouldProcess($RegistryPath, "Register native host manifest")) {
    New-Item -Path $RegistryPath -Force | Out-Null
    New-ItemProperty -Path $RegistryPath -Name "(default)" -Value $Value -PropertyType String -Force | Out-Null
  }
}

function Normalize-ChromiumOrigins {
  param(
    [string]$LegacyChromiumExtensionId,
    [string]$EdgeId,
    [string]$ChromeId,
    [string[]]$ExtensionIds,
    [string[]]$ExtraOrigins
  )

  $ids = @(
    $LegacyChromiumExtensionId
    $EdgeId
    $ChromeId
  ) + $ExtensionIds

  $origins = New-Object System.Collections.Generic.List[string]

  foreach ($id in $ids) {
    if ([string]::IsNullOrWhiteSpace($id)) {
      continue
    }

    $trimmedId = $id.Trim()
    if ($trimmedId -match "^[a-z]{32}$") {
      $origins.Add("chrome-extension://$trimmedId/")
    } else {
      Write-Warning "Skipping invalid Chromium extension ID '$trimmedId'. Expected a 32-character lowercase extension ID."
    }
  }

  foreach ($origin in $ExtraOrigins) {
    if ([string]::IsNullOrWhiteSpace($origin)) {
      continue
    }

    $trimmedOrigin = $origin.Trim()
    if ($trimmedOrigin -match "^chrome-extension://[a-z]{32}/$") {
      $origins.Add($trimmedOrigin)
    } else {
      Write-Warning "Skipping invalid Chromium origin '$trimmedOrigin'. Expected format chrome-extension://<32-char-id>/"
    }
  }

  return $origins | Sort-Object -Unique
}

if (-not (Test-Path -LiteralPath $resolvedHostPath)) {
  throw "Native host executable not found: $resolvedHostPath"
}

Ensure-Directory -Path $resolvedManifestDir

$writtenManifests = @()

if (-not $SkipChromium) {
  $chromiumOrigins = Normalize-ChromiumOrigins `
    -LegacyChromiumExtensionId $ChromiumExtensionId `
    -EdgeId $EdgeExtensionId `
    -ChromeId $ChromeExtensionId `
    -ExtensionIds $ChromiumExtensionIds `
    -ExtraOrigins $AdditionalChromiumOrigins

  if ($chromiumOrigins.Count -eq 0) {
    Write-Warning "No Chromium-family extension origins provided. Chromium/Edge manifest and registry setup will be skipped."
  } else {
    $chromiumManifestPath = Join-Path $resolvedManifestDir "$nativeHostName.chromium.json"
    $chromiumManifest = @{
      name = $nativeHostName
      description = "ClavisPass Native Messaging Host"
      path = $resolvedHostPath
      type = "stdio"
      allowed_origins = @($chromiumOrigins)
    }

    Write-JsonFile -Path $chromiumManifestPath -Content $chromiumManifest
    $writtenManifests += $chromiumManifestPath

    Set-RegistryDefaultValue -RegistryPath "HKCU:\Software\Google\Chrome\NativeMessagingHosts\$nativeHostName" -Value $chromiumManifestPath
    Set-RegistryDefaultValue -RegistryPath "HKCU:\Software\Chromium\NativeMessagingHosts\$nativeHostName" -Value $chromiumManifestPath
    Set-RegistryDefaultValue -RegistryPath "HKCU:\Software\Microsoft\Edge\NativeMessagingHosts\$nativeHostName" -Value $chromiumManifestPath
  }
}

if (-not $SkipFirefox) {
  $firefoxManifestPath = Join-Path $resolvedManifestDir "$nativeHostName.firefox.json"
  $firefoxManifest = @{
    name = $nativeHostName
    description = "ClavisPass Native Messaging Host"
    path = $resolvedHostPath
    type = "stdio"
    allowed_extensions = @(
      $FirefoxExtensionId
    )
  }

  Write-JsonFile -Path $firefoxManifestPath -Content $firefoxManifest
  $writtenManifests += $firefoxManifestPath

  Set-RegistryDefaultValue -RegistryPath "HKCU:\Software\Mozilla\NativeMessagingHosts\$nativeHostName" -Value $firefoxManifestPath
}

Write-Host "Native host setup completed for $nativeHostName"
Write-Host "Host executable: $resolvedHostPath"
Write-Host "Manifest directory: $resolvedManifestDir"

if (-not $SkipChromium -and $chromiumOrigins.Count -gt 0) {
  Write-Host "Configured Chromium-family origins:"
  foreach ($origin in $chromiumOrigins) {
    Write-Host " - $origin"
  }
}

if ($writtenManifests.Count -gt 0) {
  Write-Host "Written manifests:"
  foreach ($manifest in $writtenManifests) {
    Write-Host " - $manifest"
  }
}
