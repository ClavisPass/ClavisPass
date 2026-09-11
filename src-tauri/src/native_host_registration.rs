#[cfg(target_os = "windows")]
use serde_json::json;
#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;
#[cfg(target_os = "windows")]
use std::{fs, io, path::PathBuf, process::Command};
#[cfg(target_os = "windows")]
use tauri::{AppHandle, Manager};

#[cfg(target_os = "windows")]
const NATIVE_HOST_NAME: &str = "com.clavispass.native_host";
#[cfg(target_os = "windows")]
const CREATE_NO_WINDOW: u32 = 0x08000000;
#[cfg(target_os = "windows")]
const FIREFOX_EXTENSION_ID: &str = "clavispass@arratel.dev";

#[cfg(target_os = "windows")]
const CHROME_EXTENSION_IDS: &[&str] = &[
    "ojjkfbkgabdddgajcgfnppgahbfnpppm",
    "ofjldoiimhnlecdapfbkbenogohlbjle",
];
#[cfg(target_os = "windows")]
const EDGE_EXTENSION_IDS: &[&str] = &[];

#[cfg(target_os = "windows")]
fn native_host_candidates(app: &AppHandle<tauri::Wry>) -> Vec<PathBuf> {
    let mut candidates = Vec::new();

    if let Ok(exe) = std::env::current_exe() {
        if let Some(dir) = exe.parent() {
            candidates.push(dir.join("clavispass_native_host.exe"));
            candidates.push(dir.join("clavispass_native_host-x86_64-pc-windows-msvc.exe"));
        }
    }

    if let Ok(resource_dir) = app.path().resource_dir() {
        candidates.push(resource_dir.join("clavispass_native_host.exe"));
        candidates.push(resource_dir.join("clavispass_native_host-x86_64-pc-windows-msvc.exe"));
    }

    candidates
}

#[cfg(target_os = "windows")]
fn find_native_host_exe(app: &AppHandle<tauri::Wry>) -> Option<PathBuf> {
    native_host_candidates(app)
        .into_iter()
        .find(|candidate| candidate.exists())
}

#[cfg(target_os = "windows")]
fn register_manifest(browser_key: &str, manifest_path: &PathBuf) -> io::Result<()> {
    let status = Command::new("reg.exe")
        .args([
            "add",
            browser_key,
            "/ve",
            "/t",
            "REG_SZ",
            "/d",
            &manifest_path.to_string_lossy(),
            "/f",
        ])
        .creation_flags(CREATE_NO_WINDOW)
        .status()?;

    if status.success() {
        Ok(())
    } else {
        Err(io::Error::new(
            io::ErrorKind::Other,
            format!("reg.exe exited with status {status}"),
        ))
    }
}

#[cfg(target_os = "windows")]
fn chromium_origins() -> Vec<String> {
    CHROME_EXTENSION_IDS
        .iter()
        .chain(EDGE_EXTENSION_IDS.iter())
        .filter(|id| id.len() == 32 && id.chars().all(|ch| ch.is_ascii_lowercase()))
        .map(|id| format!("chrome-extension://{id}/"))
        .collect()
}

#[cfg(target_os = "windows")]
pub fn register_native_host(app: &AppHandle<tauri::Wry>) -> io::Result<()> {
    let Some(source_host) = find_native_host_exe(app) else {
        return Err(io::Error::new(
            io::ErrorKind::NotFound,
            "clavispass_native_host.exe was not found next to the app executable or resources",
        ));
    };

    let manifest_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| io::Error::new(io::ErrorKind::Other, error.to_string()))?
        .join("bridge")
        .join("native-hosts");
    let bin_dir = manifest_dir.join("bin");
    let target_host = bin_dir.join("clavispass_native_host.exe");

    fs::create_dir_all(&bin_dir)?;
    fs::copy(&source_host, &target_host)?;

    let firefox_manifest_path = manifest_dir.join(format!("{NATIVE_HOST_NAME}.firefox.json"));
    let firefox_manifest = json!({
        "name": NATIVE_HOST_NAME,
        "description": "ClavisPass Native Messaging Host",
        "path": target_host,
        "type": "stdio",
        "allowed_extensions": [FIREFOX_EXTENSION_ID],
    });
    fs::write(
        &firefox_manifest_path,
        serde_json::to_string_pretty(&firefox_manifest)?,
    )?;
    register_manifest(
        &format!("HKCU\\Software\\Mozilla\\NativeMessagingHosts\\{NATIVE_HOST_NAME}"),
        &firefox_manifest_path,
    )?;

    let origins = chromium_origins();
    if !origins.is_empty() {
        let chromium_manifest_path = manifest_dir.join(format!("{NATIVE_HOST_NAME}.chromium.json"));
        let chromium_manifest = json!({
            "name": NATIVE_HOST_NAME,
            "description": "ClavisPass Native Messaging Host",
            "path": target_host,
            "type": "stdio",
            "allowed_origins": origins,
        });
        fs::write(
            &chromium_manifest_path,
            serde_json::to_string_pretty(&chromium_manifest)?,
        )?;

        for key in [
            format!("HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\{NATIVE_HOST_NAME}"),
            format!("HKCU\\Software\\Chromium\\NativeMessagingHosts\\{NATIVE_HOST_NAME}"),
            format!("HKCU\\Software\\Microsoft\\Edge\\NativeMessagingHosts\\{NATIVE_HOST_NAME}"),
        ] {
            register_manifest(&key, &chromium_manifest_path)?;
        }
    }

    Ok(())
}

#[cfg(not(target_os = "windows"))]
pub fn register_native_host(_app: &tauri::AppHandle<tauri::Wry>) -> std::io::Result<()> {
    Ok(())
}
