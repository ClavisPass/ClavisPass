use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine as _};
use p256::{
    ecdsa::{signature::Signer, Signature, SigningKey},
    pkcs8::DecodePrivateKey,
};
use serde::Serialize;
use sha2::{Digest, Sha256};
use std::collections::BTreeMap;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ClientDataJson {
    #[serde(rename = "type")]
    pub kind: String,
    pub challenge: String,
    pub origin: String,
    pub cross_origin: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AssertionPublicKeyCredential {
    pub id: String,
    pub raw_id: String,
    #[serde(rename = "type")]
    pub kind: String,
    pub response: AssertionAuthenticatorResponse,
    pub client_extension_results: BTreeMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AssertionAuthenticatorResponse {
    pub authenticator_data: String,
    #[serde(rename = "clientDataJSON")]
    pub client_data_json: String,
    pub signature: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_handle: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AssertionSigningContext {
    pub credential_id: String,
    pub user_handle: Option<String>,
    pub authenticator_data: Vec<u8>,
    pub client_data_json: Vec<u8>,
    pub signature_payload: Vec<u8>,
}

pub fn base64url_encode(bytes: &[u8]) -> String {
    URL_SAFE_NO_PAD.encode(bytes)
}

pub fn base64url_decode(value: &str) -> Result<Vec<u8>, String> {
    let normalized = value.trim().trim_end_matches('=');
    URL_SAFE_NO_PAD
        .decode(normalized)
        .map_err(|error| format!("Invalid base64url value: {error}"))
}

pub fn sha256(bytes: &[u8]) -> [u8; 32] {
    Sha256::digest(bytes).into()
}

pub fn build_get_client_data_json(challenge: &str, origin: &str) -> Result<Vec<u8>, String> {
    build_client_data_json("webauthn.get", challenge, origin)
}

pub fn build_create_client_data_json(challenge: &str, origin: &str) -> Result<Vec<u8>, String> {
    build_client_data_json("webauthn.create", challenge, origin)
}

pub fn build_assertion_authenticator_data(
    rp_id: &str,
    user_present: bool,
    user_verified: bool,
    backup_eligible: bool,
    backup_state: bool,
    sign_count: u32,
) -> Result<Vec<u8>, String> {
    let normalized_rp_id = rp_id.trim().trim_end_matches('.').to_lowercase();
    if normalized_rp_id.is_empty() {
        return Err("rpId is required".to_string());
    }
    if backup_state && !backup_eligible {
        return Err("backupState requires backupEligible".to_string());
    }

    let mut flags = 0u8;
    if user_present {
        flags |= 0x01;
    }
    if user_verified {
        flags |= 0x04;
    }
    if backup_eligible {
        flags |= 0x08;
    }
    if backup_state {
        flags |= 0x10;
    }

    let rp_id_hash = sha256(normalized_rp_id.as_bytes());
    let mut authenticator_data = Vec::with_capacity(37);
    authenticator_data.extend_from_slice(&rp_id_hash);
    authenticator_data.push(flags);
    authenticator_data.extend_from_slice(&sign_count.to_be_bytes());
    Ok(authenticator_data)
}

pub fn build_assertion_signature_payload(
    authenticator_data: &[u8],
    client_data_json: &[u8],
) -> Result<Vec<u8>, String> {
    if authenticator_data.len() < 37 {
        return Err("authenticatorData must include rpIdHash, flags, and signCount".to_string());
    }

    if client_data_json.is_empty() {
        return Err("clientDataJSON is required".to_string());
    }

    let client_data_hash = sha256(client_data_json);
    let mut payload = Vec::with_capacity(authenticator_data.len() + client_data_hash.len());
    payload.extend_from_slice(authenticator_data);
    payload.extend_from_slice(&client_data_hash);
    Ok(payload)
}

pub fn build_assertion_public_key_credential(
    credential_id: &str,
    user_handle: Option<&str>,
    authenticator_data: &[u8],
    client_data_json: &[u8],
    signature: &[u8],
) -> Result<AssertionPublicKeyCredential, String> {
    let normalized_credential_id = normalize_base64url("credentialId", credential_id)?;
    let normalized_user_handle = user_handle
        .map(|value| normalize_base64url("userHandle", value))
        .transpose()?;

    if authenticator_data.len() < 37 {
        return Err("authenticatorData must include rpIdHash, flags, and signCount".to_string());
    }

    if client_data_json.is_empty() {
        return Err("clientDataJSON is required".to_string());
    }

    if signature.is_empty() {
        return Err("signature is required".to_string());
    }

    Ok(AssertionPublicKeyCredential {
        id: normalized_credential_id.clone(),
        raw_id: normalized_credential_id,
        kind: "public-key".to_string(),
        response: AssertionAuthenticatorResponse {
            authenticator_data: base64url_encode(authenticator_data),
            client_data_json: base64url_encode(client_data_json),
            signature: base64url_encode(signature),
            user_handle: normalized_user_handle,
        },
        client_extension_results: BTreeMap::new(),
    })
}

pub fn sign_es256_pkcs8_base64url(private_key: &str, payload: &[u8]) -> Result<Vec<u8>, String> {
    let private_key_bytes = base64url_decode(private_key)
        .map_err(|_| "privateKey must be a base64url encoded PKCS#8 P-256 key".to_string())?;

    if payload.is_empty() {
        return Err("signature payload is required".to_string());
    }

    let signing_key = SigningKey::from_pkcs8_der(&private_key_bytes)
        .map_err(|_| "privateKey must be a PKCS#8 P-256 key".to_string())?;
    let signature: Signature = signing_key.sign(payload);
    Ok(signature.to_der().as_bytes().to_vec())
}

pub fn build_signed_assertion_public_key_credential(
    private_key: &str,
    context: &AssertionSigningContext,
) -> Result<AssertionPublicKeyCredential, String> {
    let signature = sign_es256_pkcs8_base64url(private_key, &context.signature_payload)?;

    build_assertion_public_key_credential(
        &context.credential_id,
        context.user_handle.as_deref(),
        &context.authenticator_data,
        &context.client_data_json,
        &signature,
    )
}

pub fn set_assertion_sign_count(
    context: &mut AssertionSigningContext,
    sign_count: u32,
) -> Result<(), String> {
    if context.authenticator_data.len() != 37 {
        return Err("Unexpected assertion authenticator data length".to_string());
    }
    context.authenticator_data[33..37].copy_from_slice(&sign_count.to_be_bytes());
    context.signature_payload =
        build_assertion_signature_payload(&context.authenticator_data, &context.client_data_json)?;
    Ok(())
}

#[allow(clippy::too_many_arguments)]
pub fn build_assertion_signing_context(
    credential_id: &str,
    user_handle: Option<&str>,
    rp_id: &str,
    challenge: &str,
    origin: &str,
    user_verified: bool,
    backup_eligible: bool,
    backup_state: bool,
    sign_count: u32,
) -> Result<AssertionSigningContext, String> {
    validate_rp_origin(rp_id, origin)?;
    let normalized_credential_id = normalize_base64url("credentialId", credential_id)?;
    let normalized_user_handle = user_handle
        .map(|value| normalize_base64url("userHandle", value))
        .transpose()?;
    let client_data_json = build_get_client_data_json(challenge, origin)?;
    let authenticator_data = build_assertion_authenticator_data(
        rp_id,
        true,
        user_verified,
        backup_eligible,
        backup_state,
        sign_count,
    )?;
    let signature_payload =
        build_assertion_signature_payload(&authenticator_data, &client_data_json)?;

    Ok(AssertionSigningContext {
        credential_id: normalized_credential_id,
        user_handle: normalized_user_handle,
        authenticator_data,
        client_data_json,
        signature_payload,
    })
}

fn validate_rp_origin(rp_id: &str, origin: &str) -> Result<(), String> {
    let rp_id = rp_id.trim().trim_end_matches('.').to_lowercase();
    let valid_labels = rp_id.len() <= 253
        && rp_id.split('.').all(|label| {
            !label.is_empty()
                && label.len() <= 63
                && !label.starts_with('-')
                && !label.ends_with('-')
                && label
                    .bytes()
                    .all(|byte| byte.is_ascii_alphanumeric() || byte == b'-')
        });
    if !valid_labels
        || rp_id.parse::<std::net::IpAddr>().is_ok()
        || (rp_id != "localhost" && psl::domain(rp_id.as_bytes()).is_none())
    {
        return Err("rpId must be a registrable domain or localhost".to_string());
    }
    let parsed = url::Url::parse(origin).map_err(|_| "Invalid WebAuthn origin".to_string())?;
    if parsed.origin().ascii_serialization() != origin {
        return Err(
            "WebAuthn origin must be a serialized origin without path or credentials".to_string(),
        );
    }
    let host = parsed
        .host_str()
        .ok_or_else(|| "Origin hostname is required".to_string())?;
    if parsed.scheme() != "https" && !(parsed.scheme() == "http" && host == "localhost") {
        return Err("WebAuthn origin must be secure".to_string());
    }
    let host = host.trim_end_matches('.');
    if host != rp_id && !host.ends_with(&format!(".{rp_id}")) {
        return Err("rpId does not match the WebAuthn origin".to_string());
    }
    Ok(())
}

fn build_client_data_json(kind: &str, challenge: &str, origin: &str) -> Result<Vec<u8>, String> {
    let normalized_challenge = normalize_base64url("challenge", challenge)?;

    if origin.trim().is_empty() {
        return Err("origin is required".to_string());
    }

    serde_json::to_vec(&ClientDataJson {
        kind: kind.to_string(),
        challenge: normalized_challenge,
        origin: origin.trim().to_string(),
        cross_origin: false,
    })
    .map_err(|error| format!("Failed to serialize clientDataJSON: {error}"))
}

fn normalize_base64url(field_name: &str, value: &str) -> Result<String, String> {
    let normalized = value.trim().trim_end_matches('=');
    if normalized.is_empty() {
        return Err(format!("{field_name} is required"));
    }

    base64url_decode(normalized)
        .map(|_| normalized.to_string())
        .map_err(|_| format!("{field_name} must be base64url encoded"))
}

#[cfg(test)]
mod tests {
    use super::*;
    use p256::ecdsa::{signature::Verifier, VerifyingKey};

    fn pkcs8_key_for_testing() -> Vec<u8> {
        vec![
            0x30, 0x81, 0x87, 0x02, 0x01, 0x00, 0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce,
            0x3d, 0x02, 0x01, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07, 0x04,
            0x6d, 0x30, 0x6b, 0x02, 0x01, 0x01, 0x04, 0x20, 0x06, 0x76, 0x5e, 0x85, 0xe0, 0x7f,
            0xef, 0x43, 0xaa, 0x17, 0xe0, 0x7a, 0xd7, 0x85, 0x63, 0x01, 0x80, 0x70, 0x8c, 0x6c,
            0x61, 0x43, 0x7d, 0xc3, 0xb1, 0xe6, 0xf9, 0x09, 0x24, 0xeb, 0x1f, 0xf5, 0xa1, 0x44,
            0x03, 0x42, 0x00, 0x04, 0x35, 0x9a, 0x52, 0xf3, 0x82, 0x44, 0x66, 0x5f, 0x3f, 0xe2,
            0xc4, 0x0b, 0x1c, 0x16, 0x34, 0xc5, 0x60, 0x07, 0x3a, 0x25, 0xfe, 0x7e, 0x7f, 0x7f,
            0xda, 0xd4, 0x1c, 0x36, 0x90, 0x00, 0xee, 0xb1, 0x8e, 0x92, 0xb3, 0xac, 0x91, 0x7f,
            0xb1, 0x8c, 0xa4, 0x85, 0xe7, 0x03, 0x07, 0xd1, 0xf5, 0x5b, 0xd3, 0x7b, 0xc3, 0x56,
            0x11, 0xdf, 0xbc, 0x7a, 0x97, 0x70, 0x32, 0x4b, 0x3c, 0x84, 0x05, 0x71,
        ]
    }

    #[test]
    fn base64url_round_trips_without_padding() {
        let encoded = base64url_encode(b"hello passkey");

        assert_eq!(encoded, "aGVsbG8gcGFzc2tleQ");
        assert_eq!(base64url_decode(&encoded).unwrap(), b"hello passkey");
        assert_eq!(
            base64url_decode("aGVsbG8gcGFzc2tleQ==").unwrap(),
            b"hello passkey"
        );
    }

    #[test]
    fn sha256_matches_known_vector() {
        let digest = sha256(b"abc");

        assert_eq!(
            base64url_encode(&digest),
            "ungWv48Bz-pBQUDeXa4iI7ADYaOWF3qctBD_YfIAFa0"
        );
    }

    #[test]
    fn builds_get_client_data_json_with_normalized_challenge() {
        let json = build_get_client_data_json("Y2hhbGxlbmdl==", "https://example.com").unwrap();
        let value: serde_json::Value = serde_json::from_slice(&json).unwrap();

        assert_eq!(value["type"], "webauthn.get");
        assert_eq!(value["challenge"], "Y2hhbGxlbmdl");
        assert_eq!(value["origin"], "https://example.com");
        assert_eq!(value["crossOrigin"], false);
    }

    #[test]
    fn rejects_invalid_client_data_inputs() {
        assert!(build_get_client_data_json("not valid!", "https://example.com").is_err());
        assert!(build_create_client_data_json("Y2hhbGxlbmdl", "").is_err());
    }

    #[test]
    fn rejects_invalid_rp_origin_pairs_at_native_boundary() {
        for (origin, rp_id) in [
            ("https://example.com", "com"),
            ("https://shop.example.co.uk", "co.uk"),
            ("https://alice.github.io", "github.io"),
            ("https://evil-example.com", "example.com"),
            ("https://example.com", "https://example.com"),
            ("https://example.com", "example.com:443"),
            ("https://example.com", "example.com/path"),
            ("https://example.com", "example..com"),
            ("https://example.com", ""),
            ("https://127.0.0.1", "127.0.0.1"),
            ("http://127.0.0.1", "127.0.0.1"),
            ("http://example.com", "example.com"),
            ("ftp://localhost", "localhost"),
            ("https://example.com/path", "example.com"),
            ("https://user@example.com", "example.com"),
            ("https://example.com#fragment", "example.com"),
        ] {
            assert!(
                validate_rp_origin(rp_id, origin).is_err(),
                "{origin} / {rp_id}"
            );
        }
    }

    #[test]
    fn accepts_valid_rp_origin_pairs_at_native_boundary() {
        for (origin, rp_id) in [
            ("https://example.com", "example.com"),
            ("https://login.example.com", "example.com"),
            ("https://login.example.com:8443", "example.com"),
            ("https://alice.github.io", "alice.github.io"),
            ("https://login.example.co.uk", "example.co.uk"),
            ("http://localhost:8787", "localhost"),
        ] {
            assert!(
                validate_rp_origin(rp_id, origin).is_ok(),
                "{origin} / {rp_id}"
            );
        }
    }

    #[test]
    fn builds_assertion_authenticator_data() {
        let authenticator_data =
            build_assertion_authenticator_data("Example.COM.", true, true, true, false, 5).unwrap();
        let expected_rp_id_hash = sha256(b"example.com");

        assert_eq!(authenticator_data.len(), 37);
        assert_eq!(&authenticator_data[..32], expected_rp_id_hash.as_slice());
        assert_eq!(authenticator_data[32], 0x0d);
        assert_eq!(&authenticator_data[33..], &[0, 0, 0, 5]);
    }

    #[test]
    fn rejects_missing_authenticator_data_rp_id() {
        assert!(build_assertion_authenticator_data("", true, false, false, false, 0).is_err());
    }

    #[test]
    fn rejects_backed_up_credentials_that_are_not_backup_eligible() {
        assert!(
            build_assertion_authenticator_data("example.com", true, false, false, true, 0).is_err()
        );
    }

    #[test]
    fn reserved_counter_is_included_in_verified_signature() {
        let mut context = build_assertion_signing_context(
            "Y3JlZA",
            None,
            "example.com",
            "Y2hhbGxlbmdl",
            "https://example.com",
            false,
            false,
            false,
            41,
        )
        .unwrap();
        set_assertion_sign_count(&mut context, 42).unwrap();
        let key_bytes = pkcs8_key_for_testing();
        let credential =
            build_signed_assertion_public_key_credential(&base64url_encode(&key_bytes), &context)
                .unwrap();
        let auth_data = base64url_decode(&credential.response.authenticator_data).unwrap();
        assert_eq!(&auth_data[33..37], &42u32.to_be_bytes());
        let signed_bytes =
            build_assertion_signature_payload(&auth_data, &context.client_data_json).unwrap();
        let key = SigningKey::from_pkcs8_der(&key_bytes).unwrap();
        let signature =
            Signature::from_der(&base64url_decode(&credential.response.signature).unwrap())
                .unwrap();
        key.verifying_key()
            .verify(&signed_bytes, &signature)
            .unwrap();
    }

    #[test]
    fn builds_assertion_signature_payload() {
        let authenticator_data =
            build_assertion_authenticator_data("example.com", true, false, false, false, 1)
                .unwrap();
        let client_data_json =
            build_get_client_data_json("Y2hhbGxlbmdl", "https://example.com").unwrap();
        let payload =
            build_assertion_signature_payload(&authenticator_data, &client_data_json).unwrap();
        let expected_client_data_hash = sha256(&client_data_json);

        assert_eq!(payload.len(), 69);
        assert_eq!(&payload[..37], authenticator_data.as_slice());
        assert_eq!(&payload[37..], expected_client_data_hash.as_slice());
    }

    #[test]
    fn rejects_incomplete_assertion_signature_payload_inputs() {
        assert!(build_assertion_signature_payload(&[], b"{}").is_err());
        assert!(build_assertion_signature_payload(&[0; 37], &[]).is_err());
    }

    #[test]
    fn builds_assertion_public_key_credential_response() {
        let authenticator_data =
            build_assertion_authenticator_data("example.com", true, false, false, false, 7)
                .unwrap();
        let client_data_json =
            build_get_client_data_json("Y2hhbGxlbmdl", "https://example.com").unwrap();
        let credential = build_assertion_public_key_credential(
            "Y3JlZGVudGlhbA==",
            Some("dXNlcg=="),
            &authenticator_data,
            &client_data_json,
            b"signature bytes",
        )
        .unwrap();
        let value = serde_json::to_value(credential).unwrap();

        assert_eq!(value["id"], "Y3JlZGVudGlhbA");
        assert_eq!(value["rawId"], "Y3JlZGVudGlhbA");
        assert_eq!(value["type"], "public-key");
        assert_eq!(value["response"]["userHandle"], "dXNlcg");
        assert_eq!(
            value["response"]["authenticatorData"],
            base64url_encode(&authenticator_data)
        );
        assert_eq!(
            value["response"]["clientDataJSON"],
            base64url_encode(&client_data_json)
        );
        assert_eq!(
            value["response"]["signature"],
            base64url_encode(b"signature bytes")
        );
        assert_eq!(value["clientExtensionResults"], serde_json::json!({}));
    }

    #[test]
    fn rejects_invalid_assertion_public_key_credential_inputs() {
        let authenticator_data =
            build_assertion_authenticator_data("example.com", true, false, false, false, 0)
                .unwrap();
        let client_data_json =
            build_get_client_data_json("Y2hhbGxlbmdl", "https://example.com").unwrap();

        assert!(build_assertion_public_key_credential(
            "",
            None,
            &authenticator_data,
            &client_data_json,
            b"signature"
        )
        .is_err());
        assert!(build_assertion_public_key_credential(
            "Y3JlZGVudGlhbA",
            Some("not valid!"),
            &authenticator_data,
            &client_data_json,
            b"signature"
        )
        .is_err());
        assert!(build_assertion_public_key_credential(
            "Y3JlZGVudGlhbA",
            None,
            &authenticator_data,
            &client_data_json,
            b""
        )
        .is_err());
    }

    #[test]
    fn signs_es256_pkcs8_base64url_payload() {
        let private_key = base64url_encode(&pkcs8_key_for_testing());
        let payload = b"payload to sign";
        let signature_bytes = sign_es256_pkcs8_base64url(&private_key, payload).unwrap();
        let signature = Signature::from_der(&signature_bytes).unwrap();
        let signing_key = SigningKey::from_pkcs8_der(&pkcs8_key_for_testing()).unwrap();
        let verifying_key = VerifyingKey::from(&signing_key);

        verifying_key.verify(payload, &signature).unwrap();
    }

    #[test]
    fn rejects_invalid_es256_signing_inputs() {
        assert!(sign_es256_pkcs8_base64url("not valid!", b"payload").is_err());
        assert!(sign_es256_pkcs8_base64url(&base64url_encode(&[1, 2, 3]), b"payload").is_err());
        assert!(
            sign_es256_pkcs8_base64url(&base64url_encode(&pkcs8_key_for_testing()), b"").is_err()
        );
    }

    #[test]
    fn builds_signed_assertion_public_key_credential() {
        let private_key = base64url_encode(&pkcs8_key_for_testing());
        let context = build_assertion_signing_context(
            "Y3JlZGVudGlhbA",
            Some("dXNlcg"),
            "example.com",
            "Y2hhbGxlbmdl",
            "https://example.com",
            false,
            false,
            false,
            0,
        )
        .unwrap();
        let credential =
            build_signed_assertion_public_key_credential(&private_key, &context).unwrap();
        let signature_bytes =
            base64url_decode(&credential.response.signature).expect("signature should decode");
        let signature = Signature::from_der(&signature_bytes).unwrap();
        let signing_key = SigningKey::from_pkcs8_der(&pkcs8_key_for_testing()).unwrap();
        let verifying_key = VerifyingKey::from(&signing_key);

        assert_eq!(credential.id, "Y3JlZGVudGlhbA");
        assert_eq!(credential.response.user_handle.as_deref(), Some("dXNlcg"));
        verifying_key
            .verify(&context.signature_payload, &signature)
            .unwrap();
    }

    #[test]
    fn builds_assertion_signing_context() {
        let context = build_assertion_signing_context(
            "Y3JlZGVudGlhbA==",
            Some("dXNlcg=="),
            "Example.COM.",
            "Y2hhbGxlbmdl==",
            "https://example.com",
            true,
            true,
            false,
            9,
        )
        .unwrap();
        let expected_authenticator_data =
            build_assertion_authenticator_data("example.com", true, true, true, false, 9).unwrap();
        let expected_client_data_json =
            build_get_client_data_json("Y2hhbGxlbmdl", "https://example.com").unwrap();
        let expected_signature_payload = build_assertion_signature_payload(
            &expected_authenticator_data,
            &expected_client_data_json,
        )
        .unwrap();

        assert_eq!(context.credential_id, "Y3JlZGVudGlhbA");
        assert_eq!(context.user_handle.as_deref(), Some("dXNlcg"));
        assert_eq!(context.authenticator_data, expected_authenticator_data);
        assert_eq!(context.client_data_json, expected_client_data_json);
        assert_eq!(context.signature_payload, expected_signature_payload);
    }

    #[test]
    fn rejects_invalid_assertion_signing_context_inputs() {
        assert!(build_assertion_signing_context(
            "not valid!",
            None,
            "example.com",
            "Y2hhbGxlbmdl",
            "https://example.com",
            false,
            false,
            false,
            0
        )
        .is_err());
        assert!(build_assertion_signing_context(
            "Y3JlZGVudGlhbA",
            Some("dXNlcg"),
            "",
            "Y2hhbGxlbmdl",
            "https://example.com",
            false,
            false,
            false,
            0
        )
        .is_err());
    }
}
