use crate::generate::CURRENT_LIST;

pub async fn load_list(name: &str) {
    let mut list = crate::words::fs::read_list(&name).await;
    fastrand::shuffle(&mut list);

    let mut current_list = CURRENT_LIST.lock().unwrap();
    current_list.clear();
    current_list.extend(list.clone());
}
