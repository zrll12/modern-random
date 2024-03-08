use crate::words::fs::{delete_list, get_list_names, read_list, write_list};

#[tauri::command]
pub async fn create_list(list: String, name: String) -> usize {
    write_list(&list, &name).await
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
