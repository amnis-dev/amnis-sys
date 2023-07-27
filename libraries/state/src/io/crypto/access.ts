/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JWTAccess } from '../../core/index.js';
import type { CryptoAccessEncode, CryptoAccessVerify } from './crypto.types.js';
import { tokenSign, tokenVerify } from './token.js';

/**
 * Encodes an Amnis-structured Bearer.
 */
export const accessEncode: CryptoAccessEncode = async (
  access: JWTAccess,
  privateKey,
) => {
  const jwtPrep = {
    ...access,
    /**
     * Token exp are required to have the expiration in seconds.
     */
    exp: Math.floor(access.exp / 1000), // Seconds Since the Epoch
  };

  const token = await tokenSign(jwtPrep, privateKey);

  return token;
};

/**
 * Verifies an amnis bearer.
 */
export const accessVerify: CryptoAccessVerify = async (
  encoded,
  publicKey,
) => {
  const verified = await tokenVerify(encoded, publicKey);

  if (!verified) {
    return undefined;
  }

  const jwtAccess: JWTAccess = {
    ...verified,
    /**
     * The token could have had the exp in seconds. Return it to MS.
     */
    exp: verified.exp * 1000,
  };

  return jwtAccess;
};
