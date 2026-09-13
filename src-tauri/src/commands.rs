use keytar::{delete_password, get_password, set_password};
use std::fs;
use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::time::Duration;
use tauri;
use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::{AppHandle, Manager, Size, State};

#[cfg(target_os = "macos")]
use core_foundation::{base::TCFType, string::CFString};
#[cfg(target_os = "macos")]
use std::{
    ffi::{c_char, c_void, CString},
    sync::{Condvar, Mutex},
};

#[cfg(target_os = "windows")]
use windows::{
    core::HSTRING,
    Foundation::IAsyncOperation,
    Security::Credentials::UI::{
        UserConsentVerificationResult,
        UserConsentVerifier,
        UserConsentVerifierAvailability,
    },
    Win32::System::WinRT::{IUserConsentVerifierInterop, RoGetActivationFactory},
};

#[cfg(target_os = "macos")]
type ObjcId = *mut c_void;
#[cfg(target_os = "macos")]
type Sel = *mut c_void;
#[cfg(target_os = "macos")]
type ObjcBool = i8;

#[cfg(target_os = "macos")]
const LAPOLICY_DEVICE_OWNER_AUTHENTICATION: i64 = 2;
#[cfg(target_os = "macos")]
const BLOCK_HAS_SIGNATURE: i32 = 1 << 30;

#[cfg(target_os = "macos")]
#[repr(C)]
struct BlockDescriptor {
    reserved: usize,
    size: usize,
    signature: *const c_char,
}

#[cfg(target_os = "macos")]
unsafe impl Sync for BlockDescriptor {}

#[cfg(target_os = "macos")]
#[repr(C)]
struct AuthReplyBlock {
    isa: *const c_void,
    flags: i32,
    reserved: i32,
    invoke: extern "C" fn(*mut AuthReplyBlock, ObjcBool, ObjcId),
    descriptor: *const BlockDescriptor,
    state: *mut AuthState,
}

#[cfg(target_os = "macos")]
struct AuthState {
    result: Mutex<Option<bool>>,
    completed: Condvar,
}

#[cfg(target_os = "macos")]
#[link(name = "objc")]
extern "C" {
    fn objc_getClass(name: *const c_char) -> ObjcId;
    fn sel_registerName(name: *const c_char) -> Sel;
    static _NSConcreteStackBlock: c_void;
}

#[cfg(target_os = "macos")]
#[link(name = "System")]
extern "C" {
    fn _Block_copy(block: *const c_void) -> *mut c_void;
    fn _Block_release(block: *const c_void);
}

#[cfg(target_os = "macos")]
#[link(name = "Foundation", kind = "framework")]
extern "C" {}

#[cfg(target_os = "macos")]
#[link(name = "LocalAuthentication", kind = "framework")]
extern "C" {}

#[cfg(target_os = "macos")]
extern "C" {
    fn objc_msgSend();
}

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
use windows::Win32::Foundation::{HANDLE, HWND};
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

#[cfg(target_os = "windows")]
fn check_system_auth_available() -> Result<bool, String> {
    let availability = UserConsentVerifier::CheckAvailabilityAsync()
        .map_err(|error| format!("Failed to check system authentication availability: {error:?}"))?
        .get()
        .map_err(|error| format!("Failed to resolve system authentication availability: {error:?}"))?;

    Ok(availability == UserConsentVerifierAvailability::Available)
}

#[cfg(target_os = "windows")]
fn get_main_window_hwnd(app: &AppHandle) -> Result<isize, String> {
    let window = app
        .get_webview_window("main")
        .ok_or("main window not found")?;

    let _ = window.show();
    let _ = window.unminimize();
    let _ = window.set_focus();

    window
        .hwnd()
        .map(|handle| handle.0 as isize)
        .map_err(|error| format!("Failed to resolve main window handle: {error}"))
}

