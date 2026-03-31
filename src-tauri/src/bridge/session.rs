use serde::{Deserialize, Serialize};
use std::{
    fs,
    io,
    path::PathBuf,
    time::{SystemTime, UNIX_EPOCH},
};

use super::{path::session_store_path, vault::VaultData};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BridgeSessionSnapshot {
    pub version: u32,
    pub updated_at_ms: u64,
    pub vault: VaultData,
}

pub fn publish_session(vault: VaultData) -> io::Result<BridgeSessionSnapshot> {
    let snapshot = BridgeSessionSnapshot {
        version: 1,
        updated_at_ms: now_ms(),
        vault,
    };
    let path = session_store_path()?;
    write_json_atomically(&path, &snapshot)?;
    Ok(snapshot)
}

pub fn load_session() -> io::Result<Option<BridgeSessionSnapshot>> {
    let path = session_store_path()?;
    if !path.exists() {
        return Ok(None);
    }

    let content = fs::read_to_string(path)?;
    let parsed = serde_json::from_str::<BridgeSessionSnapshot>(&content)
        .map_err(|err| io::Error::new(io::ErrorKind::InvalidData, err))?;
    Ok(Some(parsed))
}

pub fn clear_session() -> io::Result<()> {
    let path = session_store_path()?;
    if path.exists() {
        fs::remove_file(path)?;
    }
    Ok(())
}

fn write_json_atomically<T: Serialize>(path: &PathBuf, value: &T) -> io::Result<()> {
    let temp = path.with_extension("tmp");
    let json = serde_json::to_string_pretty(value)
        .map_err(|err| io::Error::new(io::ErrorKind::Other, err))?;
    fs::write(&temp, json)?;
    fs::rename(temp, path)?;
    Ok(())
}

fn now_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as u64
}
