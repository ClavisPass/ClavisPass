function identifyKeyType(key: string) {
  const patterns = {
    IBAN: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/i, // IBAN-Nummer (Internationale Bankkontonummer)
    "API-Key": /^[A-Za-z0-9_]{16,64}(?!-)(?![a-fA-F0-9]{32})$/, // API-Schlüssel ohne Bindestriche und nicht nur Hex
    JWT: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, // JSON Web Token
    "SSH-Key": /^ssh-(rsa|ed25519|dss) [A-Za-z0-9+\/=]+(\s.+)?$/, // SSH-Schlüssel
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, // UUID
    "License Key": /^[A-Z0-9]{4,5}-[A-Z0-9]{4,5}-[A-Z0-9]{4,5}-[A-Z0-9]{4,5}$/i, // Lizenzschlüssel für alphanumerische Gruppen
    Hexadecimal: /^[0-9a-fA-F]{64}$/, // 64-stelliger Hex-Schlüssel (256-Bit)
    Base64: /^[A-Za-z0-9+/=]{43,44}$/, // Base64-Schlüssel, z.B. für OAuth2
    Kreditkartennummer:
      /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/, // Kreditkartennummer (Visa, MasterCard, etc.)
    "Bcrypt-Hash": /^\$2[aby]\$.{56}$/, // Bcrypt-Hash
    "MD5-Hash": /^[a-f0-9]{32}$/i, // MD5-Hash
    "SHA-256-Hash": /^[A-Fa-f0-9]{64}$/, // SHA-256-Hash
    "Discount Code": /^[A-Z0-9]{4,6}$|^[A-Z0-9]{9}$/, // Rabattcode
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(key)) {
      return type;
    }
  }
  return "false"; // Wenn der Schlüssel keinem bekannten Typ entspricht
}

export default identifyKeyType;