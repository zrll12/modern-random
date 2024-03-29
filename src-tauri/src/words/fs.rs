use std::fs;
use std::time::Duration;

use lazy_static::lazy_static;
use moka::future::Cache;

use crate::WORDS_DIR;

lazy_static! {
    static ref WORDS_CACHE: Cache<String, Vec<(String, String)>> = Cache::builder()
        .time_to_idle(Duration::from_secs(60 * 10))
        .build();
}

pub async fn write_list(listed: Vec<(String, String)>, name: &str) -> Result<usize, String> {
    let len = listed.len();
    let checked: Vec<(String, String)> = listed
        .into_iter()
        .filter(|(a, b)| a.len() > 0 && b.len() > 0)
        .collect();

    fs::write(
        WORDS_DIR.clone().join(name),
        serde_json::to_string(&checked).unwrap(),
    ).map_err(|e| {e.to_string()})?;
    WORDS_CACHE.insert(name.to_string(), checked).await;

    Ok(len)
}

pub async fn read_list(name: &str) -> Vec<(String, String)> {
    if WORDS_CACHE.contains_key(name) {
        return WORDS_CACHE.get(name).await.unwrap();
    }

    match fs::read_to_string(WORDS_DIR.clone().join(name)) {
        Ok(a) => {
            WORDS_CACHE
                .insert(name.to_string(), serde_json::from_str(&a).unwrap())
                .await;
            serde_json::from_str(&a).unwrap()
        }
        Err(_) => Vec::new(),
    }
}

pub async fn get_list_names() -> Vec<(String, u64)> {
    let mut names = Vec::new();
    for entry in fs::read_dir(WORDS_DIR.clone()).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        let metadata = fs::metadata(&path).unwrap();
        if path.is_file() {
            names.push((
                path.file_name().unwrap().to_str().unwrap().to_string(),
                metadata.len(),
            ));
        }
    }
    names
}

pub async fn delete_list(name: &str) {
    fs::remove_file(WORDS_DIR.clone().join(name)).unwrap();
    WORDS_CACHE.remove(name).await;
}
