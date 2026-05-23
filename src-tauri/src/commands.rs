use keytar::{delete_password, get_password, set_password};
use std::fs;
use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::time::Duration;
use tauri;
use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::{AppHandle, Manager, Size, State};

#[derive(serde::Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum CloseBehavior {
    Hide,
    Exit,
}

pub struct CloseBehaviorState {
    exit_on_close: AtomicBool,
    hide_watchdog_generation: AtomicU64,
    resize_save_generation: AtomicU64,
    pending_lock_request: AtomicBool,
}

impl CloseBehaviorState {
    pub fn new() -> Self {
        Self {
            exit_on_close: AtomicBool::new(true),
            hide_watchdog_generation: AtomicU64::new(0),
            resize_save_generation: AtomicU64::new(0),
            pending_lock_request: AtomicBool::new(false),
        }
    }

    pub fn set_behavior(&self, behavior: &CloseBehavior) {
        self.exit_on_close
            .store(matches!(behavior, CloseBehavior::Exit), Ordering::Relaxed);
    }

    pub fn should_exit_on_close(&self) -> bool {
        self.exit_on_close.load(Ordering::Relaxed)
    }

    pub fn begin_hide_watchdog(&self) -> u64 {
        self.hide_watchdog_generation
            .fetch_add(1, Ordering::Relaxed)
            .saturating_add(1)
    }

    pub fn cancel_hide_watchdog(&self) {
        let _ = self
            .hide_watchdog_generation
            .fetch_add(1, Ordering::Relaxed);
    }

    pub fn is_current_hide_watchdog(&self, generation: u64) -> bool {
        self.hide_watchdog_generation.load(Ordering::Relaxed) == generation
    }

    pub fn schedule_resize_save(&self) -> u64 {
        self.resize_save_generation
            .fetch_add(1, Ordering::Relaxed)
            .saturating_add(1)
    }

    pub fn is_current_resize_save(&self, generation: u64) -> bool {
        self.resize_save_generation.load(Ordering::Relaxed) == generation
    }

    pub fn mark_pending_lock_request(&self) {
        self.pending_lock_request.store(true, Ordering::Relaxed);
    }

    pub fn claim_pending_lock_request(&self) -> bool {
        self.pending_lock_request.swap(false, Ordering::Relaxed)
    }
}

fn default_true() -> bool {
    true
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TrayMenuLabels {
    show: String,
    lock_vault: String,
    settings: String,
    #[serde(default = "default_true")]
    settings_enabled: bool,
    quit: String,
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

fn schedule_exit_watchdog() {
    std::thread::spawn(|| {
        std::thread::sleep(Duration::from_secs(5));
        std::process::exit(0);
    });
}

fn schedule_hide_watchdog(app: AppHandle, generation: u64) {
    std::thread::spawn(move || {
        std::thread::sleep(Duration::from_millis(500));

        let state = app.state::<CloseBehaviorState>();
        if !state.is_current_hide_watchdog(generation) {
            return;
        }

        let Some(win) = app.get_webview_window("main") else {
            return;
        };

        match win.is_visible() {
            Ok(true) => {
                let _ = win.minimize();

                std::thread::sleep(Duration::from_secs(5));

                let state = app.state::<CloseBehaviorState>();
                if !state.is_current_hide_watchdog(generation) {
                    return;
                }

                let Some(win) = app.get_webview_window("main") else {
                    return;
                };

                if win.is_visible().unwrap_or(false) {
                    std::process::exit(0);
                }
            }
            Ok(false) => {}
            Err(error) => {
                eprintln!("Failed to verify hidden main window: {error}");
            }
        }
    });
}

#[tauri::command]
pub fn save_key(key: &str, value: &str) -> Result<(), String> {
    let service = "ClavisPass";
    set_password(service, key, value)
        .map(|_| ())
        .map_err(|error| format!("Failed to save secure key: {error:?}"))
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
pub fn remove_key(key: &str) -> Result<(), String> {
    let service = "ClavisPass";
    match get_password(service, key) {
        Ok(_) => {
            if let Err(e) = delete_password(service, key) {
                eprintln!("Failed to remove secure key: {:?}", e);
                Err(format!("Failed to remove secure key: {e:?}"))
            } else {
                println!("Secure key removed");
                Ok(())
            }
        }
        Err(e) => {
            eprintln!("Secure key not found: {:?}", e);
            Ok(())
        }
    }
}

#[tauri::command]
pub async fn close_main_window(
    app: AppHandle,
    state: State<'_, CloseBehaviorState>,
    behavior: CloseBehavior,
) -> Result<(), String> {
    state.set_behavior(&behavior);

    match behavior {
        CloseBehavior::Exit => {
            schedule_exit_watchdog();
            app.exit(0);
            Ok(())
        }
        CloseBehavior::Hide => {
            let win = app
                .get_webview_window("main")
                .ok_or("main window not found")?;

            let generation = state.begin_hide_watchdog();
            win.hide().map_err(|e| e.to_string())?;
            schedule_hide_watchdog(app, generation);

            Ok(())
        }
    }
}

#[tauri::command]
pub async fn set_close_behavior(
    state: State<'_, CloseBehaviorState>,
    behavior: CloseBehavior,
) -> Result<(), String> {
    state.set_behavior(&behavior);
    Ok(())
}

#[tauri::command]
pub async fn claim_pending_lock_request(
    state: State<'_, CloseBehaviorState>,
) -> Result<bool, String> {
    Ok(state.claim_pending_lock_request())
}

#[tauri::command]
pub async fn update_tray_menu(app: AppHandle, labels: TrayMenuLabels) -> Result<(), String> {
    let show_i = MenuItem::with_id(&app, "show", labels.show, true, None::<&str>)
        .map_err(|e| e.to_string())?;
    let lock_i = MenuItem::with_id(&app, "lock_vault", labels.lock_vault, true, None::<&str>)
        .map_err(|e| e.to_string())?;
    let settings_i = MenuItem::with_id(
        &app,
        "settings",
        labels.settings,
        labels.settings_enabled,
        None::<&str>,
    )
    .map_err(|e| e.to_string())?;
    let separator_i = PredefinedMenuItem::separator(&app).map_err(|e| e.to_string())?;
    let quit_i = MenuItem::with_id(&app, "quit", labels.quit, true, None::<&str>)
        .map_err(|e| e.to_string())?;
    let menu = Menu::with_items(
        &app,
        &[&show_i, &lock_i, &settings_i, &separator_i, &quit_i],
    )
    .map_err(|e| e.to_string())?;

    let tray = app.tray_by_id("main").ok_or("main tray not found")?;
    tray.set_menu(Some(menu)).map_err(|e| e.to_string())?;

    Ok(())
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
