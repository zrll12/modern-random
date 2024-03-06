#![feature(fs_try_exists)]

mod config;
mod words;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
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
