const isTauri = () => {
  try {
    return typeof window !== "undefined" && Boolean(require("@tauri-apps/api"));
  } catch {
    return false;
  }
};

export default isTauri;
