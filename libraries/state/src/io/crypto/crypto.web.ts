import type { Crypto } from './crypto.types.js';
import { randomString } from './random.js';
import { hashData } from './hash.js';
import { symGenerate, symEncrypt, symDecrypt } from './sym.js';
import {
  asymDecrypt, asymEncrypt,
  asymGenerate, asymSingleton,
  asymVerify, asymSign,
} from './asym.js';
import { passCompare, passHash } from './pass.js';
import { sessionEncrypt, sessionDecrypt } from './session.js';
import { accessEncode, accessVerify } from './access.js';
import { tokenDecode } from './token.js';
import {
  keyWrap, keyUnwrap, keyExport, keyImport,
} from './key.js';

export const cryptoWeb: Crypto = {
  randomString,
  hashData,
  symGenerate,
  symEncrypt,
  symDecrypt,
  asymGenerate,
  asymSingleton,
  asymEncrypt,
  asymDecrypt,
  asymSign,
  asymVerify,
  passHash,
  passCompare,
  sessionEncrypt,
  sessionDecrypt,
  accessEncode,
  accessVerify,
  tokenDecode,
  keyWrap,
  keyUnwrap,
  keyExport,
  keyImport,
};

export default cryptoWeb;
