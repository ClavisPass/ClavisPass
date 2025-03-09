// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};
use tauri::Manager;
use tauri::{
    CustomMenuItem, LogicalSize, Size, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem, WindowEvent,
};
use tauri_plugin_autostart::MacosLauncher;
use keytar::{delete_password, get_password, set_password};

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
            if let Err(e) = delete_password(service, key) {
                eprintln!("Fehler beim Entfernen des Schlüssels: {:?}", e);
            } else {
                println!("Schlüssel erfolgreich entfernt");
            }
        }
        Err(e) => eprintln!("Schlüssel nicht gefunden: {:?}", e),
    }
}

#[derive(Serialize, Deserialize, Debug)]
struct WindowSize {
    width: f64,
    height: f64,
}

// Dateipfad für das Speichern der Fenstergröße
fn get_window_size_file_path(app_handle: &tauri::AppHandle) -> PathBuf {
    let dir = app_handle.path_resolver().app_data_dir().unwrap();
    if !dir.exists() {
        std::fs::create_dir_all(&dir).unwrap(); // Verzeichnis erstellen, falls nicht vorhanden
    }
    dir.join("window-size.json")
}

// Fenstergröße speichern
fn save_window_size(app_handle: &tauri::AppHandle, size: WindowSize) {
    let size_file = get_window_size_file_path(app_handle);
    if let Ok(json) = serde_json::to_string(&size) {
        if let Err(e) = fs::write(size_file, json) {
            eprintln!("Fehler beim Speichern der Fenstergröße: {:?}", e);
        }
    }
}

// Fenstergröße laden
fn load_window_size(app_handle: &tauri::AppHandle) -> Option<WindowSize> {
    let size_file = get_window_size_file_path(app_handle);
    println!("Lade Fenstergröße aus: {:?}", size_file); // Debugging
    if size_file.exists() {
        if let Ok(data) = fs::read_to_string(size_file) {
            println!("Geladene Daten: {}", data); // Debugging
            if let Ok(size) = serde_json::from_str::<WindowSize>(&data) {
                return Some(size);
            }
        }
    }
    None
}

fn main() {
    let show = CustomMenuItem::new("show".to_string(), "Open");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .setup(|app| {
            let app_handle = app.handle();
            let main_window = app.get_window("main").unwrap();

            // Fenstergröße beim Start setzen
            if let Some(size) = load_window_size(&app_handle) {
                if size.width > 0.0 && size.height > 0.0 {
                    main_window
                        .set_size(Size::Logical(LogicalSize::new(size.width, size.height)))
                        .unwrap();
                }
            }

            Ok(())
        })
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.unminimize().unwrap();
                window.set_focus().unwrap();
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
        .on_window_event(|event| {
            if let WindowEvent::Resized(size) = event.event() {
                let app_handle = event.window().app_handle();
                let size_data = WindowSize {
                    width: size.width as f64,
                    height: size.height as f64,
                };
                save_window_size(&app_handle, size_data);
            }

            if let tauri::WindowEvent::CloseRequested { api, .. } = event.event() {
                println!("Schließen angefordert, Fenster wird versteckt."); // Debugging
                event.window().hide().unwrap();
                api.prevent_close();
            }
        })
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .invoke_handler(tauri::generate_handler![save_key, get_key, remove_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}