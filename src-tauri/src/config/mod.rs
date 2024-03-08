use crate::config::fs::get_config;
use crate::config::model::Config;
use futures::executor::block_on;
use lazy_static::lazy_static;
use std::sync::Mutex;

pub mod command;
mod fs;
pub mod model;

lazy_static! {
    static ref CONFIG: Mutex<Config> = Mutex::new(block_on(get_config()));
}
