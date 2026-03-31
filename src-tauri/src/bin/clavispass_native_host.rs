fn main() {
    if let Err(error) = app_lib::bridge::host::run_native_host() {
        eprintln!("clavispass_native_host failed: {error}");
        std::process::exit(1);
    }
}
