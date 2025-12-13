const isTauri = () => {
  return typeof window !== "undefined" && !!(window as any).__TAURI_IPC__;
};

export default isTauri;
