use std::{
    env,
    fs,
    io,
    path::{Path, PathBuf},
};

const BRIDGE_ENV_KEY: &str = "CLAVISPASS_BRIDGE_DIR";

pub fn bridge_dir() -> io::Result<PathBuf> {
    if let Ok(explicit) = env::var(BRIDGE_ENV_KEY) {
        let path = PathBuf::from(explicit);
        ensure_dir(&path)?;
        return Ok(path);
    }

    let base = platform_base_dir()?;
    let path = base.join("ClavisPass").join("bridge");
    ensure_dir(&path)?;
    Ok(path)
}

pub fn pairing_store_path() -> io::Result<PathBuf> {
    Ok(bridge_dir()?.join("pairings.json"))
}

pub fn session_store_path() -> io::Result<PathBuf> {
    Ok(bridge_dir()?.join("session.json"))
}

pub fn write_request_store_path() -> io::Result<PathBuf> {
    Ok(bridge_dir()?.join("browser-write-requests.json"))
}

pub fn write_result_store_path() -> io::Result<PathBuf> {
    Ok(bridge_dir()?.join("browser-write-results.json"))
}

fn ensure_dir(path: &Path) -> io::Result<()> {
    if !path.exists() {
        fs::create_dir_all(path)?;
    }
    Ok(())
}

#[cfg(target_os = "windows")]
fn platform_base_dir() -> io::Result<PathBuf> {
    if let Ok(local_app_data) = env::var("LOCALAPPDATA") {
        return Ok(PathBuf::from(local_app_data));
    }

    Err(io::Error::new(
        io::ErrorKind::NotFound,
        "LOCALAPPDATA is not set",
    ))
}

#[cfg(target_os = "macos")]
fn platform_base_dir() -> io::Result<PathBuf> {
    if let Ok(home) = env::var("HOME") {
        return Ok(PathBuf::from(home).join("Library").join("Application Support"));
    }

    Err(io::Error::new(io::ErrorKind::NotFound, "HOME is not set"))
}

#[cfg(all(unix, not(target_os = "macos")))]
fn platform_base_dir() -> io::Result<PathBuf> {
    if let Ok(xdg_state_home) = env::var("XDG_STATE_HOME") {
        return Ok(PathBuf::from(xdg_state_home));
    }

    if let Ok(home) = env::var("HOME") {
        return Ok(PathBuf::from(home).join(".local").join("state"));
    }

    Err(io::Error::new(io::ErrorKind::NotFound, "HOME is not set"))
}
