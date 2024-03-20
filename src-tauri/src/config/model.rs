use serde::{Deserialize, Serialize};
use serde_inline_default::serde_inline_default;

#[serde_inline_default]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Config {
    #[serde_inline_default(String::from("auto"))]
    pub color: String,
    #[serde_inline_default(1.0)]
    pub scale: f32,
    #[serde(default = "generate_number_config")]
    pub number: NumberConfig,
}

#[serde_inline_default]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NumberConfig {
    #[serde_inline_default(0)]
    pub min: u8,
    #[serde_inline_default(100)]
    pub max: u8,
    #[serde_inline_default(NumberSelectType::Same)]
    pub select_type: NumberSelectType,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum NumberSelectType {
    None,
    One,
    Same,
}

pub fn generate_number_config() -> NumberConfig {
    NumberConfig {
        min: 0,
        max: 100,
        select_type: NumberSelectType::Same,
    }
}
