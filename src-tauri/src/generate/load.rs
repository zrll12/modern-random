pub async fn load_list(name: &str) -> Vec<(String, String)> {
    let mut list = crate::words::fs::read_list(&name).await;
    fastrand::shuffle(&mut list);

    list
}
