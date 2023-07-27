import { base64Encode } from '../../core/base64.js';
import type { CryptoHashData } from './crypto.types.js';
import { webcrypto } from './webcrypto.js';

/**
 * Hash data with SHA-256.
 */
export const hashData: CryptoHashData = async (data) => {
  const wc = await webcrypto();
  const encoded = new TextEncoder().encode(data);
  const hash = await wc.subtle.digest('SHA-256', encoded);
  const hashUint8 = new Uint8Array(hash);
  const hashB64 = base64Encode(hashUint8, true);
  return hashB64;
};

export default hashData;
