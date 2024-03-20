use std::fs;

use crate::BASE_DIR;
use crate::config::model::{Config, NumberConfig, NumberSelectType};

pub async fn get_config() -> Config {
    let vec = fs::read(BASE_DIR.join("config.json")).unwrap_or_else(|_| Vec::new());
    let config = match serde_json::from_slice::<Config>(&vec) {
        Ok(a) => a,
        Err(e) => {
            println!("{:?}", e);
            let config = Config {
                color: "auto".to_string(),
                scale: 1.0,
                number: NumberConfig {
                    min: 0,
                    max: 100,
                    select_type: NumberSelectType::Same,
                },
            };
            save_config(config.clone()).await.unwrap();
            config
        }
    };

    config
}

pub async fn save_config(config: Config) -> Result<(), String>{
    let config_str = serde_json::to_vec(&config).unwrap();

    fs::write(BASE_DIR.join("config.json"), config_str).map_err(|e| format!("无法写入文件: {e}"))?;
    
    Ok(())
}
