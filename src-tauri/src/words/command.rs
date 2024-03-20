use crate::words::fs::{delete_list, get_list_names, read_list, write_list};

#[tauri::command]
pub async fn create_list_from_json(list: String, name: String) -> Result<usize, String> {
    let listed: Vec<(String, String)> = serde_json::from_str(&list).map_err(|e| {e.to_string()})?;
    write_list(listed, &name).await
}

#[tauri::command]
pub async fn create_list_from_csv(list: String, name: String) -> Result<usize, String> {
    let listed = crate::words::csv::parse_from_csv(&list)?;
    if listed.len() == 0 { 
        return Err("未找到任何数据".to_string());
    }
    write_list(listed, &name).await
}

#[tauri::command]
pub async fn fetch_list(name: String) -> String {
    serde_json::to_string(&read_list(&name).await).unwrap()
}

#[tauri::command]
pub async fn get_lists() -> String {
    serde_json::to_string(&get_list_names().await).unwrap()
}

#[tauri::command]
pub async fn remove_list(name: String) {
    delete_list(&name).await;
}
