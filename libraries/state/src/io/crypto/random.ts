import { base64Encode } from '../../core/base64.js';
import type { CryptoRandomString } from './crypto.types.js';
import { webcrypto } from './webcrypto.js';

/**
 * Generate a random verifier string.
 */
export const randomString: CryptoRandomString = async (length = 128) => {
  const wc = await webcrypto();
  const random = wc.getRandomValues(new Uint8Array(length));
  const data = base64Encode(random).slice(0, length);
  return data;
};

export default randomString;
