export const utf8ToBytes = (s: string): Uint8Array => new TextEncoder().encode(s);
export const bytesToUtf8 = (b: Uint8Array): string => new TextDecoder().decode(b);
