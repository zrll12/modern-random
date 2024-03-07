use crate::config::fs::save_config;
use crate::config::model::Config;
use crate::config::CONFIG;

#[tauri::command]
pub async fn set_config(config: String) {
    let new_config: Config = serde_json::from_slice(&config.as_bytes()).unwrap();

    save_config(new_config.clone()).await;

    let mut config = CONFIG.lock().unwrap();
    config.number = new_config.number.clone();

    drop(config);
}

#[tauri::command]
pub async fn get_config() -> String {
    let config = &CONFIG.lock().unwrap();
    serde_json::to_string(&**config).unwrap()
}

#[tauri::command]
pub fn get_color() -> String {
    let config = &CONFIG.lock().unwrap();
    config.color.clone()
}
