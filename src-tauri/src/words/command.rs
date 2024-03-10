use crate::words::fs::{delete_list, get_list_names, read_list, write_list};

#[tauri::command]
pub async fn create_list_from_json(list: String, name: String) -> usize {
    let listed: Vec<(String, String)> = serde_json::from_str(&list).unwrap();
    write_list(listed, &name).await
}

#[tauri::command]
pub async fn create_list_from_csv(list: String, name: String) -> usize {
    let listed = crate::words::csv::parse_from_csv(&list);
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
