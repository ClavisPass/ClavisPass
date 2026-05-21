(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

if (typeof (globalThis as any).__DEV__ === "undefined") {
  (globalThis as any).__DEV__ = false;
}