#[cfg(target_os = "windows")]
fn authenticate_with_system_impl(
    hwnd: isize,
    message: Option<String>,
) -> Result<bool, String> {
    if !check_system_auth_available()? {
        return Ok(false);
    }

    let prompt = HSTRING::from(
        message
            .as_deref()
            .unwrap_or("Authenticate to unlock ClavisPass"),
    );

    let class_name = HSTRING::from("Windows.Security.Credentials.UI.UserConsentVerifier");
    let interop: IUserConsentVerifierInterop = unsafe {
        RoGetActivationFactory(&class_name).map_err(|error| {
            format!("Failed to get UserConsentVerifier interop factory: {error:?}")
        })?
    };
    let operation: IAsyncOperation<UserConsentVerificationResult> = unsafe {
        interop
            .RequestVerificationForWindowAsync(HWND(hwnd as *mut std::ffi::c_void), &prompt)
            .map_err(|error| format!("Failed to request system authentication: {error:?}"))?
    };
    let result = operation
        .get()
        .map_err(|error| format!("Failed to resolve system authentication: {error:?}"))?;

    Ok(result == UserConsentVerificationResult::Verified)
}

#[cfg(target_os = "macos")]
fn cstring(value: &str) -> Result<CString, String> {
    CString::new(value).map_err(|_| format!("Invalid Objective-C string: {value}"))
}

#[cfg(target_os = "macos")]
unsafe fn objc_class(name: &str) -> Result<ObjcId, String> {
    let class_name = cstring(name)?;
    let class = objc_getClass(class_name.as_ptr());
    if class.is_null() {
        Err(format!("Objective-C class not found: {name}"))
    } else {
        Ok(class)
    }
}

#[cfg(target_os = "macos")]
unsafe fn objc_sel(name: &str) -> Result<Sel, String> {
    let selector_name = cstring(name)?;
    let selector = sel_registerName(selector_name.as_ptr());
    if selector.is_null() {
        Err(format!("Objective-C selector not found: {name}"))
    } else {
        Ok(selector)
    }
}

#[cfg(target_os = "macos")]
unsafe fn objc_msg_send_id(receiver: ObjcId, selector: Sel) -> ObjcId {
    let send: extern "C" fn(ObjcId, Sel) -> ObjcId = std::mem::transmute(objc_msgSend as *const ());
    send(receiver, selector)
}

#[cfg(target_os = "macos")]
unsafe fn objc_msg_send_release(receiver: ObjcId, selector: Sel) {
    let send: extern "C" fn(ObjcId, Sel) = std::mem::transmute(objc_msgSend as *const ());
    send(receiver, selector)
}

#[cfg(target_os = "macos")]
unsafe fn objc_msg_send_can_evaluate(
    receiver: ObjcId,
    selector: Sel,
    policy: i64,
    error: *mut ObjcId,
) -> ObjcBool {
    let send: extern "C" fn(ObjcId, Sel, i64, *mut ObjcId) -> ObjcBool =
        std::mem::transmute(objc_msgSend as *const ());
    send(receiver, selector, policy, error)
}

#[cfg(target_os = "macos")]
unsafe fn objc_msg_send_evaluate_policy(
    receiver: ObjcId,
    selector: Sel,
    policy: i64,
    reason: ObjcId,
    reply: *mut c_void,
) {
    let send: extern "C" fn(ObjcId, Sel, i64, ObjcId, *mut c_void) =
        std::mem::transmute(objc_msgSend as *const ());
    send(receiver, selector, policy, reason, reply)
}

#[cfg(target_os = "macos")]
unsafe fn new_la_context() -> Result<ObjcId, String> {
    let class = objc_class("LAContext")?;
    let alloc = objc_sel("alloc")?;
    let init = objc_sel("init")?;
    let allocated = objc_msg_send_id(class, alloc);
    if allocated.is_null() {
        return Err("Failed to allocate LAContext".to_string());
    }

    let context = objc_msg_send_id(allocated, init);
    if context.is_null() {
        Err("Failed to initialize LAContext".to_string())
    } else {
        Ok(context)
    }
}

#[cfg(target_os = "macos")]
fn check_system_auth_available() -> Result<bool, String> {
    unsafe {
        let context = new_la_context()?;
        let can_evaluate = objc_sel("canEvaluatePolicy:error:")?;
        let release = objc_sel("release")?;
        let available = objc_msg_send_can_evaluate(
            context,
            can_evaluate,
            LAPOLICY_DEVICE_OWNER_AUTHENTICATION,
            std::ptr::null_mut(),
        ) != 0;
        objc_msg_send_release(context, release);
        Ok(available)
    }
}

#[cfg(target_os = "macos")]
extern "C" fn auth_reply(block: *mut AuthReplyBlock, success: ObjcBool, _error: ObjcId) {
    unsafe {
        let state = &*(*block).state;
        if let Ok(mut result) = state.result.lock() {
            *result = Some(success != 0);
            state.completed.notify_one();
        }
    }
}

