#![cfg_attr(target_os = "windows", windows_subsystem = "windows")]

mod screen_lock;
pub mod bridge;
mod bridge_commands;

use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf, time::Duration};
use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{TrayIconBuilder, TrayIconEvent},
    // Wichtig: diese Typen so importieren
    webview::NewWindowResponse,
    AppHandle,
    Emitter,
    Manager,
    Size,
    WebviewUrl,
    WebviewWindowBuilder,
    WindowEvent,
};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_deep_link;
use tauri_plugin_global_shortcut;
use tauri_plugin_oauth;
use tauri_plugin_shell;
use tauri_plugin_single_instance;
use tauri_plugin_updater;
use tauri_plugin_os;

mod commands;
mod device_identity;

#[derive(Serialize, Deserialize, Debug)]
struct WindowSize {
    width: f64,
    height: f64,
}

const DEFAULT_WINDOW_WIDTH: f64 = 601.0;
const DEFAULT_WINDOW_HEIGHT: f64 = 400.0;
const MIN_WINDOW_WIDTH: f64 = 350.0;
const MIN_WINDOW_HEIGHT: f64 = 350.0;

fn clamp_window_size(size: WindowSize) -> WindowSize {
    WindowSize {
        width: if size.width.is_finite() {
            size.width.max(MIN_WINDOW_WIDTH)
        } else {
            DEFAULT_WINDOW_WIDTH
        },
        height: if size.height.is_finite() {
            size.height.max(MIN_WINDOW_HEIGHT)
        } else {
            DEFAULT_WINDOW_HEIGHT
        },
    }
}

fn clamp_window_size_to_monitor(
    window: &tauri::WebviewWindow,
    requested_size: WindowSize,
) -> WindowSize {
    let mut size = clamp_window_size(requested_size);

    let monitor = window
        .current_monitor()
        .ok()
        .flatten()
        .or_else(|| window.primary_monitor().ok().flatten());

    let Some(monitor) = monitor else {
        return size;
    };

    let scale_factor = monitor.scale_factor().max(0.1);
    let work_area = monitor.work_area();
    let max_width = (work_area.size.width as f64 / scale_factor - 32.0).max(MIN_WINDOW_WIDTH);
    let max_height = (work_area.size.height as f64 / scale_factor - 32.0).max(MIN_WINDOW_HEIGHT);

    size.width = size.width.min(max_width);
    size.height = size.height.min(max_height);

    size
}

fn get_window_size_file_path(app_handle: &AppHandle) -> Option<PathBuf> {
    let dir = app_handle.path().app_data_dir().ok()?;
    if !dir.exists() {
        std::fs::create_dir_all(&dir).ok()?;
    }
    Some(dir.join("window-size.json"))
}

fn save_window_size(app_handle: &AppHandle, size: WindowSize) {
    let Some(size_file) = get_window_size_file_path(app_handle) else {
        eprintln!("Failed to resolve app data directory for window size");
        return;
    };

    if let Ok(json) = serde_json::to_string(&clamp_window_size(size)) {
        if let Err(e) = fs::write(size_file, json) {
            eprintln!("Fehler beim Speichern der Fenstergröße: {:?}", e);
        }
    }
}

fn load_window_size(app_handle: &AppHandle) -> Option<WindowSize> {
    let size_file = get_window_size_file_path(app_handle)?;
    if size_file.exists() {
        if let Ok(data) = fs::read_to_string(size_file) {
            if let Ok(size) = serde_json::from_str::<WindowSize>(&data) {
                return Some(size);
            }
        }
    }
    None
}

fn schedule_hide_watchdog(app_handle: AppHandle) {
    std::thread::spawn(move || {
        std::thread::sleep(Duration::from_millis(500));

        let Some(window) = app_handle.get_webview_window("main") else {
            return;
        };

        if window.is_visible().unwrap_or(false) {
            let _ = window.minimize();

            std::thread::sleep(Duration::from_secs(5));

            let Some(window) = app_handle.get_webview_window("main") else {
                return;
            };

            if window.is_visible().unwrap_or(false) {
                std::process::exit(0);
            }
        }
    });
}

#[cfg(debug_assertions)]
fn prevent_default_plugin() -> tauri::plugin::TauriPlugin<tauri::Wry> {
    use tauri_plugin_prevent_default::Flags;

    tauri_plugin_prevent_default::Builder::new()
        .with_flags(Flags::all().difference(Flags::CONTEXT_MENU))
        .build()
}

