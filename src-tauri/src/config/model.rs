use serde::{Deserialize, Serialize};
use serde_inline_default::serde_inline_default;

#[serde_inline_default]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Config {
    #[serde_inline_default(String::from("auto"))]
    pub color: String,
    #[serde(default="generate_number_config")]
    pub number: NumberConfig,
    #[serde_inline_default(Vec::new())]
    pub words: Vec<WordsConfig>,
}

#[serde_inline_default]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NumberConfig {
    #[serde_inline_default(0)]
    pub min: u8,
    #[serde_inline_default(100)]
    pub max: u8,
    #[serde_inline_default(NumberSelectType::Same)]
    pub select_type: NumberSelectType
}

#[serde_inline_default]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct WordsConfig {
    #[serde_inline_default(String::from(""))]
    pub name: String,
    #[serde_inline_default(0)]
    pub size: u8,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum NumberSelectType {
    None,
    One,
    Same
}

pub fn generate_number_config() -> NumberConfig {
    NumberConfig {
        min: 0,
        max: 100,
        select_type: NumberSelectType::Same
    }
}