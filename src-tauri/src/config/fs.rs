use crate::config::model::{Config, NumberConfig, NumberSelectType};
use std::fs;
use crate::BASE_DIR;

pub async fn get_config() -> Config {
    let vec = fs::read(BASE_DIR.join("config.json")).unwrap_or_else(|_| Vec::new());
    let config = match serde_json::from_slice::<Config>(&vec) {
        Ok(a) => a,
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

    fs::write(BASE_DIR.join("config.json"), config_str).unwrap()
}
