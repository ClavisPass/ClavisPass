use serde::{Deserialize, Serialize};
use std::{
    fs,
    io,
    time::{SystemTime, UNIX_EPOCH},
};

use super::{path::pairing_store_path, protocol::BridgeClientInfo};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum PairingStatus {
    Unpaired,
    Pending,
    Paired,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PendingPairing {
    pub extension_id: String,
    #[serde(default)]
    pub client_name: Option<String>,
    #[serde(default)]
    pub client_version: Option<String>,
    #[serde(default)]
    pub client_instance_id: Option<String>,
    pub requested_at_ms: u64,
    pub last_seen_at_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PairedClient {
    pub extension_id: String,
    #[serde(default)]
    pub client_name: Option<String>,
    #[serde(default)]
    pub client_version: Option<String>,
    #[serde(default)]
    pub client_instance_id: Option<String>,
    pub granted_at_ms: u64,
    pub last_seen_at_ms: u64,
    #[serde(default)]
    pub capabilities: Vec<String>,
    #[serde(default)]
    pub shared_secret_id: Option<String>,
    #[serde(default)]
    pub public_key_fingerprint: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RejectedClient {
    pub extension_id: String,
    #[serde(default)]
    pub client_name: Option<String>,
    #[serde(default)]
    pub client_version: Option<String>,
    #[serde(default)]
    pub client_instance_id: Option<String>,
    pub rejected_at_ms: u64,
    pub last_seen_at_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PairingStore {
    pub version: u32,
    #[serde(default)]
    pub pending: Vec<PendingPairing>,
    #[serde(default)]
    pub paired: Vec<PairedClient>,
    #[serde(default)]
    pub rejected: Vec<RejectedClient>,
}

impl Default for PairingStore {
    fn default() -> Self {
        Self {
            version: 1,
            pending: Vec::new(),
            paired: Vec::new(),
            rejected: Vec::new(),
        }
    }
}

pub fn load_pairing_store() -> io::Result<PairingStore> {
    let path = pairing_store_path()?;
    if !path.exists() {
        return Ok(PairingStore::default());
    }

    let content = fs::read_to_string(path)?;
    let parsed = serde_json::from_str::<PairingStore>(&content)
        .map_err(|err| io::Error::new(io::ErrorKind::InvalidData, err))?;
    Ok(parsed)
}

pub fn save_pairing_store(store: &PairingStore) -> io::Result<()> {
    let path = pairing_store_path()?;
    let json = serde_json::to_string_pretty(store)
        .map_err(|err| io::Error::new(io::ErrorKind::Other, err))?;
    fs::write(path, json)?;
    Ok(())
}

pub fn evaluate_pairing(client: &BridgeClientInfo) -> io::Result<PairingStatus> {
    let mut store = load_pairing_store()?;
    let now = now_ms();

    if let Some(peer) = store
        .paired
        .iter_mut()
        .find(|peer| same_client_identity(peer.extension_id.as_str(), peer.client_instance_id.as_deref(), client))
    {
        peer.last_seen_at_ms = now;
        if peer.client_name.is_none() {
            peer.client_name = client.name.clone();
        }
        if peer.client_version.is_none() {
            peer.client_version = client.version.clone();
        }
        if peer.client_instance_id.is_none() {
            peer.client_instance_id = client.instance_id.clone();
        }
        save_pairing_store(&store)?;
        return Ok(PairingStatus::Paired);
    }

    if let Some(rejected) = store
        .rejected
        .iter_mut()
        .find(|rejected| {
            same_client_identity(
                rejected.extension_id.as_str(),
                rejected.client_instance_id.as_deref(),
                client,
            )
        })
    {
        rejected.last_seen_at_ms = now;
        if rejected.client_name.is_none() {
            rejected.client_name = client.name.clone();
        }
        if rejected.client_version.is_none() {
            rejected.client_version = client.version.clone();
        }
        if rejected.client_instance_id.is_none() {
            rejected.client_instance_id = client.instance_id.clone();
        }
        save_pairing_store(&store)?;
        return Ok(PairingStatus::Unpaired);
    }

    if let Some(pending) = store
        .pending
        .iter_mut()
        .find(|pending| {
            same_client_identity(
                pending.extension_id.as_str(),
                pending.client_instance_id.as_deref(),
                client,
            )
        })
    {
        pending.last_seen_at_ms = now;
        if pending.client_name.is_none() {
            pending.client_name = client.name.clone();
        }
        if pending.client_version.is_none() {
            pending.client_version = client.version.clone();
        }
        if pending.client_instance_id.is_none() {
            pending.client_instance_id = client.instance_id.clone();
        }
        save_pairing_store(&store)?;
        return Ok(PairingStatus::Pending);
    }

    store.rejected.retain(|rejected| {
        !same_client_identity(
            rejected.extension_id.as_str(),
            rejected.client_instance_id.as_deref(),
            client,
        )
    });

    store.pending.push(PendingPairing {
        extension_id: client.extension_id.clone(),
        client_name: client.name.clone(),
        client_version: client.version.clone(),
        client_instance_id: client.instance_id.clone(),
        requested_at_ms: now,
        last_seen_at_ms: now,
    });
    save_pairing_store(&store)?;

    Ok(PairingStatus::Pending)
}

pub fn approve_pairing(
    extension_id: &str,
    client_instance_id: Option<&str>,
) -> io::Result<Option<PairedClient>> {
    let mut store = load_pairing_store()?;
    let Some(index) = store
        .pending
        .iter()
        .position(|pending| {
            pending.extension_id == extension_id
                && optional_identity_matches(pending.client_instance_id.as_deref(), client_instance_id)
        })
    else {
        return Ok(None);
    };

    let pending = store.pending.remove(index);
    let now = now_ms();
    let paired = PairedClient {
        extension_id: pending.extension_id,
        client_name: pending.client_name,
        client_version: pending.client_version,
        client_instance_id: pending.client_instance_id,
        granted_at_ms: now,
        last_seen_at_ms: now,
        capabilities: vec![
            "getStatus".to_string(),
            "searchEntriesByDomain".to_string(),
            "getFillDataForEntry".to_string(),
        ],
        shared_secret_id: None,
        public_key_fingerprint: None,
    };

    store
        .paired
        .retain(|peer| {
            !same_identity_values(
                peer.extension_id.as_str(),
                peer.client_instance_id.as_deref(),
                paired.extension_id.as_str(),
                paired.client_instance_id.as_deref(),
            )
        });
    store.rejected.retain(|peer| {
        !same_identity_values(
            peer.extension_id.as_str(),
            peer.client_instance_id.as_deref(),
            paired.extension_id.as_str(),
            paired.client_instance_id.as_deref(),
        )
    });
    store.paired.push(paired.clone());
    save_pairing_store(&store)?;
    Ok(Some(paired))
}

pub fn reject_pairing(
    extension_id: &str,
    client_instance_id: Option<&str>,
) -> io::Result<Option<RejectedClient>> {
    let mut store = load_pairing_store()?;
    let Some(index) = store
        .pending
        .iter()
        .position(|pending| {
            pending.extension_id == extension_id
                && optional_identity_matches(pending.client_instance_id.as_deref(), client_instance_id)
        })
    else {
        return Ok(None);
    };

    let pending = store.pending.remove(index);
    let now = now_ms();
    let rejected = RejectedClient {
        extension_id: pending.extension_id,
        client_name: pending.client_name,
        client_version: pending.client_version,
        client_instance_id: pending.client_instance_id,
        rejected_at_ms: now,
        last_seen_at_ms: now,
    };

    store.rejected.retain(|peer| {
        !same_identity_values(
            peer.extension_id.as_str(),
            peer.client_instance_id.as_deref(),
            rejected.extension_id.as_str(),
            rejected.client_instance_id.as_deref(),
        )
    });
    store.rejected.push(rejected.clone());
    save_pairing_store(&store)?;
    Ok(Some(rejected))
}

pub fn revoke_pairing(extension_id: &str, client_instance_id: Option<&str>) -> io::Result<bool> {
    let mut store = load_pairing_store()?;
    let paired_before = store.paired.len();
    let pending_before = store.pending.len();
    let rejected_before = store.rejected.len();

    store.paired.retain(|peer| {
        !(peer.extension_id == extension_id
            && optional_identity_matches(peer.client_instance_id.as_deref(), client_instance_id))
    });
    store.pending.retain(|peer| {
        !(peer.extension_id == extension_id
            && optional_identity_matches(peer.client_instance_id.as_deref(), client_instance_id))
    });
    store.rejected.retain(|peer| {
        !(peer.extension_id == extension_id
            && optional_identity_matches(peer.client_instance_id.as_deref(), client_instance_id))
    });

    let changed = paired_before != store.paired.len()
        || pending_before != store.pending.len()
        || rejected_before != store.rejected.len();
    if changed {
        save_pairing_store(&store)?;
    }

    Ok(changed)
}

pub fn list_pending_pairings() -> io::Result<Vec<PendingPairing>> {
    Ok(load_pairing_store()?.pending)
}

pub fn list_paired_clients() -> io::Result<Vec<PairedClient>> {
    Ok(load_pairing_store()?.paired)
}

pub fn list_rejected_clients() -> io::Result<Vec<RejectedClient>> {
    Ok(load_pairing_store()?.rejected)
}

fn same_client_identity(
    stored_extension_id: &str,
    stored_instance_id: Option<&str>,
    client: &BridgeClientInfo,
) -> bool {
    same_identity_values(
        stored_extension_id,
        stored_instance_id,
        client.extension_id.as_str(),
        client.instance_id.as_deref(),
    )
}

fn same_identity_values(
    left_extension_id: &str,
    left_instance_id: Option<&str>,
    right_extension_id: &str,
    right_instance_id: Option<&str>,
) -> bool {
    left_extension_id == right_extension_id
        && optional_identity_matches(left_instance_id, right_instance_id)
}

fn optional_identity_matches(left: Option<&str>, right: Option<&str>) -> bool {
    match (left, right) {
        (Some(left), Some(right)) => left == right,
        _ => true,
    }
}

fn now_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as u64
}
