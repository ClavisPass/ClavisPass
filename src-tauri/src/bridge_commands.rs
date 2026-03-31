use serde_json::Value;

use crate::bridge::{
    pairing, session,
    vault::VaultData,
    write::{self, BrowserWriteRequest},
};

#[tauri::command]
pub fn bridge_publish_session(vault: Value) -> Result<(), String> {
    let parsed = serde_json::from_value::<VaultData>(vault)
        .map_err(|err| format!("Invalid vault session payload: {err}"))?;
    session::publish_session(parsed)
        .map(|_| ())
        .map_err(|err| format!("Failed to publish bridge session: {err}"))
}

#[tauri::command]
pub fn bridge_clear_session() -> Result<(), String> {
    session::clear_session().map_err(|err| format!("Failed to clear bridge session: {err}"))
}

#[tauri::command]
pub fn bridge_list_pending_pairings() -> Result<Vec<pairing::PendingPairing>, String> {
    pairing::list_pending_pairings()
        .map_err(|err| format!("Failed to load pending pairings: {err}"))
}

#[tauri::command]
pub fn bridge_list_paired_clients() -> Result<Vec<pairing::PairedClient>, String> {
    pairing::list_paired_clients().map_err(|err| format!("Failed to load paired clients: {err}"))
}

#[tauri::command]
pub fn bridge_list_rejected_clients() -> Result<Vec<pairing::RejectedClient>, String> {
    pairing::list_rejected_clients()
        .map_err(|err| format!("Failed to load rejected clients: {err}"))
}

#[tauri::command]
pub fn bridge_approve_pairing(
    extension_id: String,
    client_instance_id: Option<String>,
) -> Result<Option<pairing::PairedClient>, String> {
    pairing::approve_pairing(&extension_id, client_instance_id.as_deref())
        .map_err(|err| format!("Failed to approve pairing: {err}"))
}

#[tauri::command]
pub fn bridge_reject_pairing(
    extension_id: String,
    client_instance_id: Option<String>,
) -> Result<Option<pairing::RejectedClient>, String> {
    pairing::reject_pairing(&extension_id, client_instance_id.as_deref())
        .map_err(|err| format!("Failed to reject pairing: {err}"))
}

#[tauri::command]
pub fn bridge_revoke_pairing(
    extension_id: String,
    client_instance_id: Option<String>,
) -> Result<bool, String> {
    pairing::revoke_pairing(&extension_id, client_instance_id.as_deref())
        .map_err(|err| format!("Failed to revoke pairing: {err}"))
}

#[tauri::command]
pub fn bridge_claim_pending_writes() -> Result<Vec<BrowserWriteRequest>, String> {
    write::claim_pending_requests().map_err(|err| format!("Failed to claim browser writes: {err}"))
}

#[tauri::command]
pub fn bridge_complete_write_request(
    request_id: String,
    ok: bool,
    result: Option<Value>,
    error_code: Option<String>,
    error_message: Option<String>,
) -> Result<(), String> {
    let error = if ok {
        None
    } else {
        Some(crate::bridge::protocol::BridgeError {
            code: error_code.unwrap_or_else(|| "WRITE_FAILED".to_string()),
            message: error_message.unwrap_or_else(|| "Browser write request failed".to_string()),
        })
    };

    write::complete_request(&request_id, ok, result, error)
        .map_err(|err| format!("Failed to complete browser write request: {err}"))
}
