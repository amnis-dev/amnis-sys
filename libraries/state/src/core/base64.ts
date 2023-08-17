/* eslint-disable @typescript-eslint/no-explicit-any */
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Converts a Uint8Array Buffer to a Base64 String.
 */
export const base64Encode = (u8: Uint8Array, unpad = false): string => {
  if (typeof window === 'undefined') {
    const value = Buffer.from(u8).toString('base64');
    const replaced = value.replaceAll('+', '-').replaceAll('/', '_');
    if (unpad) {
      return replaced.replaceAll('=', '');
    }
    return replaced;
  }

  const binString = Array.from(u8, (x) => String.fromCodePoint(x)).join('');
  const value = window.btoa(binString);
  const replaced = value.replaceAll('+', '-').replaceAll('/', '_');
  if (unpad) {
    return replaced.replaceAll('=', '');
  }
  return replaced;
};

/**
 * Converts a Base64 String to a Uint8Array buffer.
 */
export const base64Decode = (str: string): Uint8Array => {
  if (typeof window === 'undefined') {
    const replaced = str.replaceAll('-', '+').replaceAll('_', '/');
    const value = Buffer.from(replaced, 'base64');
    return new Uint8Array(value);
  }

  const replaced = str.replaceAll('-', '+').replaceAll('_', '/');
  const binString = window.atob(replaced);
  return Uint8Array.from(binString, (m) => m.codePointAt(0)!);
};

/**
 * Encodes a JSON object.
 */
export const base64JsonEncode = (json: Record<string, any>): string => {
  const encoded = base64Encode(textEncoder.encode(JSON.stringify(json)));
  return encoded;
};

/**
 * Decodes a JSON object.
 */
export const base64JsonDecode = <T = any>(encoded: string): T | undefined => {
  try {
    const json = JSON.parse(textDecoder.decode(base64Decode(encoded)));
    return json as T | undefined;
  } catch (e) {
    console.error('Error when decoding json data.');
    return undefined;
  }
};
