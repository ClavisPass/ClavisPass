use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{
    fs, io,
    path::PathBuf,
    thread,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

use super::{
    path::{write_request_store_path, write_result_store_path},
    protocol::{BridgeClientInfo, BridgeError},
};

const WRITE_TIMEOUT_MS: u64 = 12_000;
const RESULT_RETENTION_LIMIT: usize = 100;
const CLAIM_STALE_AFTER_MS: u64 = 30_000;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateEntryFromBrowserPayload {
    pub title: String,
    #[serde(default)]
    pub username: Option<String>,
    #[serde(default)]
    pub email: Option<String>,
    pub password: String,
    #[serde(default)]
    pub url: Option<String>,
    #[serde(default)]
    pub matched_host: Option<String>,
    #[serde(default)]
    pub folder_id: Option<String>,
    #[serde(default)]
    pub totp: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateEntryFromBrowserPayload {
    pub entry_id: String,
    #[serde(default)]
    pub title: Option<String>,
    #[serde(default)]
    pub username: Option<String>,
    #[serde(default)]
    pub email: Option<String>,
    pub password: String,
    #[serde(default)]
    pub url: Option<String>,
    #[serde(default)]
    pub matched_host: Option<String>,
    #[serde(default)]
    pub totp: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateEntryFromBrowserResult {
    pub entry_id: String,
    pub title: String,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateEntryFromBrowserResult {
    pub entry_id: String,
    pub updated_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum BrowserWriteKind {
    CreateEntryFromBrowser,
    UpdateEntryFromBrowser,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BrowserWriteRequest {
    pub id: String,
    pub created_at_ms: u64,
    pub kind: BrowserWriteKind,
    pub client: BridgeClientInfo,
    pub payload: Value,
    #[serde(default)]
    pub claimed_at_ms: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BrowserWriteResult {
    pub request_id: String,
    pub completed_at_ms: u64,
    pub ok: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub result: Option<Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<BridgeError>,
}

#[derive(Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct BrowserWriteRequestStore {
    #[serde(default)]
    requests: Vec<BrowserWriteRequest>,
}

#[derive(Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct BrowserWriteResultStore {
    #[serde(default)]
    results: Vec<BrowserWriteResult>,
}

pub fn validate_create_payload(payload: &CreateEntryFromBrowserPayload) -> Result<(), BridgeError> {
    if payload.title.trim().is_empty() {
        return Err(validation_error("title is required"));
    }

    if payload.password.trim().is_empty() {
        return Err(validation_error("password is required"));
    }

    if effective_url(payload.url.as_deref(), payload.matched_host.as_deref()).is_none() {
        return Err(validation_error("url or matchedHost must be present"));
    }

    Ok(())
}

pub fn validate_update_payload(payload: &UpdateEntryFromBrowserPayload) -> Result<(), BridgeError> {
    if payload.entry_id.trim().is_empty() {
        return Err(validation_error("entryId is required"));
    }

    if payload.password.trim().is_empty() {
        return Err(validation_error("password is required"));
    }

    if effective_url(payload.url.as_deref(), payload.matched_host.as_deref()).is_none() {
        return Err(validation_error("url or matchedHost must be present"));
    }

    Ok(())
}

pub fn queue_create_request(
    id: String,
    client: BridgeClientInfo,
    payload: CreateEntryFromBrowserPayload,
) -> io::Result<BrowserWriteResult> {
    validate_create_payload(&payload).map_err(as_io_error)?;
    queue_request(id, BrowserWriteKind::CreateEntryFromBrowser, client, payload)
}

pub fn queue_update_request(
    id: String,
    client: BridgeClientInfo,
    payload: UpdateEntryFromBrowserPayload,
) -> io::Result<BrowserWriteResult> {
    validate_update_payload(&payload).map_err(as_io_error)?;
    queue_request(id, BrowserWriteKind::UpdateEntryFromBrowser, client, payload)
}

pub fn claim_pending_requests() -> io::Result<Vec<BrowserWriteRequest>> {
    let path = write_request_store_path()?;
    let mut store = load_request_store(&path)?;
    let now = now_ms();
    let mut claimed = Vec::new();

    for request in &mut store.requests {
        let can_claim = request
            .claimed_at_ms
            .map(|claimed_at_ms| now.saturating_sub(claimed_at_ms) >= CLAIM_STALE_AFTER_MS)
            .unwrap_or(true);

        if can_claim {
            request.claimed_at_ms = Some(now);
            claimed.push(request.clone());
        }
    }

    if !claimed.is_empty() {
        write_json_atomically(&path, &store)?;
    }

    Ok(claimed)
}

pub fn complete_request(
    request_id: &str,
    ok: bool,
    result: Option<Value>,
    error: Option<BridgeError>,
) -> io::Result<()> {
    let requests_path = write_request_store_path()?;
    let results_path = write_result_store_path()?;

    let mut request_store = load_request_store(&requests_path)?;
    request_store.requests.retain(|request| request.id != request_id);
    write_json_atomically(&requests_path, &request_store)?;

    let mut result_store = load_result_store(&results_path)?;
    result_store.results.retain(|item| item.request_id != request_id);
    result_store.results.push(BrowserWriteResult {
        request_id: request_id.to_string(),
        completed_at_ms: now_ms(),
        ok,
        result,
        error,
    });

    if result_store.results.len() > RESULT_RETENTION_LIMIT {
        let overflow = result_store.results.len() - RESULT_RETENTION_LIMIT;
        result_store.results.drain(0..overflow);
    }

    write_json_atomically(&results_path, &result_store)
}

pub fn wait_for_result(request_id: &str) -> io::Result<BrowserWriteResult> {
    let deadline = now_ms() + WRITE_TIMEOUT_MS;

    loop {
        if let Some(result) = find_result(request_id)? {
            return Ok(result);
        }

        if now_ms() >= deadline {
            return Err(io::Error::new(
                io::ErrorKind::TimedOut,
                "Timed out waiting for browser write result",
            ));
        }

        thread::sleep(Duration::from_millis(120));
    }
}

fn queue_request<T: Serialize>(
    id: String,
    kind: BrowserWriteKind,
    client: BridgeClientInfo,
    payload: T,
) -> io::Result<BrowserWriteResult> {
    let path = write_request_store_path()?;
    let mut store = load_request_store(&path)?;

    store.requests.retain(|request| request.id != id);
    store.requests.push(BrowserWriteRequest {
        id: id.clone(),
        created_at_ms: now_ms(),
        kind,
        client,
        payload: serde_json::to_value(payload)
            .map_err(|err| io::Error::new(io::ErrorKind::Other, err))?,
        claimed_at_ms: None,
    });

    write_json_atomically(&path, &store)?;
    wait_for_result(&id)
}

fn find_result(request_id: &str) -> io::Result<Option<BrowserWriteResult>> {
    let path = write_result_store_path()?;
    let store = load_result_store(&path)?;
    Ok(store
        .results
        .into_iter()
        .find(|result| result.request_id == request_id))
}

fn load_request_store(path: &PathBuf) -> io::Result<BrowserWriteRequestStore> {
    if !path.exists() {
        return Ok(BrowserWriteRequestStore::default());
    }

    let content = fs::read_to_string(path)?;
    serde_json::from_str::<BrowserWriteRequestStore>(&content)
        .map_err(|err| io::Error::new(io::ErrorKind::InvalidData, err))
}

fn load_result_store(path: &PathBuf) -> io::Result<BrowserWriteResultStore> {
    if !path.exists() {
        return Ok(BrowserWriteResultStore::default());
    }

    let content = fs::read_to_string(path)?;
    serde_json::from_str::<BrowserWriteResultStore>(&content)
        .map_err(|err| io::Error::new(io::ErrorKind::InvalidData, err))
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

fn effective_url(url: Option<&str>, matched_host: Option<&str>) -> Option<String> {
    let normalized_url = url.map(str::trim).filter(|value| !value.is_empty());
    if let Some(url) = normalized_url {
        return Some(url.to_string());
    }

    matched_host
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(|host| format!("https://{host}"))
}

fn validation_error(message: &str) -> BridgeError {
    BridgeError {
        code: "INVALID_PAYLOAD".to_string(),
        message: message.to_string(),
    }
}

fn as_io_error(error: BridgeError) -> io::Error {
    io::Error::new(io::ErrorKind::InvalidInput, error.message)
}

#[cfg(test)]
mod tests {
    use super::{
        effective_url, validate_create_payload, validate_update_payload,
        CreateEntryFromBrowserPayload, UpdateEntryFromBrowserPayload,
    };

    #[test]
    fn create_payload_requires_password() {
        let payload = CreateEntryFromBrowserPayload {
            title: "Example".into(),
            username: Some("alice".into()),
            email: None,
            password: "".into(),
            url: Some("https://example.com".into()),
            matched_host: Some("example.com".into()),
            folder_id: None,
            totp: None,
        };

        assert!(validate_create_payload(&payload).is_err());
    }

    #[test]
    fn update_payload_requires_entry_id() {
        let payload = UpdateEntryFromBrowserPayload {
            entry_id: "".into(),
            title: None,
            username: None,
            email: None,
            password: "secret".into(),
            url: Some("https://example.com".into()),
            matched_host: None,
            totp: None,
        };

        assert!(validate_update_payload(&payload).is_err());
    }

    #[test]
    fn effective_url_falls_back_to_host() {
        assert_eq!(
            effective_url(None, Some("example.com")),
            Some("https://example.com".to_string())
        );
    }
}
