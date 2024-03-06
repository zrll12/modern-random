use std::sync::Mutex;
use futures::executor::block_on;
use lazy_static::lazy_static;
use crate::config::fs::get_config;
use crate::config::model::Config;

mod model;
mod fs;
pub mod command;

lazy_static!{
    static ref CONFIG: Mutex<Config> = Mutex::new(block_on(get_config()));
}