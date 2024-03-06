use serde::Serialize;
use tauri::ipc::IpcResponse;
use crate::config::CONFIG;
use crate::config::fs::save_config;
use crate::config::model::{Config, NumberConfig};

#[tauri::command]
pub async fn set_config(config: String) {
    println!("{}", config);
    let new_config: Config = serde_json::from_slice(&config.as_bytes()).unwrap();

    save_config(Config {
        color: "auto".to_string(),
        number: new_config.number.clone(),
        words: new_config.words.clone(),
    }).await;

    let mut config = CONFIG.lock().unwrap();
    config.number = new_config.number.clone();
    config.words = new_config.words.clone();

    drop(config);
}

#[tauri::command]
pub async fn get_config() -> String {
    let config = &CONFIG.lock().unwrap();
    serde_json::to_string(&**config).unwrap()
}