use std::fs;
use lazy_static::lazy_static;

lazy_static!{
    static ref WORDS_CACHE:  = "config.json".to_string();
}

pub fn write_list(list: &str, name: &str) {
    fs::create_dir_all("words").unwrap();
    fs::write("words/".to_string() + name, list).unwrap();
}

pub fn read_list(name: &str) -> String {
    match fs::read_to_string("words/".to_string() + name) {
        Ok(a) => { a }
        Err(_) => { String::new() }
    }
}