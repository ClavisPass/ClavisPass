use keytar::{delete_password, get_password, set_password};
use std::fs;
use std::time::Duration;
use tauri;
use tauri::{AppHandle, Manager, Size};

#[derive(serde::Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum CloseBehavior {
    Hide,
    Exit,
}

#[cfg(target_os = "windows")]
use windows::Win32::Foundation::HANDLE;
#[cfg(target_os = "windows")]
use windows::Win32::System::DataExchange::{
    CloseClipboard,
    EmptyClipboard,
    OpenClipboard,
    SetClipboardData,
};
#[cfg(target_os = "windows")]
use windows::Win32::System::Memory::{
    GlobalAlloc,
    GlobalLock,
    GlobalUnlock,
    GMEM_MOVEABLE,
};

#[cfg(target_os = "windows")]
const CF_UNICODETEXT_FORMAT: u32 = 13;

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
pub async fn close_main_window(app: AppHandle, behavior: CloseBehavior) -> Result<(), String> {
    match behavior {
        CloseBehavior::Exit => {
            std::thread::spawn(|| {
                std::thread::sleep(Duration::from_secs(5));
                std::process::exit(0);
            });

            app.exit(0);
            Ok(())
        }
        CloseBehavior::Hide => {
            let win = app
                .get_webview_window("main")
                .ok_or("main window not found")?;

            win.hide().map_err(|e| e.to_string())?;

            std::thread::spawn(move || {
                std::thread::sleep(Duration::from_millis(500));

                let Some(win) = app.get_webview_window("main") else {
                    return;
                };

                match win.is_visible() {
                    Ok(true) => {
                        let _ = win.minimize();

                        std::thread::spawn(move || {
                            std::thread::sleep(Duration::from_secs(5));

                            let Some(win) = app.get_webview_window("main") else {
                                return;
                            };

                            if win.is_visible().unwrap_or(false) {
                                std::process::exit(0);
                            }
                        });
                    }
                    Ok(false) => {}
                    Err(error) => {
                        eprintln!("Failed to verify hidden main window: {error}");
                    }
                }
            });

            Ok(())
        }
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

#[tauri::command]
pub async fn clear_clipboard_text() -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        let replacement = "Clipboard cleared";
        let utf16: Vec<u16> = replacement.encode_utf16().chain(std::iter::once(0)).collect();
        let size_in_bytes = utf16.len() * std::mem::size_of::<u16>();

        unsafe {
            OpenClipboard(None).map_err(|e| e.to_string())?;

            let empty_result = EmptyClipboard().map_err(|e| e.to_string());
            if empty_result.is_ok() {
                let memory = GlobalAlloc(GMEM_MOVEABLE, size_in_bytes).map_err(|e| e.to_string())?;
                let locked_ptr = GlobalLock(memory) as *mut u16;

                if locked_ptr.is_null() {
                    let _ = CloseClipboard();
                    return Err("Failed to lock clipboard memory".to_string());
                }

                std::ptr::copy_nonoverlapping(utf16.as_ptr(), locked_ptr, utf16.len());
                let _ = GlobalUnlock(memory);

                SetClipboardData(CF_UNICODETEXT_FORMAT, HANDLE(memory.0))
                    .map_err(|e| e.to_string())?;
            }

            let close_result = CloseClipboard().map_err(|e| e.to_string());
            empty_result?;
            close_result?;
        }

        return Ok(());
    }

    #[cfg(not(target_os = "windows"))]
    {
        Err("Clipboard clear command not implemented for this platform".to_string())
    }
}
