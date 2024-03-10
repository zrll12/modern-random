use serde::Deserialize;
#[derive(Deserialize)]
struct Record {
    word: String,
    explanation: String,
}

pub fn parse_from_csv(file: &str) -> Vec<(String, String)> {
    let mut reader = csv::Reader::from_reader(file.as_bytes());
    let mut records = Vec::new();

    for record in reader.deserialize() {
        let record: Record = record.unwrap();
        records.push((record.word, record.explanation));
    }
    
    records
}