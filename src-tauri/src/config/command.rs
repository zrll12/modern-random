use crate::BASE_DIR;
use crate::config::CONFIG;
use crate::config::fs::save_config;
use crate::config::model::Config;

#[tauri::command]
pub async fn set_config(config: String) -> Result<(), String> {
    let new_config: Config = serde_json::from_slice(&config.as_bytes()).map_err(|_| {"无法格式化配置文件"})?;

    save_config(new_config.clone()).await?;

    let mut config = CONFIG.lock().unwrap();
    config.number = new_config.number.clone();

    drop(config);
    Ok(())
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

#[tauri::command]
pub fn get_scale() -> f32 {
    let config = &CONFIG.lock().unwrap();
    config.scale
}

#[tauri::command]
pub fn get_base_dir() -> String {
    return BASE_DIR.to_str().unwrap().to_string();
}