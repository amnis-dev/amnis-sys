/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  agentCredential, agentFingerprint, agentGet, agentName,
} from './agent.js';
import type { Credential } from './data/index.js';
import { credentialSlice } from './data/entity/credential/index.js';
import { cryptoWeb } from './io/crypto/index.js';
import { base64Encode } from './core/index.js';
import { localStorage } from './localstorage.js';

export interface Account {
  handle: string;
  credential: Credential;
  password: string;
  privateKey: string;
}

let admin: Account = JSON.parse(localStorage().getItem('accounts-admin') || '{}');
let exec: Account = JSON.parse(localStorage().getItem('accounts-exec') || '{}');
let user: Account = JSON.parse(localStorage().getItem('accounts-user') || '{}');

export const accountsSign = async (
  privateKeyWrapped: string,
  data: Record<string, any>,
): Promise<string> => {
  const privateKey = await cryptoWeb.keyUnwrap(
    privateKeyWrapped,
    await cryptoWeb.hashData(agentFingerprint()),
  );
  if (!privateKey) {
    expect(privateKey).toBeDefined();
  }

  const signature = await cryptoWeb.asymSign(JSON.stringify(data), privateKey);
  return base64Encode(new Uint8Array(signature));
};

export const accountsGenerateCrypto = async () => {
  const keys = await cryptoWeb.asymGenerate('signer');
  const publicKey = await cryptoWeb.keyExport(keys.publicKey);
  const privateKey = await cryptoWeb.keyWrap(
    keys.privateKey,
    await cryptoWeb.hashData(agentFingerprint()),
  );
  const credential = credentialSlice.create({
    name: agentName(),
    publicKey,
  });
  return { credential, privateKey };
};

export const accountsGet = async () => {
  /**
   * Administrator
   */
  if (Object.keys(admin).length === 0) {
    const { credential, privateKey } = await accountsGenerateCrypto();
    admin = {
      handle: 'admin',
      password: 'passwd12',
      credential,
      privateKey,
    };
    localStorage().setItem('accounts-admin', JSON.stringify(admin));
  }

  /**
   * Executive
   */
  if (Object.keys(exec).length === 0) {
    const { credential, privateKey } = await accountsGenerateCrypto();
    exec = {
      handle: 'exec',
      password: 'passwd12',
      credential,
      privateKey,
    };
    localStorage().setItem('accounts-exec', JSON.stringify(exec));
  }

  /**
   * User
   */
  if (Object.keys(user).length === 0) {
    const agent = await agentGet();

    user = {
      handle: 'user',
      credential: await agentCredential(),
      password: 'passwd12',
      privateKey: agent.privateKey,
    };
    localStorage().setItem('accounts-user', JSON.stringify(user));
  }

  return { admin, exec, user };
};

export default accountsGet;
