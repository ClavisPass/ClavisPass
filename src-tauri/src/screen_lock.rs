// src-tauri/src/screen_lock.rs
//
// Emits: "screen-lock://changed" { locked: bool }

use serde::Serialize;
use tauri::{AppHandle, Emitter};

#[derive(Clone, Serialize)]
struct ScreenLockPayload {
    locked: bool,
}

fn emit(app: &AppHandle, locked: bool) {
    let _ = app.emit("screen-lock://changed", ScreenLockPayload { locked });
}

#[cfg(target_os = "windows")]
mod imp {
    use super::emit;
    use std::{mem, ptr, thread};
    use tauri::AppHandle;
    use windows::{
        core::PCSTR,
        Win32::{
            Foundation::{HWND, LPARAM, LRESULT, WPARAM},
            System::{
                LibraryLoader::GetModuleHandleA,
                RemoteDesktop::{
                    WTSRegisterSessionNotification, WTSUnRegisterSessionNotification,
                    NOTIFY_FOR_ALL_SESSIONS,
                },
            },
            UI::WindowsAndMessaging::{
                CreateWindowExA, DefWindowProcA, DispatchMessageA, GetMessageA, RegisterClassA,
                TranslateMessage, MSG, WINDOW_EX_STYLE, WM_DESTROY, WM_WTSSESSION_CHANGE,
                WNDCLASSA, WS_OVERLAPPED, WTS_SESSION_LOCK, WTS_SESSION_UNLOCK,
            },
        },
    };

    unsafe extern "system" fn wndproc(hwnd: HWND, msg: u32, w: WPARAM, l: LPARAM) -> LRESULT {
        match msg {
            WM_DESTROY => LRESULT(0),
            _ => DefWindowProcA(hwnd, msg, w, l),
        }
    }

    pub fn start(app: AppHandle) {
        thread::spawn(move || unsafe {
            let hinstance = match GetModuleHandleA(PCSTR::null()) {
                Ok(h) => h,
                Err(_) => return,
            };

            // Must be null-terminated.
            let class_name = b"clavispass_screenlock\0";

            let wc = WNDCLASSA {
                lpfnWndProc: Some(wndproc),
                hInstance: hinstance.into(),
                lpszClassName: PCSTR(class_name.as_ptr()),
                ..Default::default()
            };

            if RegisterClassA(&wc) == 0 {
                return;
            }

            // NOTE:
            // - CreateWindowExA returns Result<HWND, _> in your setup.
            // - Parent HWND null must be HWND(null_mut()) because HWND wraps a pointer type.
            let hwnd: HWND = match CreateWindowExA(
                WINDOW_EX_STYLE::default(),
                PCSTR(class_name.as_ptr()),
                PCSTR(class_name.as_ptr()),
                WS_OVERLAPPED, // hidden (no WS_VISIBLE)
                0,
                0,
                0,
                0,
                HWND(ptr::null_mut()), // <-- FIX: correct null HWND
                None,
                hinstance,
                None, // lpParam: Option<*const c_void>
            ) {
                Ok(h) => h,
                Err(_) => return,
            };

            // hwnd.0 is a raw pointer in your type definition
            if hwnd.0.is_null() {
                return;
            }

            if WTSRegisterSessionNotification(hwnd, NOTIFY_FOR_ALL_SESSIONS).is_err() {
                return;
            }

            let mut msg: MSG = mem::zeroed();
            while GetMessageA(&mut msg, HWND(ptr::null_mut()), 0, 0).into() {
                if msg.message == WM_WTSSESSION_CHANGE {
                    match msg.wParam.0 as u32 {
                        WTS_SESSION_LOCK => emit(&app, true),
                        WTS_SESSION_UNLOCK => emit(&app, false),
                        _ => {}
                    }
                }
                let _ = TranslateMessage(&msg);
                let _ = DispatchMessageA(&msg);
            }

            let _ = WTSUnRegisterSessionNotification(hwnd);
        });
    }
}

#[cfg(target_os = "linux")]
mod imp {
    use super::emit;
    use std::thread;
    use tauri::AppHandle;
    use zbus::{blocking::Connection, dbus_proxy};

    #[dbus_proxy(
        interface = "org.freedesktop.login1.Session",
        default_service = "org.freedesktop.login1",
        default_path = "/org/freedesktop/login1/session/auto"
    )]
    trait Session {
        #[dbus_proxy(property)]
        fn locked_hint(&self) -> zbus::Result<bool>;
    }

    pub fn start(app: AppHandle) {
        thread::spawn(move || {
            let conn = match Connection::system() {
                Ok(c) => c,
                Err(_) => return,
            };

            let proxy = match SessionProxyBlocking::new(&conn) {
                Ok(p) => p,
                Err(_) => return,
            };

            // Emit initial state once (optional)
            if let Ok(v) = proxy.locked_hint() {
                emit(&app, v);
            }

            let mut stream = proxy.receive_locked_hint_changed();
            while let Some(changed) = stream.next() {
                if let Ok(v) = changed.get() {
                    emit(&app, v);
                }
            }
        });
    }
}

#[cfg(target_os = "macos")]
mod imp {
    use super::emit;
    use core_foundation::{
        base::{TCFType, ToVoid},
        dictionary::CFDictionary,
        string::CFString,
    };
    use std::{thread, time::Duration};
    use tauri::AppHandle;

    extern "C" {
        fn CGSessionCopyCurrentDictionary() -> core_foundation::dictionary::CFDictionaryRef;
    }

    pub fn start(app: AppHandle) {
        thread::spawn(move || unsafe {
            let mut last: Option<bool> = None;

            loop {
                let dict_ref = CGSessionCopyCurrentDictionary();
                let dict: CFDictionary = CFDictionary::wrap_under_create_rule(dict_ref);

                let locked = dict
                    .find(CFString::new("CGSSessionScreenIsLocked").to_void())
                    .is_some();

                if last != Some(locked) {
                    last = Some(locked);
                    emit(&app, locked);
                }

                thread::sleep(Duration::from_millis(500));
            }
        });
    }
}

pub fn start(app: AppHandle) {
    imp::start(app);
}
