use std::fs;
use crate::config;
use crate::config::model::{Config, NumberConfig, NumberSelectType};

pub async fn get_config() -> Config {
    let vec = match fs::read("config.json") {
        Ok(a) => { a }
        Err(_) => { Vec::new() }
    };
    let config = match serde_json::from_slice::<Config>(&vec) {
        Ok(a) => { a }
        Err(e) => {
            println!("{:?}", e);
            let config = Config {
                color: "auto".to_string(),
                number: NumberConfig {
                    min: 0,
                    max: 100,
                    select_type: NumberSelectType::Same,
                },
            };
            save_config(config.clone()).await;
            config
        }
    };

    config
}

pub async fn save_config(config: Config) {
    let config_str = serde_json::to_vec(&config).unwrap();

    fs::write("config.json", config_str).unwrap()
}