import { dateNumeric } from '../../core/index.js';
import type { Session } from '../../data/index.js';
import type { CryptoSessionDecrypt, CryptoSessionEncrypt } from './crypto.types.js';
import { symDecrypt, symEncrypt } from './sym.js';

/**
 * Encode a session.
 */
export const sessionEncrypt: CryptoSessionEncrypt = async (
  session,
  key,
) => {
  const sessionPrep = {
    ...session,
    exp: Math.floor(session.exp / 1000),
  };
  const encrypted = await symEncrypt(JSON.stringify(sessionPrep), key);

  return encrypted;
};

/**
 * Decode a session.
 */
export const sessionDecrypt: CryptoSessionDecrypt = async (
  encryption,
  key,
) => {
  try {
    const decypted = await symDecrypt(encryption, key);
    if (!decypted) {
      return undefined;
    }

    const json = JSON.parse(decypted);

    const session = {
      ...json,
      exp: json.exp * 1000,
    } as Session;

    /**
     * Ensure the session didn't expire.
     */
    const now = dateNumeric();
    if (session.exp <= now) {
      return undefined;
    }

    return session;
  } catch (error) {
    return undefined;
  }
};
