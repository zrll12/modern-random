use std::sync::Mutex;
use lazy_static::lazy_static;

mod load;
mod generate;
pub(crate) mod command;

lazy_static!{
    static ref CURRENT_LIST: Mutex<Vec<(String, String)>> = Mutex::new(Vec::new());
    static ref CURRENT_NUMBER: Mutex<(u64, u64)> = Mutex::new((0, 0));
    static ref CURRENT_NUMBER_LIST: Mutex<Vec<u64>> = Mutex::new(Vec::new());
}
