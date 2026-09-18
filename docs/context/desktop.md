# Desktop And Tauri Context

Use this for Tauri host behavior, desktop windows, tray, native commands, fast access popup, native messaging, shortcuts, updater, or platform quirks.

## Core Files

- `src-tauri/src/lib.rs`
- `src-tauri/src/commands.rs`
- `src-tauri/tauri.conf.json`
- `src/infrastructure/platform/*`
- `src/features/fastaccess/*`
- `src/shared/components/CustomTitlebar.tsx`

## Runtime Model

Desktop uses Tauri but renders the Expo web bundle. In JS, desktop-specific behavior often appears under `Platform.OS === "web"` plus Tauri detection.

## Tauri Responsibilities

- Creates main and popup/OAuth windows.
- Handles system tray behavior.
- Saves/restores window size.
- Intercepts close requests and hides to tray where configured.
- Exposes Rust commands to JS.
- Enables updater, shell, dialog, fs, deep links, OAuth, shortcuts, autostart, and related plugins.

## Fast Access

Fast access uses popup-like behavior and separate window handling. Be careful when changing `FastAccessScreen`, `features/fastaccess`, `showMainWindow`, window focus/minimize logic, or native host/browser bridge paths.

## Chrome And Drag Regions

Desktop custom titlebar and draggable regions are fragile. When changing app chrome, inspect `CustomTitlebar.tsx` and verify interactive controls are not inside drag overlays.
