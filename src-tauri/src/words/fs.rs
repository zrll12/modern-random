use std::fs;
use std::time::Duration;
use lazy_static::lazy_static;
use moka::future::Cache;

lazy_static!{
    static ref WORDS_CACHE: Cache<String, Vec<(String, String)>> = Cache::builder()
        .time_to_idle(Duration::from_secs(60 * 10)).build();
}

pub async fn write_list(list: &str, name: &str) -> usize {
    let listed: Vec<(String, String)> = serde_json::from_str(&list).unwrap();
    let len = listed.len();
    
    fs::create_dir_all("words").unwrap();
    fs::write("words/".to_string() + name, serde_json::to_string(&listed).unwrap()).unwrap();
    WORDS_CACHE.insert(name.to_string(), listed).await;
    
    len
}

pub async fn read_list(name: &str) -> Vec<(String, String)> {
    if WORDS_CACHE.contains_key(name) { 
        return WORDS_CACHE.get(name).await.unwrap();
    }
    
    match fs::read_to_string("words/".to_string() + name) {
        Ok(a) => { 
            WORDS_CACHE.insert(name.to_string(), serde_json::from_str(&a).unwrap()).await;
            serde_json::from_str(&a).unwrap()
        }
        Err(_) => { Vec::new() }
    }
}

pub async fn get_list_names() -> Vec<(String, u64)> {
    let mut names = Vec::new();
    for entry in fs::read_dir("words").unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        let metadata = fs::metadata(&path).unwrap();
        if path.is_file() {
            names.push((path.file_name().unwrap().to_str().unwrap().to_string(), metadata.len()));
        }
    }
    names
}