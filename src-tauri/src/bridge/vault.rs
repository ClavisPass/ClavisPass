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

pub fn search_entries_by_domain(vault: &VaultData, domain: &str) -> Vec<SearchEntrySuggestion> {
    let target = normalize_domain(domain);
    if target.is_empty() {
        return Vec::new();
    }

    let mut matches = Vec::<(u8, SearchEntrySuggestion)>::new();

    for entry in &vault.values {
        let urls = url_hosts(entry);
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
                matched_host,
            },
        ));
    }

    matches.sort_by(|left, right| {
        right
            .0
            .cmp(&left.0)
            .then_with(|| right.1.fav.cmp(&left.1.fav))
            .then_with(|| left.1.title.to_lowercase().cmp(&right.1.title.to_lowercase()))
    });

    matches.into_iter().map(|(_, suggestion)| suggestion).collect()
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
        entry.modules
            .iter()
            .find(|module| module.module == "WIFI")
            .and_then(|module| module.value.as_ref())
            .and_then(value_as_string)
    })
}

fn value_as_string(value: &Value) -> Option<String> {
    match value {
        Value::String(content) if !content.is_empty() => Some(content.clone()),
        _ => None,
    }
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

    0
}
