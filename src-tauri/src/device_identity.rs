use serde::Serialize;

#[derive(Serialize)]
pub struct DeviceIdentity {
  pub hostname: String,
  pub platform: String,
}

#[tauri::command]
pub fn get_device_identity() -> DeviceIdentity {
  let hostname = hostname::get()
    .ok()
    .and_then(|h| h.into_string().ok())
    .unwrap_or_else(|| "Unknown".to_string());

  let os = std::env::consts::OS;
  let arch = std::env::consts::ARCH;
  let platform = format!("{} • {}", os, arch);

  DeviceIdentity { hostname, platform }
}
