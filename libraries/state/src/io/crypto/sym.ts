import { base64Decode, base64Encode } from '../../core/base64.js';
import type {
  CryptoSymDecrypt,
  CryptoSymEncrypt,
  CryptoSymGenerate,
} from './crypto.types.js';
import { webcrypto } from './webcrypto.js';

export const symGenerate: CryptoSymGenerate = async () => {
  const wc = await webcrypto();
  const key = await wc.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );
  return key;
};

let symKey: CryptoKey | undefined;
const symSingleton = async (): Promise<CryptoKey> => {
  if (!symKey) {
    symKey = await symGenerate();
  }
  return symKey;
};

export const symEncrypt: CryptoSymEncrypt = async (data, key) => {
  const wc = await webcrypto();
  const iv = wc.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);

  const cipherKey = key || (await symSingleton());

  const cipher = await wc.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    cipherKey,
    encoded,
  );

  const cipherUint8 = new Uint8Array(cipher);
  const encryption = new Uint8Array(iv.length + cipherUint8.length);
  encryption.set(iv);
  encryption.set(cipherUint8, iv.length);

  const encryptionB64 = base64Encode(encryption);

  return encryptionB64;
};

export const symDecrypt: CryptoSymDecrypt = async (encryption, key) => {
  const wc = await webcrypto();
  const cipherKey = key || (await symSingleton());

  const encryptionUint8 = base64Decode(encryption);
  const iv = encryptionUint8.slice(0, 12);
  const cipher = encryptionUint8.slice(12);

  try {
    const decrypted = await wc.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      cipherKey,
      cipher.buffer,
    );

    const data = new TextDecoder().decode(decrypted);

    return data;
  } catch (error) {
    return undefined;
  }
};
