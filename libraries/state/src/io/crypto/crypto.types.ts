/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */

import type { JWTAccess } from '../../core/index.js';
import type { Session } from '../../data/index.js';

/**
 * An RSA assymetric key pair type.
 */
export type CryptoAsymKeyPair = {
  privateKey: CryptoKey,
  publicKey: CryptoKey
};

/**
 * Random String method.
 */
export type CryptoRandomString = (length?: number) => Promise<string>;

/**
 * Hashes a string with SHA256.
 */
export type CryptoHashData = (data: string) => Promise<string>;

/**
 * Generates a new symmetric encyption key.
 */
export type CryptoSymGenerate = () => Promise<CryptoKey>;

/**
 * Encrypts with Symmetric AES encrypted text.
 */
export type CryptoSymEncrypt = (
  data: string,
  key?: CryptoKey
) => Promise<string>;

/**
 * Decrypts a Symmetric AES encrypted string.
 */
export type CryptoSymDecrypt = (
  encryption: string,
  key?: CryptoKey
) => Promise<string | undefined>;

/**
 * Generates an Asymmetric RSA encrypted key pair for encryption.
 */
export type CryptoAsymGenerate = (type: 'encryptor' | 'signer') => Promise<CryptoAsymKeyPair>;

/**
 * Encrypts with an Asymmetric RSA encrypted public key.
 */
export type CryptoAsymEncrypt = (
  data: string,
  publicKey?: CryptoKey
) => Promise<ArrayBuffer>;

/**
 * Decrypts with an Asymmetric RSA encrypted private key.
 */
export type CryptoAsymDecrypt = (
  encryption: ArrayBuffer,
  privateKey?: CryptoKey
) => Promise<string | undefined>;

/**
 * Signs with an Asymmetric RSA encrypted private key.
 */
export type CryptoAsymSign = (
  data: string,
  privateKey?: CryptoKey
) => Promise<ArrayBuffer>;

/**
 * Verifies with an Asymmetric RSA encrypted public key.
 */
export type CryptoAsymVerify = (
  data: string,
  signature: ArrayBuffer,
  publicKey?: CryptoKey
) => Promise<boolean>;

/**
 * Hashes a plaintext password.
 */
export type CryptoPassHash = (plaintext: string) => Promise<string>;

/**
 * Compares a plaintext password and a hashed password.
 * Returns true if the passwords match.
 */
export type CryptoPassCompare = (plaintext: string, hashtext: string) => Promise<boolean>;

/**
 * Encodes a session instance.
 */
export type CryptoSessionEncrypt = (
  session: Session,
  key?: CryptoKey
) => Promise<string>;

/**
 * Verifies an encoded session.
 */
export type CryptoSessionDecrypt = (
  encryption: string,
  key?: CryptoKey
) => Promise<Session | undefined>;

/**
 * Encodes a bearer instance.
 */
export type CryptoAccessEncode = (
  access: JWTAccess,
  privateKey?: CryptoKey
) => Promise<string>;

/**
 * Verifies an encoded session.
 */
export type CryptoAccessVerify = (
  encoded: string,
  publicKey?: CryptoKey
) => Promise<JWTAccess | undefined>;

/**
 * Encodes a JSON value.
 */
export type CryptoTokenEncode = (
  json: any,
  privateKey?: CryptoKey
) => Promise<string>;

/**
 * Verifies an encoded value.
 */
export type CryptoTokenVerify = <T = any>(
  encoded: string,
  publicKey?: CryptoKey
) => Promise<T | undefined>;

/**
 * Decodes an encoded value without verifying.
 */
export type CryptoTokenDecode = <T = Record<string, unknown>>(
  encoded: string
) => Promise<[payload: T, raw: string, signature: ArrayBuffer] | []>;

/**
 * Wraps a CryptoKey
 */
export type CryptoKeyWrap = (
  key: CryptoKey,
  password: string,
  type?: 0 | 1 | 2,
) => Promise<string>;

/**
 * Unwraps a CryptoKey
 */
export type CryptoKeyUnwrap = (
  wrap: string,
  password: string,
) => Promise<CryptoKey | undefined>;

/**
 * Exports a CryptoKey
 */
export type CryptoKeyExport = (
  key: CryptoKey,
  type?: 0 | 1 | 2,
) => Promise<string>;

/**
  * Imports a CryptoKey
  */
export type CryptoKeyImport = (
  exported: string
) => Promise<CryptoKey | undefined>;

/**
 * Core interface for cryptographic methods.
 */
export interface Crypto {
  /**
   * Generates a random string.
   */
  randomString: CryptoRandomString;

  /**
   * Hashes a plain string using SHA256.
   */
  hashData: CryptoHashData;

  /**
   * Generates a new AES key for encryption.
   */
  symGenerate: CryptoSymGenerate;

  /**
   * Generates a new AES Encryption.
   */
  symEncrypt: CryptoSymEncrypt;

  /**
   * Gets a singleton AES encrypted key pair.
   */
  symDecrypt: CryptoSymDecrypt;

  /**
   * Generates a new RSA encryption keypair.
   */
  asymGenerate: CryptoAsymGenerate;

  /**
   * Gets a singleton RSA encrypted key pair.
   */
  asymSingleton: CryptoAsymGenerate;

  /**
   * Encrypts data using a public key.
   */
  asymEncrypt: CryptoAsymEncrypt;

  /**
   * Decrypts data using a private key.
   */
  asymDecrypt: CryptoAsymDecrypt;

  /**
   * Signs data using a private key.
   */
  asymSign: CryptoAsymSign;

  /**
   * Verifies data using a private key.
   */
  asymVerify: CryptoAsymVerify;

  /**
   * Hashes a password.
   */
  passHash: CryptoPassHash;

  /**
   * Compares a plain password to a hashed password.
   */
  passCompare: CryptoPassCompare;

  /**
   * Encodes a session object.
   */
  sessionEncrypt: CryptoSessionEncrypt;

  /**
   * Verifies a session encoding.
   */
  sessionDecrypt: CryptoSessionDecrypt;

  /**
   * Encodes an access token object.
   */
  accessEncode: CryptoAccessEncode;

  /**
   * Verifies an access encoding.
   */
  accessVerify: CryptoAccessVerify;

  /**
   * Decodes any type of token.
   */
  tokenDecode: CryptoTokenDecode;

  /**
   * Wraps a cryptographic key.
   */
  keyWrap: CryptoKeyWrap;

  /**
   * Unwraps a cryptographic key.
   */
  keyUnwrap: CryptoKeyUnwrap;

  /**
   * Exports a cryptographic key.
   */
  keyExport: CryptoKeyExport;

  /**
   * Imports a cryptographic key.
   */
  keyImport: CryptoKeyImport;
}
