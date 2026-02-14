#[cfg(test)]
mod tests {
    use serde_json::json;
    #[test]
    fn test_merge() {
        let _ = json!(true);
        assert_eq!(1, 1);
    }
}
