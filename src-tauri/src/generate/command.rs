use crate::config::model::NumberSelectType;
use crate::generate::generate::{generate_none, generate_one, generate_only, generate_same};

#[tauri::command]
pub async fn generate(name: Option<String>, num_generates: u64, max_number: u64, min_number: u64, generate_mode: NumberSelectType) -> String {
    if name.is_none() { 
        return serde_json::to_string(&generate_only(num_generates, min_number, max_number).await).unwrap() // Vec<u64>
    }
    let name = name.unwrap();
    
    return match generate_mode {
        NumberSelectType::None => { serde_json::to_string(&generate_none(num_generates, &name).await).unwrap() } // Vec<(u64, String, String)>
        NumberSelectType::One => { serde_json::to_string(&generate_one(num_generates, min_number, max_number, &name).await).unwrap() } // Vec<(u64, String, String)>
        NumberSelectType::Same => { serde_json::to_string(&generate_same(num_generates, min_number, max_number, &name).await).unwrap() } // Vec<(u64, String, String)>
    };
}