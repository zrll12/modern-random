use crate::words::fs::{get_list_names, read_list, write_list};

#[tauri::command]
pub async fn create_list(list: String, name: String) -> usize {
    println!("{name:?}, {list:?}");
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