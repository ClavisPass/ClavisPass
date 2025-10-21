#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, TrayIconEvent},
    // Wichtig: diese Typen so importieren
    webview::NewWindowResponse,
    AppHandle,
    Manager,
    Size,
    Url,
    WebviewUrl,
    WebviewWindowBuilder,
    WindowEvent,
};
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};
use tauri_plugin_deep_link;
use tauri_plugin_global_shortcut;
use tauri_plugin_oauth;
use tauri_plugin_shell;
use tauri_plugin_single_instance;
use tauri_plugin_updater;

mod commands;

#[derive(Serialize, Deserialize, Debug)]
struct WindowSize {
    width: f64,
    height: f64,
}

fn get_window_size_file_path(app_handle: &AppHandle) -> PathBuf {
    let dir = app_handle.path().app_data_dir().unwrap();
    if !dir.exists() {
        std::fs::create_dir_all(&dir).unwrap();
    }
    dir.join("window-size.json")
}

fn save_window_size(app_handle: &AppHandle, size: WindowSize) {
    let size_file = get_window_size_file_path(app_handle);
    if let Ok(json) = serde_json::to_string(&size) {
        if let Err(e) = fs::write(size_file, json) {
            eprintln!("Fehler beim Speichern der Fenstergröße: {:?}", e);
        }
    }
}

fn load_window_size(app_handle: &AppHandle) -> Option<WindowSize> {
    let size_file = get_window_size_file_path(app_handle);
    if size_file.exists() {
        if let Ok(data) = fs::read_to_string(size_file) {
            if let Ok(size) = serde_json::from_str::<WindowSize>(&data) {
                return Some(size);
            }
        }
    }
    None
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_oauth::init())
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
                let _ = window.show();
            } else {
                println!("main window not ready yet");
            }
        }))
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--hidden"]),
        ))
        .setup(|app| {
            let app_handle = app.handle().clone();

            let mut builder = WebviewWindowBuilder::new(
                &app_handle,
                "main",
                WebviewUrl::App("index.html".into()),
            )
            .title("ClavisPass")
            .fullscreen(false)
            .resizable(true)
            .inner_size(601.0, 400.0)
            .min_inner_size(350.0, 350.0)
            .decorations(false)
            .content_protected(true)
            .maximizable(false)
            .use_https_scheme(true)
            .visible(false)
            .devtools(true);

            #[cfg(not(target_os = "macos"))]
            {
                builder = builder.transparent(true);
            }

            let app_handle_for_new_window = app.handle().clone();

            let main_window = builder
                .on_new_window(move |_url, features| {
                    let popup_label = "DropboxAuth";

                    let popup = WebviewWindowBuilder::new(
                        &app_handle_for_new_window,
                        popup_label,
                        WebviewUrl::External(Url::parse("about:blank").unwrap()),
                    )
                    .window_features(features)
                    .build()
                    .expect("failed to build popup window");

                    NewWindowResponse::Create { window: popup }
                })
                .build()?;

            let _ = main_window.center();

            #[cfg(desktop)]
            {
                let autostart_manager = app.autolaunch();

                if let Err(e) = autostart_manager.enable() {
                    eprintln!("Failed to enable autostart: {}", e);
                }

                match autostart_manager.is_enabled() {
                    Ok(enabled) => println!("registered for autostart? {}", enabled),
                    Err(e) => eprintln!("Failed to check autostart status: {}", e),
                }

                if let Err(e) = autostart_manager.disable() {
                    eprintln!("Failed to disable autostart: {}", e);
                }
            }

            // Tray setup
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let show_i = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

            TrayIconBuilder::<tauri::Wry>::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click { button, .. } = event {
                        if button == tauri::tray::MouseButton::Left {
                            let app = tray.app_handle();
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })
                .on_menu_event(
                    |app: &AppHandle<tauri::Wry>, event| match event.id.as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "quit" => {
                            println!("quit menu item was clicked");
                            app.exit(0);
                        }
                        _ => {
                            println!("menu item {:?} not handled", event.id);
                        }
                    },
                )
                .build(app)?;

            // Fenstergröße wiederherstellen
            let app_handle2 = app.handle();
            if let Some(main_window) = app.get_webview_window("main") {
                if let Some(size) = load_window_size(&app_handle2) {
                    if size.width > 0.0 && size.height > 0.0 {
                        let _ = main_window.set_size(Size::Logical(tauri::LogicalSize::new(
                            size.width,
                            size.height,
                        )));
                    }
                }
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            if window.label() == "main" {
                if let WindowEvent::Focused(true) = event {
                    window.show().unwrap();
                }
                if let WindowEvent::Resized(size) = event {
                    let app_handle = window.app_handle();
                    let size_data = WindowSize {
                        width: size.width as f64,
                        height: size.height as f64,
                    };
                    save_window_size(&app_handle, size_data);
                }
                if let WindowEvent::CloseRequested { api, .. } = event {
                    let _ = window.hide();
                    api.prevent_close();
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::save_key,
            commands::get_key,
            commands::remove_key,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
