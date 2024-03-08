use crate::generate::{CURRENT_LIST, CURRENT_NUMBER, CURRENT_NUMBER_LIST};
use crate::generate::load::load_list;

pub async fn generate(num: u64, max: u64, name: &str) -> Vec<(u64, String, String)> {
    let mut current_list = CURRENT_LIST.lock().unwrap();
    let mut current_number = CURRENT_NUMBER.lock().unwrap();
    let mut current_number_list = CURRENT_NUMBER_LIST.lock().unwrap();
    let mut res_list = Vec::new();

    if *current_number != max {
        let mut new_list: Vec<u64> = (0..max).collect();
        fastrand::shuffle(&mut new_list);

        *current_number = max;
        current_number_list.clear();
        current_number_list.extend(new_list);
    }

    for _ in 0..num {
        if current_list.is_empty() {
            load_list(name).await;
        }

        if current_number_list.is_empty() {
            let mut new_list: Vec<u64> = (0..max).collect();
            fastrand::shuffle(&mut new_list);

            current_number_list.clear();
            current_number_list.extend(new_list);
        }

        let number = current_number_list.pop().unwrap();
        let list = current_list.pop().unwrap();

        res_list.push((number, list.0, list.1));
    }

    res_list
}