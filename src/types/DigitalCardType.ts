export const DIGITAL_CARD_TYPES = [
  "QR-Code",
  "CODE39",
  "CODE128",
  "CODE128A",
  "CODE128B",
  "CODE128C",
  "EAN13",
  "EAN8",
  "EAN5",
  "EAN2",
  "UPC",
  "UPCE",
  "ITF14",
  "ITF",
  "MSI",
  "MSI10",
  "MSI11",
  "MSI1010",
  "MSI1110",
  "pharmacode",
  "codabar",
] as const;

type DigitalCardType = (typeof DIGITAL_CARD_TYPES)[number];

export default DigitalCardType;