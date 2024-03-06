use std::fs;
use crate::config;
use crate::config::model::{Config, NumberConfig, NumberSelectType};

pub async fn get_config() -> Config {
    let vec = match fs::read("config.bson") {
        Ok(a) => { a }
        Err(_) => { Vec::new() }
    };
    let config = bson::from_slice(&vec).unwrap();

    println!("{}", serde_json::to_string(&config).unwrap());

    config
}

pub async fn save_config(config: Config) {
    let config_str = bson::to_vec(&config).unwrap();

    fs::write("config.bson", config_str).unwrap()
}