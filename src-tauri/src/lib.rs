#![feature(fs_try_exists)]

use std::fs;
use std::path::PathBuf;
use lazy_static::lazy_static;
use tauri_plugin_os::platform;

mod config;
mod words;

lazy_static!{
    static ref BASE_DIR: PathBuf = get_base_dir();
    static ref WORDS_DIR: PathBuf = BASE_DIR.join("words");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    fs::create_dir_all(BASE_DIR.clone()).unwrap();
    fs::create_dir_all(WORDS_DIR.clone()).unwrap();

    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .invoke_handler(tauri::generate_handler![
            config::command::set_config,
            config::command::get_config,
            config::command::get_color,
            words::command::create_list,
            words::command::fetch_list,
            words::command::get_lists,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn get_base_dir() -> PathBuf {
    let platform = platform();

    let mut path = PathBuf::new();

    match platform {
        "windows" => {
            path.push(std::env::var("APPDATA").unwrap());
            path.push("words");
        },
        "macos" => {
            path.push(std::env::var("HOME").unwrap());
            path.push("Library");
            path.push("Application Support");
            path.push("words");
        },
        "linux" => {
            path.push(std::env::var("HOME").unwrap());
            path.push(".config");
            path.push("words");
        },
        _ => {
            path.push(std::env::var("HOME").unwrap());
            path.push("words");
        }
    }

    path
}
