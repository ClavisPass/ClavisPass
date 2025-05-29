use keytar::{delete_password, get_password, set_password};

#[tauri::command]
pub fn save_key(key: &str, value: &str) {
    let service = "ClavisPass";
    set_password(service, key, value).unwrap();
}

#[tauri::command]
pub fn get_key(key: &str) -> Option<String> {
    let service = "ClavisPass";
    match get_password(service, key) {
        Ok(password) => Some(password.password),
        Err(e) => {
            eprintln!("Fehler beim Abrufen des Passworts: {:?}", e);
            None
        }
    }
}

#[tauri::command]
pub fn remove_key(key: &str) {
    let service = "ClavisPass";
    match get_password(service, key) {
        Ok(_) => {
            if let Err(e) = delete_password(service, key) {
                eprintln!("Fehler beim Entfernen des Schlüssels: {:?}", e);
            } else {
                println!("Schlüssel erfolgreich entfernt");
            }
        }
        Err(e) => eprintln!("Schlüssel nicht gefunden: {:?}", e),
    }
}
