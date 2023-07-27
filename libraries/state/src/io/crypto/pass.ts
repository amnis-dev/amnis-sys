import { base64Decode, base64Encode } from '../../core/base64.js';
import type { CryptoPassCompare, CryptoPassHash } from './crypto.types.js';
import { webcrypto } from './webcrypto.js';

const saltLength = 16;

const passEncrypt = async (password: string, salt: Uint8Array) => {
  const wc = await webcrypto();
  const passEncoded = new TextEncoder().encode(password);
  const passKey = await wc.subtle.importKey(
    'raw',
    passEncoded,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey'],
  );

  const derivedBits = await wc.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 1e6,
      hash: 'SHA-256',
    },
    passKey,
    256,
  );

  const derived = new Uint8Array(derivedBits);
  const combined = new Uint8Array(salt.length + derived.length);
  combined.set(salt);
  combined.set(derived, salt.length);
  const base64 = base64Encode(combined);

  return base64;
};

export const passHash: CryptoPassHash = async (plaintext) => {
  const wc = await webcrypto();
  const salt = wc.getRandomValues(new Uint8Array(saltLength));
  const passEncrypted = await passEncrypt(plaintext, salt);
  return passEncrypted;
};

export const passCompare: CryptoPassCompare = async (plaintext, hashtext) => {
  const uint8 = base64Decode(hashtext);
  const salt = uint8.slice(0, saltLength);
  const currentPassHash = await passEncrypt(plaintext, salt);
  return hashtext === currentPassHash;
};
