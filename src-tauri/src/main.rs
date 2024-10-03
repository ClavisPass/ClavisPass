// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};
use tauri_plugin_autostart::MacosLauncher;

use keytar::{set_password, get_password, delete_password};

#[tauri::command]
fn save_key(key: &str, value: &str) {
    let service = "ClavisPass";
    set_password(service, key, value).unwrap();
}

#[tauri::command]
fn get_key(key: &str) -> Option<String> {
    let service = "ClavisPass";
    match get_password(service, key) {
        Ok(password) => Some(password.password),
        Err(e) => {
            // Fehlerausgabe, um zu sehen, warum es fehlschlägt
            eprintln!("Fehler beim Abrufen des Passworts: {:?}", e);
            None
        }
    }
}

#[tauri::command]
fn remove_key(key: &str) {
    let service = "ClavisPass";
    match get_password(service, key) {
        Ok(_) => {
            // Schlüssel existiert, also versuche ihn zu löschen
            if let Err(e) = delete_password(service, key) {
                eprintln!("Fehler beim Entfernen des Schlüssels: {:?}", e);
            } else {
                println!("Schlüssel erfolgreich entfernt");
            }
        }
        Err(e) => eprintln!("Schlüssel nicht gefunden: {:?}", e),
    }
}

fn main() {
    let show = CustomMenuItem::new("show".to_string(), "Öffnen");
    let quit = CustomMenuItem::new("quit".to_string(), "Schließen");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.unminimize().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::RightClick {
                position: _,
                size: _,
                ..
            } => {
                println!("system tray received a right click");
            }
            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                println!("system tray received a double click");
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    window.unminimize().unwrap();
                    window.set_focus().unwrap();
                }
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        }) //additional code for tauri
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .invoke_handler(tauri::generate_handler![save_key, get_key, remove_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
