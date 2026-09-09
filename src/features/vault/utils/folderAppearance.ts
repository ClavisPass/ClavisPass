import FolderType from "../model/FolderType";

export const DEFAULT_FOLDER_ICON = "folder-outline";

export const FOLDER_COLOR_OPTIONS = [
  "#E57373",
  "#F06292",
  "#BA68C8",
  "#7986CB",
  "#4FC3F7",
  "#4DB6AC",
  "#81C784",
  "#FFD54F",
  "#FFB74D",
  "#A1887F",
];

export const FOLDER_ICON_OPTIONS = Array.from(
  new Set([
    DEFAULT_FOLDER_ICON,
    "account-outline",
    "account-group-outline",
    "briefcase-outline",
    "bank-outline",
    "shopping-outline",
    "home-outline",
    "heart-pulse",
    "school-outline",
    "car-outline",
    "airplane",
    "gamepad-variant-outline",
    "music-note-outline",
    "camera-outline",
    "server-network-outline",
    "cloud-outline",
    "wifi",
    "cellphone",
    "email-outline",
    "web",
    "key-variant",
    "form-textbox-password",
    "two-factor-authentication",
    "credit-card-outline",
    "note-outline",
    "file-document-outline",
    "calendar-outline",
    "list-status",
    "checkbox-outline",
    "phone-outline",
    "dialpad",
    "card-text-outline",
    "code-tags",
    "tools",
    "gift-outline",
    "map-marker-outline",
    "wallet-outline",
  ]),
);

export function getFolderIcon(folder: FolderType | null | undefined) {
  return folder?.icon || DEFAULT_FOLDER_ICON;
}

export function getFolderColor(folder: FolderType | null | undefined) {
  return folder?.color || null;
}

export function getNextFolderIcon(current: string | undefined) {
  const currentIcon = current || DEFAULT_FOLDER_ICON;
  const currentIndex = FOLDER_ICON_OPTIONS.indexOf(currentIcon);
  const nextIndex =
    currentIndex === -1 ? 0 : (currentIndex + 1) % FOLDER_ICON_OPTIONS.length;
  const nextIcon = FOLDER_ICON_OPTIONS[nextIndex];
  return nextIcon === DEFAULT_FOLDER_ICON ? undefined : nextIcon;
}

export function getNextFolderColor(current: string | undefined) {
  if (!current) return FOLDER_COLOR_OPTIONS[0];
  const currentIndex = FOLDER_COLOR_OPTIONS.indexOf(current);
  if (currentIndex === -1) return undefined;
  const nextIndex = currentIndex + 1;
  return nextIndex >= FOLDER_COLOR_OPTIONS.length
    ? undefined
    : FOLDER_COLOR_OPTIONS[nextIndex];
}