#[cfg(target_os = "macos")]
static AUTH_REPLY_SIGNATURE: &[u8] = b"v@?c@\0";

#[cfg(target_os = "macos")]
static AUTH_REPLY_DESCRIPTOR: BlockDescriptor = BlockDescriptor {
    reserved: 0,
    size: std::mem::size_of::<AuthReplyBlock>(),
    signature: AUTH_REPLY_SIGNATURE.as_ptr() as *const c_char,
};

#[cfg(target_os = "macos")]
fn authenticate_with_system_impl(message: Option<String>) -> Result<bool, String> {
    if !check_system_auth_available()? {
        return Ok(false);
    }

    unsafe {
        let context = new_la_context()?;
        let evaluate_policy = objc_sel("evaluatePolicy:localizedReason:reply:")?;
        let release = objc_sel("release")?;
        let reason = CFString::new(
            message
                .as_deref()
                .unwrap_or("Authenticate to unlock ClavisPass"),
        );
        let state = Box::new(AuthState {
            result: Mutex::new(None),
            completed: Condvar::new(),
        });
        let state_ptr = Box::into_raw(state);

        let block = AuthReplyBlock {
            isa: &_NSConcreteStackBlock as *const c_void,
            flags: BLOCK_HAS_SIGNATURE,
            reserved: 0,
            invoke: auth_reply,
            descriptor: &AUTH_REPLY_DESCRIPTOR,
            state: state_ptr,
        };
        let copied_block = _Block_copy((&block as *const AuthReplyBlock).cast());
        if copied_block.is_null() {
            let _ = Box::from_raw(state_ptr);
            objc_msg_send_release(context, release);
            return Err("Failed to copy LocalAuthentication reply block".to_string());
        }

        objc_msg_send_evaluate_policy(
            context,
            evaluate_policy,
            LAPOLICY_DEVICE_OWNER_AUTHENTICATION,
            (reason.as_concrete_TypeRef() as *const c_void).cast_mut(),
            copied_block,
        );

        let state_ref = &*state_ptr;
        let mut guard = state_ref
            .result
            .lock()
            .map_err(|_| "Failed to lock authentication result".to_string())?;

        while guard.is_none() {
            guard = state_ref
                .completed
                .wait(guard)
                .map_err(|_| "Failed while waiting for authentication result".to_string())?;
        }

        let result = guard.unwrap_or(false);
        drop(guard);

        _Block_release(copied_block);
        let _ = Box::from_raw(state_ptr);
        objc_msg_send_release(context, release);

        Ok(result)
    }
}

#[tauri::command]
pub async fn is_system_auth_available() -> Result<bool, String> {
    #[cfg(any(target_os = "windows", target_os = "macos"))]
    {
        tauri::async_runtime::spawn_blocking(check_system_auth_available)
            .await
            .map_err(|error| format!("Failed to join system authentication check: {error}"))?
    }

    #[cfg(not(any(target_os = "windows", target_os = "macos")))]
    {
        Ok(false)
    }
}

#[tauri::command]
pub async fn authenticate_with_system(
    app: AppHandle,
    message: Option<String>,
) -> Result<bool, String> {
    #[cfg(target_os = "windows")]
    {
        let hwnd = get_main_window_hwnd(&app)?;

        tauri::async_runtime::spawn_blocking(move || authenticate_with_system_impl(hwnd, message))
            .await
            .map_err(|error| format!("Failed to join system authentication request: {error}"))?
    }

    #[cfg(target_os = "macos")]
    {
        tauri::async_runtime::spawn_blocking(move || authenticate_with_system_impl(message))
            .await
            .map_err(|error| format!("Failed to join system authentication request: {error}"))?
    }

    #[cfg(not(any(target_os = "windows", target_os = "macos")))]
    {
        let _ = message;
        Ok(false)
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
pub async fn focus_main_window(
    app: AppHandle,
    state: State<'_, CloseBehaviorState>,
) -> Result<(), String> {
    state.cancel_hide_watchdog();

    let win = app
        .get_webview_window("main")
        .ok_or("main window not found")?;

    win.show().map_err(|e| e.to_string())?;
    win.unminimize().map_err(|e| e.to_string())?;
    let _ = win.set_always_on_top(true);
    win.set_focus().map_err(|e| e.to_string())?;
    let _ = win.set_always_on_top(false);

    Ok(())
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
