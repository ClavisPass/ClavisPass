type LogLevel = "debug" | "info" | "warn" | "error";

const isDev =
  typeof __DEV__ !== "undefined"
    ? __DEV__
    : process.env.NODE_ENV === "development";

const log = (level: LogLevel, message: string, ...args: unknown[]) => {
  const prefix = `[${level.toUpperCase()}]`;

  switch (level) {
    case "debug":
      // Debug-Logs nur im Development anzeigen
      if (isDev) {
        console.debug(prefix, message, ...args);
      }
      return;

    case "info":
      console.info(prefix, message, ...args);
      return;

    case "warn":
      console.warn(prefix, message, ...args);
      return;

    case "error":
      console.error(prefix, message, ...args);
      return;
  }
};

export const logger = {
  debug: (msg: string, ...args: unknown[]) => log("debug", msg, ...args),
  info: (msg: string, ...args: unknown[]) => log("info", msg, ...args),
  warn: (msg: string, ...args: unknown[]) => log("warn", msg, ...args),
  error: (msg: string, ...args: unknown[]) => log("error", msg, ...args),
};
