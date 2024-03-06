use crate::words::fs::{read_list, write_list};

#[tauri::command]
pub fn create_list(list: String, name: String) -> usize {
    write_list(&list, &name);
    
    let listed: Vec<&str> = serde_json::from_str(&list).unwrap();
    listed.len()
}

#[tauri::command]
pub fn fetch_list(name: String) -> String {
    read_list(&name)
}