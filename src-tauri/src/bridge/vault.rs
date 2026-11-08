use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FolderRef {
    pub id: String,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct VaultModule {
    pub module: String,
    #[serde(default)]
    pub id: Option<String>,
    #[serde(default)]
    pub title: Option<String>,
    #[serde(default)]
    pub value: Option<Value>,
    #[serde(default, rename = "relyingPartyId")]
    pub relying_party_id: Option<String>,
    #[serde(default, rename = "relyingPartyName")]
    pub relying_party_name: Option<String>,
    #[serde(default, rename = "userName")]
    pub user_name: Option<String>,
    #[serde(default, rename = "userDisplayName")]
    pub user_display_name: Option<String>,
    #[serde(default, rename = "credentialId")]
    pub credential_id: Option<String>,
    #[serde(default, rename = "userHandle")]
    pub user_handle: Option<String>,
    #[serde(default, rename = "publicKey")]
    pub public_key: Option<String>,
    #[serde(default, rename = "privateKey")]
    pub private_key: Option<String>,
    #[serde(default)]
    pub algorithm: Option<String>,
    #[serde(default)]
    pub transports: Vec<String>,
    #[serde(default, rename = "backupEligible")]
    pub backup_eligible: Option<bool>,
    #[serde(default, rename = "backupState")]
    pub backup_state: Option<bool>,
    #[serde(default, rename = "signCount")]
    pub sign_count: Option<u32>,
    #[serde(default, rename = "createdAt")]
    pub created_at: Option<String>,
    #[serde(default, rename = "lastUsedAt")]
    pub last_used_at: Option<String>,
    #[serde(default)]
    pub source: Option<String>,
    #[serde(default, rename = "wifiName")]
    pub wifi_name: Option<String>,
    #[serde(default, rename = "wifiType")]
    pub wifi_type: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct VaultEntry {
    pub id: String,
    pub title: String,
    #[serde(default)]
    pub fav: bool,
    #[serde(default)]
    pub created: Option<String>,
    #[serde(default, rename = "lastUpdated")]
    pub last_updated: Option<String>,
    #[serde(default)]
    pub folder: Option<FolderRef>,
    #[serde(default)]
    pub modules: Vec<VaultModule>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct VaultData {
    #[serde(default)]
    pub version: Option<String>,
    #[serde(default)]
    pub folder: Vec<FolderRef>,
    #[serde(default)]
    pub values: Vec<VaultEntry>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchEntrySuggestion {
    pub entry_id: String,
    pub title: String,
    pub fav: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub folder_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub username: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,
    pub has_password: bool,
    pub has_totp: bool,
    pub has_passkey: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub matched_host: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FillDataResult {
    pub entry_id: String,
    pub title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub username: Option<String>,
    pub password: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub totp: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PasskeyCredentialMetadata {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub module_id: Option<String>,
    pub relying_party_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub relying_party_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_display_name: Option<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub transports: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub backup_eligible: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub backup_state: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_used_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PasskeyMetadataResult {
    pub entry_id: String,
    pub title: String,
    pub passkeys: Vec<PasskeyCredentialMetadata>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PasskeyRequestCandidate {
    pub entry_id: String,
    pub entry_title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub module_id: Option<String>,
    pub relying_party_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub relying_party_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_display_name: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MatchPasskeysForRequestResult {
    pub passkeys: Vec<PasskeyRequestCandidate>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PasskeyAssertionMaterial {
    pub entry_id: String,
    pub entry_title: String,
    pub module_id: Option<String>,
    pub relying_party_id: String,
    pub credential_id: String,
    pub user_handle: Option<String>,
    pub private_key: String,
    pub public_key: Option<String>,
    pub algorithm: Option<String>,
    pub backup_eligible: bool,
    pub backup_state: bool,
    pub sign_count: u32,
}

pub fn search_entries_by_domain(vault: &VaultData, domain: &str) -> Vec<SearchEntrySuggestion> {
    let target = normalize_domain(domain);
    if target.is_empty() {
        return Vec::new();
    }

    let mut matches = Vec::<(u8, SearchEntrySuggestion)>::new();

    for entry in &vault.values {
        let urls = entry_match_hosts(entry);
        let mut best_score = 0u8;
        let mut matched_host = None::<String>;

        for host in urls {
            let score = match_domain_score(&target, &host);
            if score > best_score {
                best_score = score;
                matched_host = Some(host);
            }
        }

        if best_score == 0 {
            continue;
        }

        matches.push((
            best_score,
            SearchEntrySuggestion {
                entry_id: entry.id.clone(),
                title: entry.title.clone(),
                fav: entry.fav,
                folder_id: entry.folder.as_ref().map(|folder| folder.id.clone()),
                username: first_string(entry, "USERNAME").or_else(|| wifi_name(entry)),
                email: first_string(entry, "E_MAIL"),
                has_password: password_for_entry(entry).is_some(),
                has_totp: first_string(entry, "TOTP").is_some(),
                has_passkey: has_passkey(entry),
                matched_host,
            },
        ));
    }

    matches.sort_by(|left, right| {
        right
            .0
            .cmp(&left.0)
            .then_with(|| right.1.fav.cmp(&left.1.fav))
            .then_with(|| {
                left.1
                    .title
                    .to_lowercase()
                    .cmp(&right.1.title.to_lowercase())
            })
    });

    matches
        .into_iter()
        .map(|(_, suggestion)| suggestion)
        .collect()
}

pub fn fill_data_for_entry(vault: &VaultData, entry_id: &str) -> Option<FillDataResult> {
    let entry = vault.values.iter().find(|entry| entry.id == entry_id)?;
    let password = password_for_entry(entry)?;

    Some(FillDataResult {
        entry_id: entry.id.clone(),
        title: entry.title.clone(),
        username: first_string(entry, "USERNAME")
            .or_else(|| first_string(entry, "E_MAIL"))
            .or_else(|| wifi_name(entry)),
        password,
        totp: first_string(entry, "TOTP"),
    })
}

pub fn passkey_metadata_for_entry(
    vault: &VaultData,
    entry_id: &str,
) -> Option<PasskeyMetadataResult> {
    let entry = vault.values.iter().find(|entry| entry.id == entry_id)?;

    Some(PasskeyMetadataResult {
        entry_id: entry.id.clone(),
        title: entry.title.clone(),
        passkeys: entry
            .modules
            .iter()
            .filter(|module| module.module == "PASSKEY")
            .filter_map(passkey_metadata_for_module)
            .collect(),
    })
}

pub fn match_passkeys_for_request(
    vault: &VaultData,
    rp_id: &str,
    allowed_credential_ids: &[String],
) -> MatchPasskeysForRequestResult {
    let normalized_rp_id = normalize_rp_id(rp_id);
    let allowed_ids: Vec<String> = allowed_credential_ids
        .iter()
        .filter_map(|value| normalize_credential_id(value))
        .collect();
    let restrict_to_allowed_ids = !allowed_credential_ids.is_empty();
    let mut passkeys = Vec::new();

    if normalized_rp_id.is_empty() {
        return MatchPasskeysForRequestResult { passkeys };
    }

    for entry in &vault.values {
        for module in entry
            .modules
            .iter()
            .filter(|module| module.module == "PASSKEY")
        {
            let Some(module_rp_id) = module
                .relying_party_id
                .as_ref()
                .map(|value| normalize_rp_id(value))
                .filter(|value| value == &normalized_rp_id)
            else {
                continue;
            };

            if restrict_to_allowed_ids
                && !module
                    .credential_id
                    .as_ref()
                    .and_then(|value| normalize_credential_id(value))
                    .map(|value| allowed_ids.iter().any(|allowed| allowed == &value))
                    .unwrap_or(false)
            {
                continue;
            }

            passkeys.push(PasskeyRequestCandidate {
                entry_id: entry.id.clone(),
                entry_title: entry.title.clone(),
                module_id: non_empty_option(module.id.clone()),
                relying_party_id: module_rp_id,
                relying_party_name: non_empty_option(module.relying_party_name.clone()),
                user_name: non_empty_option(module.user_name.clone()),
                user_display_name: non_empty_option(module.user_display_name.clone()),
            });
        }
    }

    MatchPasskeysForRequestResult { passkeys }
}

pub fn passkey_assertion_material_for_request(
    vault: &VaultData,
    entry_id: &str,
    module_id: Option<&str>,
    rp_id: &str,
    allowed_credential_ids: &[String],
) -> Option<PasskeyAssertionMaterial> {
    let normalized_rp_id = normalize_rp_id(rp_id);
    let allowed_ids: Vec<String> = allowed_credential_ids
        .iter()
        .filter_map(|value| normalize_credential_id(value))
        .collect();
    let restrict_to_allowed_ids = !allowed_credential_ids.is_empty();

    if normalized_rp_id.is_empty() {
        return None;
    }

    let entry = vault.values.iter().find(|entry| entry.id == entry_id)?;

    entry
        .modules
        .iter()
        .filter(|module| module.module == "PASSKEY")
        .filter(|module| {
            module_id
                .map(|requested_module_id| module.id.as_deref() == Some(requested_module_id))
                .unwrap_or(true)
        })
        .filter_map(|module| {
            let module_rp_id = module
                .relying_party_id
                .as_ref()
                .map(|value| normalize_rp_id(value))
                .filter(|value| value == &normalized_rp_id)?;
            let credential_id = module
                .credential_id
                .as_ref()
                .and_then(|value| normalize_credential_id(value))?;
            let private_key = non_empty_option(module.private_key.clone())?;

            if restrict_to_allowed_ids
                && !allowed_ids.iter().any(|allowed| allowed == &credential_id)
            {
                return None;
            }

            Some(PasskeyAssertionMaterial {
                entry_id: entry.id.clone(),
                entry_title: entry.title.clone(),
                module_id: non_empty_option(module.id.clone()),
                relying_party_id: module_rp_id,
                credential_id,
                user_handle: module
                    .user_handle
                    .as_ref()
                    .and_then(|value| normalize_credential_id(value)),
                private_key,
                public_key: non_empty_option(module.public_key.clone()),
                algorithm: non_empty_option(module.algorithm.clone()),
                backup_eligible: module.backup_eligible.unwrap_or(false),
                backup_state: module.backup_state.unwrap_or(false),
                sign_count: module.sign_count.unwrap_or(0),
            })
        })
        .next()
}

fn passkey_metadata_for_module(module: &VaultModule) -> Option<PasskeyCredentialMetadata> {
    let relying_party_id = non_empty_option(module.relying_party_id.clone())?;

    Some(PasskeyCredentialMetadata {
        module_id: non_empty_option(module.id.clone()),
        relying_party_id,
        relying_party_name: non_empty_option(module.relying_party_name.clone()),
        user_name: non_empty_option(module.user_name.clone()),
        user_display_name: non_empty_option(module.user_display_name.clone()),
        transports: module
            .transports
            .iter()
            .map(|value| value.trim().to_string())
            .filter(|value| !value.is_empty())
            .collect(),
        backup_eligible: module.backup_eligible,
        backup_state: module.backup_state,
        created_at: non_empty_option(module.created_at.clone()),
        last_used_at: non_empty_option(module.last_used_at.clone()),
        source: non_empty_option(module.source.clone()),
    })
}

fn url_hosts(entry: &VaultEntry) -> Vec<String> {
    entry
        .modules
        .iter()
        .filter(|module| module.module == "URL")
        .filter_map(|module| module.value.as_ref())
        .filter_map(value_as_string)
        .map(|value| normalize_domain(&value))
        .filter(|value| !value.is_empty())
        .collect()
}

fn passkey_hosts(entry: &VaultEntry) -> Vec<String> {
    entry
        .modules
        .iter()
        .filter(|module| module.module == "PASSKEY")
        .filter_map(|module| module.relying_party_id.as_ref())
        .map(|value| normalize_domain(value))
        .filter(|value| !value.is_empty())
        .collect()
}

fn entry_match_hosts(entry: &VaultEntry) -> Vec<String> {
    let mut hosts = url_hosts(entry);
    hosts.extend(passkey_hosts(entry));
    hosts.sort();
    hosts.dedup();
    hosts
}

fn has_passkey(entry: &VaultEntry) -> bool {
    entry.modules.iter().any(|module| {
        module.module == "PASSKEY"
            && module
                .relying_party_id
                .as_ref()
                .map(|value| !value.trim().is_empty())
                .unwrap_or(false)
    })
}

fn first_string(entry: &VaultEntry, module_name: &str) -> Option<String> {
    entry
        .modules
        .iter()
        .find(|module| module.module == module_name)
        .and_then(|module| module.value.as_ref())
        .and_then(value_as_string)
}

fn wifi_name(entry: &VaultEntry) -> Option<String> {
    entry
        .modules
        .iter()
        .find(|module| module.module == "WIFI")
        .and_then(|module| module.wifi_name.clone())
        .filter(|value| !value.is_empty())
}

fn password_for_entry(entry: &VaultEntry) -> Option<String> {
    first_string(entry, "PASSWORD").or_else(|| {
        entry
            .modules
            .iter()
            .find(|module| module.module == "WIFI")
            .and_then(|module| module.value.as_ref())
            .and_then(value_as_string)
    })
}

fn non_empty_option(value: Option<String>) -> Option<String> {
    value
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

fn normalize_credential_id(value: &str) -> Option<String> {
    let normalized = value
        .trim()
        .replace('+', "-")
        .replace('/', "_")
        .trim_end_matches('=')
        .to_string();

    if normalized.is_empty() {
        None
    } else {
        Some(normalized)
    }
}

fn value_as_string(value: &Value) -> Option<String> {
    match value {
        Value::String(content) if !content.is_empty() => Some(content.clone()),
        _ => None,
    }
}

fn normalize_rp_id(input: &str) -> String {
    let normalized = input.trim().trim_end_matches('.').to_lowercase();
    if normalized.len() > 253
        || !normalized.split('.').all(|label| {
            !label.is_empty()
                && label.len() <= 63
                && !label.starts_with('-')
                && !label.ends_with('-')
                && label
                    .bytes()
                    .all(|byte| byte.is_ascii_alphanumeric() || byte == b'-')
        })
    {
        return String::new();
    }
    normalized
}

fn normalize_domain(input: &str) -> String {
    let mut value = input.trim().to_lowercase();
    if let Some(index) = value.find("://") {
        value = value[(index + 3)..].to_string();
    }

    if let Some(index) = value.find('/') {
        value.truncate(index);
    }

    if let Some(index) = value.find('?') {
        value.truncate(index);
    }

    if let Some(index) = value.find('#') {
        value.truncate(index);
    }

    if let Some(index) = value.find(':') {
        value.truncate(index);
    }

    while value.ends_with('.') {
        value.pop();
    }

    if let Some(stripped) = value.strip_prefix("www.") {
        return stripped.to_string();
    }

    value
}

fn match_domain_score(requested: &str, candidate: &str) -> u8 {
    if requested == candidate {
        return 3;
    }

    if candidate.ends_with(&format!(".{requested}")) {
        return 2;
    }

    if requested.ends_with(&format!(".{candidate}")) {
        return 1;
    }

    if related_domains_match(requested, candidate) {
        return 1;
    }

    0
}

fn related_domains_match(requested: &str, candidate: &str) -> bool {
    const RELATED_DOMAIN_GROUPS: &[&[&str]] = &[&[
        "accounts.google.com",
        "google.com",
        "youtube.com",
        "youtu.be",
    ]];

    RELATED_DOMAIN_GROUPS.iter().any(|group| {
        group
            .iter()
            .any(|domain| domain_contains(requested, domain))
            && group
                .iter()
                .any(|domain| domain_contains(candidate, domain))
    })
}

fn domain_contains(host: &str, domain: &str) -> bool {
    host == domain || host.ends_with(&format!(".{domain}"))
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn login_entry(id: &str, title: &str, url: &str, username: &str, fav: bool) -> VaultEntry {
        VaultEntry {
            id: id.to_string(),
            title: title.to_string(),
            fav,
            modules: vec![
                VaultModule {
                    module: "URL".to_string(),
                    value: Some(json!(url)),
                    ..Default::default()
                },
                VaultModule {
                    module: "USERNAME".to_string(),
                    value: Some(json!(username)),
                    ..Default::default()
                },
                VaultModule {
                    module: "PASSWORD".to_string(),
                    value: Some(json!("secret")),
                    ..Default::default()
                },
            ],
            ..Default::default()
        }
    }

    #[test]
    fn search_entries_by_domain_returns_all_matching_entries() {
        let vault = VaultData {
            values: vec![
                login_entry(
                    "first",
                    "YouTube Personal",
                    "https://youtube.com",
                    "one",
                    false,
                ),
                login_entry(
                    "second",
                    "YouTube Work",
                    "https://www.youtube.com",
                    "two",
                    true,
                ),
                login_entry("other", "Other", "https://example.com", "other", false),
            ],
            ..Default::default()
        };

        let results = search_entries_by_domain(&vault, "youtube.com");

        assert_eq!(results.len(), 2);
        assert_eq!(results[0].entry_id, "second");
        assert_eq!(results[1].entry_id, "first");
    }

    #[test]
    fn search_entries_by_domain_includes_related_google_accounts_for_youtube() {
        let vault = VaultData {
            values: vec![
                login_entry(
                    "youtube",
                    "YouTube Direct",
                    "https://youtube.com",
                    "yt",
                    false,
                ),
                login_entry(
                    "google",
                    "Google Account",
                    "https://accounts.google.com",
                    "google",
                    false,
                ),
            ],
            ..Default::default()
        };

        let results = search_entries_by_domain(&vault, "www.youtube.com");

        assert_eq!(results.len(), 2);
        assert_eq!(results[0].entry_id, "youtube");
        assert_eq!(results[1].entry_id, "google");
        assert_eq!(
            results[1].matched_host.as_deref(),
            Some("accounts.google.com")
        );
    }

    #[test]
    fn search_entries_by_domain_matches_passkey_rp_id() {
        let vault = VaultData {
            values: vec![VaultEntry {
                id: "passkey-entry".to_string(),
                title: "Example Passkey".to_string(),
                modules: vec![VaultModule {
                    module: "PASSKEY".to_string(),
                    relying_party_id: Some("login.example.com".to_string()),
                    relying_party_name: Some("Example".to_string()),
                    user_name: Some("alice".to_string()),
                    ..Default::default()
                }],
                ..Default::default()
            }],
            ..Default::default()
        };

        let results = search_entries_by_domain(&vault, "example.com");

        assert_eq!(results.len(), 1);
        assert_eq!(results[0].entry_id, "passkey-entry");
        assert!(results[0].has_passkey);
        assert!(!results[0].has_password);
        assert_eq!(
            results[0].matched_host.as_deref(),
            Some("login.example.com")
        );
    }

    #[test]
    fn passkey_metadata_for_entry_excludes_secret_fields() {
        let vault: VaultData = serde_json::from_value(json!({
            "values": [
                {
                    "id": "passkey-entry",
                    "title": "Example Passkey",
                    "modules": [
                        {
                            "id": "module-1",
                            "module": "PASSKEY",
                            "relyingPartyId": "example.com",
                            "relyingPartyName": "Example",
                            "userName": "alice",
                            "userDisplayName": "Alice Example",
                            "userHandle": "secret-user-handle",
                            "credentialId": "secret-credential-id",
                            "publicKey": "secret-public-key",
                            "privateKey": "secret-private-key",
                            "algorithm": "ES256",
                            "transports": ["internal", ""],
                            "backupEligible": true,
                            "backupState": false,
                            "createdAt": "2026-01-01T00:00:00.000Z",
                            "source": "Bitwarden JSON"
                        }
                    ]
                }
            ]
        }))
        .expect("vault should deserialize");

        let result = passkey_metadata_for_entry(&vault, "passkey-entry")
            .expect("entry metadata should exist");
        let serialized = serde_json::to_string(&result).expect("metadata should serialize");

        assert_eq!(result.entry_id, "passkey-entry");
        assert_eq!(result.passkeys.len(), 1);
        assert_eq!(result.passkeys[0].relying_party_id, "example.com");
        assert_eq!(result.passkeys[0].transports, vec!["internal"]);
        assert!(serialized.contains("relyingPartyId"));
        assert!(!serialized.contains("credentialId"));
        assert!(!serialized.contains("userHandle"));
        assert!(!serialized.contains("privateKey"));
        assert!(!serialized.contains("publicKey"));
        assert!(!serialized.contains("secret-"));
    }

    #[test]
    fn match_passkeys_for_request_filters_by_allowed_credentials_without_returning_ids() {
        let vault: VaultData = serde_json::from_value(json!({
            "values": [
                {
                    "id": "matching-entry",
                    "title": "Matching Passkey",
                    "modules": [
                        {
                            "id": "module-1",
                            "module": "PASSKEY",
                            "relyingPartyId": "example.com",
                            "relyingPartyName": "Example",
                            "userName": "alice",
                            "credentialId": "abc123=="
                        }
                    ]
                },
                {
                    "id": "other-entry",
                    "title": "Other Passkey",
                    "modules": [
                        {
                            "id": "module-2",
                            "module": "PASSKEY",
                            "relyingPartyId": "example.com",
                            "userName": "bob",
                            "credentialId": "def456"
                        }
                    ]
                }
            ]
        }))
        .expect("vault should deserialize");

        let result = match_passkeys_for_request(&vault, "example.com", &["abc123".to_string()]);
        let serialized = serde_json::to_string(&result).expect("candidates should serialize");

        assert_eq!(result.passkeys.len(), 1);
        assert_eq!(result.passkeys[0].entry_id, "matching-entry");
        assert_eq!(result.passkeys[0].user_name.as_deref(), Some("alice"));
        assert!(!serialized.contains("credentialId"));
        assert!(!serialized.contains("abc123"));
        assert!(!serialized.contains("def456"));
    }

    #[test]
    fn passkey_assertion_material_for_request_returns_native_only_secret_fields() {
        let vault: VaultData = serde_json::from_value(json!({
            "values": [
                {
                    "id": "matching-entry",
                    "title": "Matching Passkey",
                    "modules": [
                        {
                            "id": "module-1",
                            "module": "PASSKEY",
                            "relyingPartyId": "Example.COM.",
                            "relyingPartyName": "Example",
                            "userName": "alice",
                            "userHandle": "dXNlcg==",
                            "credentialId": "abc123==",
                            "publicKey": "public-key-material",
                            "privateKey": "private-key-material",
                            "algorithm": "ES256",
                            "backupEligible": true,
                            "backupState": false,
                            "signCount": 42
                        }
                    ]
                }
            ]
        }))
        .expect("vault should deserialize");

        let material = passkey_assertion_material_for_request(
            &vault,
            "matching-entry",
            Some("module-1"),
            "example.com",
            &["abc123".to_string()],
        )
        .expect("matching passkey material should exist");

        assert_eq!(material.entry_id, "matching-entry");
        assert_eq!(material.module_id.as_deref(), Some("module-1"));
        assert_eq!(material.relying_party_id, "example.com");
        assert_eq!(material.credential_id, "abc123");
        assert_eq!(material.user_handle.as_deref(), Some("dXNlcg"));
        assert_eq!(material.private_key, "private-key-material");
        assert_eq!(material.public_key.as_deref(), Some("public-key-material"));
        assert_eq!(material.algorithm.as_deref(), Some("ES256"));
        assert!(material.backup_eligible);
        assert!(!material.backup_state);
        assert_eq!(material.sign_count, 42);
    }

    #[test]
    fn unusable_allow_credentials_do_not_expand_to_all_passkeys() {
        let vault: VaultData = serde_json::from_value(json!({"values": [{
            "id": "entry", "title": "Example", "modules": [{
                "id": "passkey", "module": "PASSKEY", "relyingPartyId": "example.com",
                "credentialId": "Y3JlZA", "privateKey": "key"
            }]
        }]}))
        .unwrap();
        let allowed = vec![" ".to_string(), "==".to_string()];
        assert!(match_passkeys_for_request(&vault, "example.com", &allowed)
            .passkeys
            .is_empty());
        assert!(passkey_assertion_material_for_request(
            &vault,
            "entry",
            Some("passkey"),
            "example.com",
            &allowed
        )
        .is_none());
    }

    #[test]
    fn passkeys_require_exact_rp_ids_without_password_domain_heuristics() {
        let vault: VaultData = serde_json::from_value(json!({"values": [{
            "id": "entry", "title": "Example", "modules": [{
                "id": "passkey", "module": "PASSKEY", "relyingPartyId": "www.example.com",
                "credentialId": "Y3JlZA", "privateKey": "key"
            }]
        }]}))
        .unwrap();
        assert_eq!(
            match_passkeys_for_request(&vault, "WWW.EXAMPLE.COM.", &[])
                .passkeys
                .len(),
            1
        );
        for rp_id in [
            "example.com",
            "login.www.example.com",
            "https://www.example.com",
            "www.example.com:443",
            "www.example.com/path",
            "www..example.com",
        ] {
            assert!(
                match_passkeys_for_request(&vault, rp_id, &[])
                    .passkeys
                    .is_empty(),
                "{rp_id}"
            );
            assert!(
                passkey_assertion_material_for_request(
                    &vault,
                    "entry",
                    Some("passkey"),
                    rp_id,
                    &[]
                )
                .is_none(),
                "{rp_id}"
            );
        }
    }

    #[test]
    fn passkey_assertion_material_for_request_rejects_non_matching_or_incomplete_modules() {
        let vault: VaultData = serde_json::from_value(json!({
            "values": [
                {
                    "id": "entry",
                    "title": "Entry",
                    "modules": [
                        {
                            "id": "missing-private-key",
                            "module": "PASSKEY",
                            "relyingPartyId": "example.com",
                            "credentialId": "abc123"
                        },
                        {
                            "id": "complete",
                            "module": "PASSKEY",
                            "relyingPartyId": "example.com",
                            "credentialId": "def456",
                            "privateKey": "private-key-material"
                        }
                    ]
                }
            ]
        }))
        .expect("vault should deserialize");

        assert!(passkey_assertion_material_for_request(
            &vault,
            "entry",
            Some("missing-private-key"),
            "example.com",
            &[]
        )
        .is_none());
        assert!(passkey_assertion_material_for_request(
            &vault,
            "entry",
            Some("complete"),
            "example.com",
            &["abc123".to_string()]
        )
        .is_none());
        assert!(passkey_assertion_material_for_request(
            &vault,
            "entry",
            Some("complete"),
            "other.example.com",
            &["def456".to_string()]
        )
        .is_none());
    }
}
