export type HotkeyAction = "toggleMainWindow" | "lockVault" | "newEntry";

export type HotkeySettings = Record<HotkeyAction, string | null>;

export const DEFAULT_HOTKEYS: HotkeySettings = {
  toggleMainWindow: "Alt+W",
  lockVault: "Alt+L",
  newEntry: "Alt+N",
};

const ACTIONS: HotkeyAction[] = ["toggleMainWindow", "lockVault", "newEntry"];
const MODIFIER_ORDER = ["Ctrl", "Alt", "Shift"] as const;
const BLOCKED_HOTKEYS = new Set([
  "Alt+F4",
  "Ctrl+C",
  "Ctrl+V",
  "Ctrl+X",
  "Ctrl+A",
  "Ctrl+S",
  "Ctrl+P",
  "Ctrl+R",
  "Ctrl+F",
  "Ctrl+L",
]);

function normalizeKey(key: string): string | null {
  if (/^[a-z]$/i.test(key)) return key.toUpperCase();
  if (/^[0-9]$/.test(key)) return key;
  if (/^F([1-9]|1[0-2])$/i.test(key)) return key.toUpperCase();

  const aliases: Record<string, string> = {
    " ": "Space",
    Spacebar: "Space",
    ArrowUp: "Up",
    ArrowDown: "Down",
    ArrowLeft: "Left",
    ArrowRight: "Right",
    Escape: "Esc",
    Delete: "Delete",
    Backspace: "Backspace",
    Enter: "Enter",
    Tab: "Tab",
    Home: "Home",
    End: "End",
    PageUp: "PageUp",
    PageDown: "PageDown",
  };

  return aliases[key] ?? null;
}

export function normalizeHotkey(input: unknown): string | null {
  if (input === null) return null;
  if (typeof input !== "string") return null;

  const parts = input
    .split("+")
    .map((part) => part.trim())
    .filter(Boolean);

  const modifiers = new Set<string>();
  let key: string | null = null;

  parts.forEach((part) => {
    const lower = part.toLowerCase();
    if (lower === "control" || lower === "ctrl") modifiers.add("Ctrl");
    else if (lower === "option" || lower === "alt") modifiers.add("Alt");
    else if (lower === "shift") modifiers.add("Shift");
    else key = normalizeKey(part);
  });

  if (!key || modifiers.size === 0) return null;

  const normalized = [
    ...MODIFIER_ORDER.filter((modifier) => modifiers.has(modifier)),
    key,
  ].join("+");

  return isAllowedHotkey(normalized) ? normalized : null;
}

export function isAllowedHotkey(hotkey: string): boolean {
  if (BLOCKED_HOTKEYS.has(hotkey)) return false;

  const parts = hotkey.split("+");
  const key = parts.at(-1);
  const modifiers = parts.slice(0, -1);

  if (!key || modifiers.length === 0) return false;
  if (!modifiers.some((modifier) => modifier === "Ctrl" || modifier === "Alt")) {
    return false;
  }
  if (["Ctrl", "Alt", "Shift"].includes(key)) return false;
  if (["Esc", "Delete", "Backspace", "Tab"].includes(key)) return false;

  return true;
}

export function normalizeHotkeySettings(input: unknown): HotkeySettings | null {
  if (!input || typeof input !== "object") return null;

  const source = input as Partial<Record<HotkeyAction, unknown>>;
  const next: HotkeySettings = { ...DEFAULT_HOTKEYS };
  const seen = new Set<string>();

  for (const action of ACTIONS) {
    const raw = source[action];
    const normalized =
      raw === undefined ? DEFAULT_HOTKEYS[action] : normalizeHotkey(raw);
    next[action] = normalized;

    if (normalized) {
      if (seen.has(normalized)) return null;
      seen.add(normalized);
    }
  }

  return next;
}

export function hotkeyFromKeyboardEvent(event: KeyboardEvent): string | null {
  const key = normalizeKey(event.key);
  if (!key) return null;

  const modifiers = [
    event.ctrlKey ? "Ctrl" : null,
    event.altKey ? "Alt" : null,
    event.shiftKey ? "Shift" : null,
  ].filter(Boolean) as string[];

  const hotkey = [...modifiers, key].join("+");
  return normalizeHotkey(hotkey);
}

export function getHotkeyConflict(
  hotkeys: HotkeySettings,
  action: HotkeyAction,
  hotkey: string,
): HotkeyAction | null {
  return (
    ACTIONS.find(
      (candidate) => candidate !== action && hotkeys[candidate] === hotkey,
    ) ?? null
  );
}

export function getHotkeyActions(): HotkeyAction[] {
  return [...ACTIONS];
}
