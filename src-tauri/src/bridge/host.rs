use std::io::{self, Read, Write};

use serde::{Deserialize, Serialize};

use super::{
    pairing::{self, PairingStatus},
    protocol::{BridgeClientInfo, BridgeRequest, BridgeResponse, HOST_NAME, PROTOCOL_VERSION},
    session,
    vault::{
        self, FillDataResult, MatchPasskeysForRequestResult, PasskeyMetadataResult,
        SearchEntrySuggestion,
    },
    webauthn,
    write::{self, CreateEntryFromBrowserPayload, UpdateEntryFromBrowserPayload},
};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StatusResult {
    host_name: &'static str,
    protocol_version: u32,
    app_version: &'static str,
    app_scheme: &'static str,
    ready: bool,
    pairing_status: PairingStatus,
    #[serde(skip_serializing_if = "Option::is_none")]
    peer: Option<PeerInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    session_updated_at_ms: Option<u64>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct PeerInfo {
    extension_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    client_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    client_version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    client_instance_id: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SearchPayload {
    domain: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct FillPayload {
    entry_id: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct MatchPasskeysPayload {
    rp_id: String,
    #[serde(default)]
    allowed_credential_ids: Vec<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AssertPasskeyPayload {
    entry_id: String,
    #[serde(default)]
    module_id: Option<String>,
    rp_id: String,
    challenge: String,
    origin: String,
    #[serde(default)]
    allowed_credential_ids: Vec<String>,
    #[serde(default)]
    user_verified: bool,
}

pub fn run_native_host() -> io::Result<()> {
    let stdin = io::stdin();
    let stdout = io::stdout();
    let mut reader = stdin.lock();
    let mut writer = stdout.lock();

    while let Some(message) = read_frame(&mut reader)? {
        let response = match serde_json::from_slice::<BridgeRequest>(&message) {
            Ok(request) => handle_request(request),
            Err(error) => BridgeResponse::error(
                "unknown".to_string(),
                "BAD_REQUEST",
                format!("Invalid request payload: {error}"),
            ),
        };

        write_frame(&mut writer, &response)?;
        writer.flush()?;
    }

    Ok(())
}

fn handle_request(request: BridgeRequest) -> BridgeResponse {
    if request.version != PROTOCOL_VERSION {
        return BridgeResponse::error(
            request.id,
            "UNSUPPORTED_PROTOCOL",
            format!(
                "Expected protocol version {PROTOCOL_VERSION}, got {}",
                request.version
            ),
        );
    }

    let pairing_status = match pairing::evaluate_pairing(&request.client) {
        Ok(status) => status,
        Err(error) => {
            return BridgeResponse::error(
                request.id,
                "PAIRING_STORE_ERROR",
                format!("Failed to evaluate pairing: {error}"),
            )
        }
    };

    match request.command.as_str() {
        "getStatus" => respond_status(request.id, pairing_status, &request.client.extension_id),
        "searchEntriesByDomain" => {
            if pairing_status != PairingStatus::Paired {
                return pairing_required(request.id);
            }
            respond_search(request.id, request.payload)
        }
        "getFillDataForEntry" => {
            if pairing_status != PairingStatus::Paired {
                return pairing_required(request.id);
            }
            respond_fill(request.id, request.payload)
        }
        "getPasskeyMetadataForEntry" => {
            if pairing_status != PairingStatus::Paired {
                return pairing_required(request.id);
            }
            respond_passkey_metadata(request.id, request.payload)
        }
        "matchPasskeysForRequest" => {
            if pairing_status != PairingStatus::Paired {
                return pairing_required(request.id);
            }
            respond_match_passkeys(request.id, request.payload)
        }
        "assertPasskeyForBrowser" => {
            if pairing_status != PairingStatus::Paired {
                return pairing_required(request.id);
            }
            respond_assert_passkey(request.id, request.payload, request.client)
        }
        "createEntryFromBrowser" => {
            if pairing_status != PairingStatus::Paired {
                return pairing_required(request.id);
            }
            if let Err(response) = ensure_ready(&request.id) {
                return response;
            }
            respond_create(request)
        }
        "updateEntryFromBrowser" => {
            if pairing_status != PairingStatus::Paired {
                return pairing_required(request.id);
            }
            if let Err(response) = ensure_ready(&request.id) {
                return response;
            }
            respond_update(request)
        }
        other => BridgeResponse::error(
            request.id,
            "UNKNOWN_COMMAND",
            format!("Unsupported command: {other}"),
        ),
    }
}

fn pairing_required(id: String) -> BridgeResponse {
    BridgeResponse::error(
        id,
        "PAIRING_REQUIRED",
        "Extension is not paired with this desktop app yet.",
    )
}

fn ensure_ready(id: &str) -> Result<(), BridgeResponse> {
    match session::load_session() {
        Ok(Some(_)) => Ok(()),
        Ok(None) => Err(BridgeResponse::error(
            id.to_string(),
            "APP_LOCKED",
            "Desktop app has no published unlocked bridge session.",
        )),
        Err(error) => Err(BridgeResponse::error(
            id.to_string(),
            "SESSION_STORE_ERROR",
            format!("Failed to load bridge session: {error}"),
        )),
    }
}

fn respond_status(id: String, pairing_status: PairingStatus, extension_id: &str) -> BridgeResponse {
    let session_snapshot = match session::load_session() {
        Ok(value) => value,
        Err(error) => {
            return BridgeResponse::error(
                id,
                "SESSION_STORE_ERROR",
                format!("Failed to load bridge session: {error}"),
            )
        }
    };

    let peer = match pairing::list_paired_clients() {
        Ok(peers) => peers
            .into_iter()
            .find(|peer| peer.extension_id == extension_id)
            .map(|peer| PeerInfo {
                extension_id: peer.extension_id,
                client_name: peer.client_name,
                client_version: peer.client_version,
                client_instance_id: peer.client_instance_id,
            }),
        Err(_) => None,
    };

    BridgeResponse::success(
        id,
        StatusResult {
            host_name: HOST_NAME,
            protocol_version: PROTOCOL_VERSION,
            app_version: env!("CARGO_PKG_VERSION"),
            app_scheme: app_scheme(),
            ready: session_snapshot.is_some(),
            pairing_status,
            peer,
            session_updated_at_ms: session_snapshot.map(|snapshot| snapshot.updated_at_ms),
        },
    )
}

fn app_scheme() -> &'static str {
    if cfg!(debug_assertions) {
        "clavispass-dev"
    } else {
        "clavispass"
    }
}

fn respond_search(id: String, payload: serde_json::Value) -> BridgeResponse {
    let payload = match serde_json::from_value::<SearchPayload>(payload) {
        Ok(value) => value,
        Err(error) => {
            return BridgeResponse::error(
                id,
                "INVALID_PAYLOAD",
                format!("searchEntriesByDomain payload is invalid: {error}"),
            )
        }
    };

    let session_snapshot = match session::load_session() {
        Ok(Some(snapshot)) => snapshot,
        Ok(None) => {
            return BridgeResponse::error(
                id,
                "APP_LOCKED",
                "Desktop app has no published unlocked bridge session.",
            )
        }
        Err(error) => {
            return BridgeResponse::error(
                id,
                "SESSION_STORE_ERROR",
                format!("Failed to load bridge session: {error}"),
            )
        }
    };

    let results: Vec<SearchEntrySuggestion> =
        vault::search_entries_by_domain(&session_snapshot.vault, &payload.domain);
    BridgeResponse::success(id, results)
}

fn respond_fill(id: String, payload: serde_json::Value) -> BridgeResponse {
    let payload = match serde_json::from_value::<FillPayload>(payload) {
        Ok(value) => value,
        Err(error) => {
            return BridgeResponse::error(
                id,
                "INVALID_PAYLOAD",
                format!("getFillDataForEntry payload is invalid: {error}"),
            )
        }
    };

    let session_snapshot = match session::load_session() {
        Ok(Some(snapshot)) => snapshot,
        Ok(None) => {
            return BridgeResponse::error(
                id,
                "APP_LOCKED",
                "Desktop app has no published unlocked bridge session.",
            )
        }
        Err(error) => {
            return BridgeResponse::error(
                id,
                "SESSION_STORE_ERROR",
                format!("Failed to load bridge session: {error}"),
            )
        }
    };

    let Some(result): Option<FillDataResult> =
        vault::fill_data_for_entry(&session_snapshot.vault, &payload.entry_id)
    else {
        return BridgeResponse::error(id, "ENTRY_NOT_FOUND", "Entry could not be resolved.");
    };

    BridgeResponse::success(id, result)
}

fn respond_passkey_metadata(id: String, payload: serde_json::Value) -> BridgeResponse {
    let payload = match serde_json::from_value::<FillPayload>(payload) {
        Ok(value) => value,
        Err(error) => {
            return BridgeResponse::error(
                id,
                "INVALID_PAYLOAD",
                format!("getPasskeyMetadataForEntry payload is invalid: {error}"),
            )
        }
    };

    let session_snapshot = match session::load_session() {
        Ok(Some(snapshot)) => snapshot,
        Ok(None) => {
            return BridgeResponse::error(
                id,
                "APP_LOCKED",
                "Desktop app has no published unlocked bridge session.",
            )
        }
        Err(error) => {
            return BridgeResponse::error(
                id,
                "SESSION_STORE_ERROR",
                format!("Failed to load bridge session: {error}"),
            )
        }
    };

    let Some(result): Option<PasskeyMetadataResult> =
        vault::passkey_metadata_for_entry(&session_snapshot.vault, &payload.entry_id)
    else {
        return BridgeResponse::error(id, "ENTRY_NOT_FOUND", "Entry could not be resolved.");
    };

    BridgeResponse::success(id, result)
}

fn respond_match_passkeys(id: String, payload: serde_json::Value) -> BridgeResponse {
    let payload = match serde_json::from_value::<MatchPasskeysPayload>(payload) {
        Ok(value) => value,
        Err(error) => {
            return BridgeResponse::error(
                id,
                "INVALID_PAYLOAD",
                format!("matchPasskeysForRequest payload is invalid: {error}"),
            )
        }
    };

    let session_snapshot = match session::load_session() {
        Ok(Some(snapshot)) => snapshot,
        Ok(None) => {
            return BridgeResponse::error(
                id,
                "APP_LOCKED",
                "Desktop app has no published unlocked bridge session.",
            )
        }
        Err(error) => {
            return BridgeResponse::error(
                id,
                "SESSION_STORE_ERROR",
                format!("Failed to load bridge session: {error}"),
            )
        }
    };

    let result: MatchPasskeysForRequestResult = vault::match_passkeys_for_request(
        &session_snapshot.vault,
        &payload.rp_id,
        &payload.allowed_credential_ids,
    );

    BridgeResponse::success(id, result)
}

fn respond_assert_passkey(
    id: String,
    payload: serde_json::Value,
    client: BridgeClientInfo,
) -> BridgeResponse {
    let payload = match serde_json::from_value::<AssertPasskeyPayload>(payload) {
        Ok(value) => value,
        Err(error) => {
            return BridgeResponse::error(
                id,
                "INVALID_PAYLOAD",
                format!("assertPasskeyForBrowser payload is invalid: {error}"),
            )
        }
    };

    let session_snapshot = match session::load_session() {
        Ok(Some(snapshot)) => snapshot,
        Ok(None) => {
            return BridgeResponse::error(
                id,
                "APP_LOCKED",
                "Desktop app has no published unlocked bridge session.",
            )
        }
        Err(error) => {
            return BridgeResponse::error(
                id,
                "SESSION_STORE_ERROR",
                format!("Failed to load bridge session: {error}"),
            )
        }
    };

    let Some(material) = vault::passkey_assertion_material_for_request(
        &session_snapshot.vault,
        &payload.entry_id,
        payload.module_id.as_deref(),
        &payload.rp_id,
        &payload.allowed_credential_ids,
    ) else {
        return BridgeResponse::error(
            id,
            "PASSKEY_NOT_FOUND",
            "No matching passkey could be resolved for this request.",
        );
    };

    if !is_es256_algorithm(material.algorithm.as_deref()) {
        return BridgeResponse::error(
            id,
            "UNSUPPORTED_PASSKEY_ALGORITHM",
            "Only ES256 P-256 passkeys are supported for browser assertions right now.",
        );
    }

    if payload.user_verified {
        return BridgeResponse::error(
            id,
            "USER_VERIFICATION_UNSUPPORTED",
            "Passkey assertions with user verification are not supported yet.",
        );
    }

    let mut context = match webauthn::build_assertion_signing_context(
        &material.credential_id,
        material.user_handle.as_deref(),
        &material.relying_party_id,
        &payload.challenge,
        &payload.origin,
        payload.user_verified,
        material.backup_eligible,
        material.backup_state,
        material.sign_count,
    ) {
        Ok(value) => value,
        Err(error) => return BridgeResponse::error(id, "INVALID_WEBAUTHN_REQUEST", error),
    };

    // Validate request bytes and key before allocating a counter in the app.
    if let Err(error) =
        webauthn::build_signed_assertion_public_key_credential(&material.private_key, &context)
    {
        return BridgeResponse::error(id, "PASSKEY_ASSERTION_FAILED", error);
    }
    let reservation = match write::reserve_passkey_assertion(
        id.clone(),
        client,
        write::ReservePasskeyAssertionPayload {
            entry_id: material.entry_id.clone(),
            module_id: material.module_id.clone(),
            relying_party_id: material.relying_party_id.clone(),
            credential_id: material.credential_id.clone(),
            minimum_sign_count: material.sign_count,
        },
    ) {
        Ok(value) if value.ok => value,
        Ok(value) => return bridge_result_to_response(id, value),
        Err(error) => {
            return BridgeResponse::error(id, "PASSKEY_RESERVATION_FAILED", error.to_string())
        }
    };
    let count = reservation
        .result
        .as_ref()
        .and_then(|value| value.get("signCount"))
        .and_then(serde_json::Value::as_u64)
        .and_then(|value| u32::try_from(value).ok());
    let Some(count) = count
        .filter(|count| (*count == 0 && material.sign_count == 0) || *count > material.sign_count)
    else {
        return BridgeResponse::error(
            id,
            "PASSKEY_RESERVATION_FAILED",
            "Desktop app returned an invalid signature counter.",
        );
    };
    if let Err(error) = webauthn::set_assertion_sign_count(&mut context, count) {
        return BridgeResponse::error(id, "PASSKEY_ASSERTION_FAILED", error);
    }
    match webauthn::build_signed_assertion_public_key_credential(&material.private_key, &context) {
        Ok(result) => BridgeResponse::success(id, result),
        Err(error) => BridgeResponse::error(id, "PASSKEY_ASSERTION_FAILED", error),
    }
}

fn is_es256_algorithm(algorithm: Option<&str>) -> bool {
    let Some(algorithm) = algorithm.map(|value| value.to_lowercase()) else {
        return true;
    };

    algorithm.trim().is_empty()
        || algorithm.contains("es256")
        || (algorithm.contains("ecdsa") && algorithm.contains("p-256"))
}

fn respond_create(request: BridgeRequest) -> BridgeResponse {
    let payload = match serde_json::from_value::<CreateEntryFromBrowserPayload>(request.payload) {
        Ok(value) => value,
        Err(error) => {
            return BridgeResponse::error(
                request.id,
                "INVALID_PAYLOAD",
                format!("createEntryFromBrowser payload is invalid: {error}"),
            )
        }
    };

    match write::queue_create_request(request.id.clone(), request.client, payload) {
        Ok(result) => bridge_result_to_response(request.id, result),
        Err(error) if error.kind() == io::ErrorKind::InvalidInput => {
            BridgeResponse::error(request.id, "INVALID_PAYLOAD", error.to_string())
        }
        Err(error) if error.kind() == io::ErrorKind::TimedOut => BridgeResponse::error(
            request.id,
            "WRITE_TIMEOUT",
            "Desktop app did not complete the browser save request in time.",
        ),
        Err(error) => BridgeResponse::error(
            request.id,
            "WRITE_REQUEST_ERROR",
            format!("Failed to queue browser create request: {error}"),
        ),
    }
}

fn respond_update(request: BridgeRequest) -> BridgeResponse {
    let payload = match serde_json::from_value::<UpdateEntryFromBrowserPayload>(request.payload) {
        Ok(value) => value,
        Err(error) => {
            return BridgeResponse::error(
                request.id,
                "INVALID_PAYLOAD",
                format!("updateEntryFromBrowser payload is invalid: {error}"),
            )
        }
    };

    match write::queue_update_request(request.id.clone(), request.client, payload) {
        Ok(result) => bridge_result_to_response(request.id, result),
        Err(error) if error.kind() == io::ErrorKind::InvalidInput => {
            BridgeResponse::error(request.id, "INVALID_PAYLOAD", error.to_string())
        }
        Err(error) if error.kind() == io::ErrorKind::TimedOut => BridgeResponse::error(
            request.id,
            "WRITE_TIMEOUT",
            "Desktop app did not complete the browser update request in time.",
        ),
        Err(error) => BridgeResponse::error(
            request.id,
            "WRITE_REQUEST_ERROR",
            format!("Failed to queue browser update request: {error}"),
        ),
    }
}

fn bridge_result_to_response(id: String, result: write::BrowserWriteResult) -> BridgeResponse {
    if result.ok {
        BridgeResponse {
            id,
            ok: true,
            result: result.result,
            error: None,
        }
    } else if let Some(error) = result.error {
        BridgeResponse {
            id,
            ok: false,
            result: None,
            error: Some(error),
        }
    } else {
        BridgeResponse::error(id, "WRITE_FAILED", "Browser write request failed.")
    }
}

fn read_frame<R: Read>(reader: &mut R) -> io::Result<Option<Vec<u8>>> {
    let mut length_buf = [0u8; 4];

    match reader.read_exact(&mut length_buf) {
        Ok(()) => {}
        Err(error) if error.kind() == io::ErrorKind::UnexpectedEof => return Ok(None),
        Err(error) => return Err(error),
    }

    let length = u32::from_le_bytes(length_buf) as usize;
    let mut payload = vec![0u8; length];
    reader.read_exact(&mut payload)?;
    Ok(Some(payload))
}

fn write_frame<W: Write>(writer: &mut W, response: &BridgeResponse) -> io::Result<()> {
    let json =
        serde_json::to_vec(response).map_err(|err| io::Error::new(io::ErrorKind::Other, err))?;
    let length = json.len() as u32;
    writer.write_all(&length.to_le_bytes())?;
    writer.write_all(&json)?;
    Ok(())
}
