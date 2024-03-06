#![feature(fs_try_exists)]

mod config;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![
          config::command::set_config,
          config::command::get_config
      ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
