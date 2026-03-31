[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [Parameter(Mandatory = $false)]
  [string]$HostExecutablePath,

  [Parameter(Mandatory = $false)]
  [string]$ManifestOutputDirectory,

  [Parameter(Mandatory = $false)]
  [string]$ChromiumExtensionId,

  [Parameter(Mandatory = $false)]
  [string]$FirefoxExtensionId = "clavispass-extension@clavispass.local",

  [switch]$SkipChromium,
  [switch]$SkipFirefox
)

$ErrorActionPreference = "Stop"

$nativeHostName = "com.clavispass.native_host"
$scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }

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

if (-not (Test-Path -LiteralPath $resolvedHostPath)) {
  throw "Native host executable not found: $resolvedHostPath"
}

Ensure-Directory -Path $resolvedManifestDir

$writtenManifests = @()

if (-not $SkipChromium) {
  if ([string]::IsNullOrWhiteSpace($ChromiumExtensionId)) {
    Write-Warning "Chromium extension ID missing. Chromium manifest/registry setup will be skipped."
  } else {
    $chromiumManifestPath = Join-Path $resolvedManifestDir "$nativeHostName.chromium.json"
    $chromiumManifest = @{
      name = $nativeHostName
      description = "ClavisPass Native Messaging Host"
      path = $resolvedHostPath
      type = "stdio"
      allowed_origins = @(
        "chrome-extension://$ChromiumExtensionId/"
      )
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

if ($writtenManifests.Count -gt 0) {
  Write-Host "Written manifests:"
  foreach ($manifest in $writtenManifests) {
    Write-Host " - $manifest"
  }
}
