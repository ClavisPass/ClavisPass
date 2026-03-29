use keytar::{delete_password, get_password, set_password};
use std::fs;
use tauri;
use tauri::{AppHandle, Manager, Size};

#[tauri::command]
pub fn save_key(key: &str, value: &str) {
    let service = "ClavisPass";
    set_password(service, key, value).unwrap();
}

#[tauri::command]
pub fn get_key(key: &str) -> Option<String> {
    let service = "ClavisPass";
    match get_password(service, key) {
        Ok(password) => Some(password.password),
        Err(e) => {
            eprintln!("Fehler beim Abrufen des Passworts: {:?}", e);
            None
        }
    }
}

#[tauri::command]
pub fn remove_key(key: &str) {
    let service = "ClavisPass";
    match get_password(service, key) {
        Ok(_) => {
            if let Err(e) = delete_password(service, key) {
                eprintln!("Fehler beim Entfernen des Schlüssels: {:?}", e);
            } else {
                println!("Schlüssel erfolgreich entfernt");
            }
        }
        Err(e) => eprintln!("Schlüssel nicht gefunden: {:?}", e),
    }
}

#[tauri::command]
pub async fn set_content_protection(app: AppHandle, enabled: bool) -> Result<(), String> {
  let win = app
    .get_webview_window("main")
    .ok_or("main window not found")?;

  win.set_content_protected(enabled).map_err(|e| e.to_string())?;
  Ok(())
}

#[tauri::command]
pub async fn reset_window_size(app: AppHandle) -> Result<(), String> {
    let win = app
        .get_webview_window("main")
        .ok_or("main window not found")?;

    let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let size_file = app_data_dir.join("window-size.json");

    if size_file.exists() {
        fs::remove_file(&size_file).map_err(|e| e.to_string())?;
    }

    win.set_size(Size::Logical(tauri::LogicalSize::new(601.0, 400.0)))
        .map_err(|e| e.to_string())?;
    win.center().map_err(|e| e.to_string())?;

    Ok(())
}