#[cfg(not(debug_assertions))]
fn prevent_default_plugin() -> tauri::plugin::TauriPlugin<tauri::Wry> {
    tauri_plugin_prevent_default::init()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(commands::CloseBehaviorState::new())
        .plugin(prevent_default_plugin())
        .plugin(tauri_plugin_os::init())
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
            // Autostart launches always pass --hidden.
            // The frontend decides whether to keep the app hidden or show it
            // based on the persisted START_BEHAVIOR setting.
            Some(vec!["--hidden"]),
        ))
        .setup(|app| {
            if let Err(error) = bridge::session::clear_session() {
                eprintln!("Failed to clear stale browser bridge session on startup: {error}");
            }

            let app_handle = app.handle().clone();
            let started_hidden = std::env::args().any(|arg| arg == "--hidden");

            let builder = WebviewWindowBuilder::new(
                &app_handle,
                "main",
                WebviewUrl::App("index.html".into()),
            )
            .title("ClavisPass")
            .fullscreen(false)
            .resizable(true)
            .inner_size(DEFAULT_WINDOW_WIDTH, DEFAULT_WINDOW_HEIGHT)
            .min_inner_size(MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT)
            .decorations(false);

            #[cfg(any(target_os = "windows", target_os = "linux"))]
            let builder = builder.transparent(true);

            let builder = builder
                .content_protected(true)
                .maximizable(false)
                .use_https_scheme(true)
                .zoom_hotkeys_enabled(false)
                .visible(!started_hidden)
                .devtools(cfg!(debug_assertions));

            let main_window = builder
                .on_new_window(|url, _features| {
                    eprintln!("Blocked webview new-window request: {url}");
                    NewWindowResponse::Deny
                })
                .build()?;

            let _ = main_window.center();

            #[cfg(desktop)]
            {
                let app_handle_for_lock = app.handle().clone();
                screen_lock::start(app_handle_for_lock);
            }
            // Tray setup
            let show_i = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
            let lock_i = MenuItem::with_id(app, "lock_vault", "Lock Vault", true, None::<&str>)?;
            let settings_i = MenuItem::with_id(app, "settings", "Settings", true, None::<&str>)?;
            let separator_i = PredefinedMenuItem::separator(app)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(
                app,
                &[&show_i, &lock_i, &settings_i, &separator_i, &quit_i],
            )?;

            TrayIconBuilder::<tauri::Wry>::with_id("main")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click { button, .. } = event {
                        if button == tauri::tray::MouseButton::Left {
                            let app = tray.app_handle();
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.unminimize();
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
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                            }
                        }
                        "lock_vault" => {
                            let _ = app.emit("tray://lock-vault", ());
                        }
                        "settings" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                            }
                            let _ = app.emit("tray://open-settings", ());
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
            if let Some(main_window) = app.get_webview_window("main") {
                let requested_size = load_window_size(app.handle()).unwrap_or(WindowSize {
                    width: DEFAULT_WINDOW_WIDTH,
                    height: DEFAULT_WINDOW_HEIGHT,
                });
                let size = clamp_window_size_to_monitor(&main_window, requested_size);

                let _ = main_window.set_size(Size::Logical(tauri::LogicalSize::new(
                    size.width,
                    size.height,
                )));
                let _ = main_window.center();
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            if window.label() == "main" {
                if let WindowEvent::Resized(size) = event {
                    let app_handle = window.app_handle();
                    let scale_factor = window.scale_factor().unwrap_or(1.0).max(0.1);
                    let size_data = WindowSize {
                        width: size.width as f64 / scale_factor,
                        height: size.height as f64 / scale_factor,
                    };
                    save_window_size(&app_handle, size_data);
                }
                if let WindowEvent::CloseRequested { api, .. } = event {
                    let app_handle = window.app_handle();
                    let close_behavior = app_handle.state::<commands::CloseBehaviorState>();

                    if close_behavior.should_exit_on_close() {
                        std::thread::spawn(|| {
                            std::thread::sleep(Duration::from_secs(5));
                            std::process::exit(0);
                        });
                        app_handle.exit(0);
                    } else {
                        let _ = window.emit("tray://lock-vault", ());
                        let _ = window.hide();
                        schedule_hide_watchdog(app_handle.clone());
                    }
                    api.prevent_close();
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::save_key,
            commands::get_key,
            commands::remove_key,
            commands::close_main_window,
            commands::set_close_behavior,
            commands::update_tray_menu,
            commands::set_content_protection,
            commands::reset_window_size,
            commands::clear_clipboard_text,
            device_identity::get_device_identity,
            bridge_commands::bridge_publish_session,
            bridge_commands::bridge_clear_session,
            bridge_commands::bridge_list_pending_pairings,
            bridge_commands::bridge_list_paired_clients,
            bridge_commands::bridge_list_rejected_clients,
            bridge_commands::bridge_approve_pairing,
            bridge_commands::bridge_reject_pairing,
            bridge_commands::bridge_revoke_pairing,
            bridge_commands::bridge_claim_pending_writes,
            bridge_commands::bridge_complete_write_request
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


