import type { Credential } from './data/index.js';
import {
  cryptoWeb,
} from './io/crypto/index.js';
import { localStorage } from './localstorage.js';
import type { UID } from './core/index.js';
import {
  uid,
  base64Encode,
  base64JsonDecode,
  base64JsonEncode,
} from './core/index.js';

export interface Agent {
  name: string;
  publicKey: string;
  privateKey: string;
  credentialId: UID<Credential>;
}

let agent: Agent | undefined;

/**
 * Get the browser and operating system name the user agent string.
 */
export function agentName() {
  if (typeof navigator !== 'undefined') {
    const { userAgent } = navigator;
    const name = userAgent
      .replace(/[\d_./]+/gm, '')
      .match(/\(.*?;/m)?.[0].slice(1, -1)
      .trim() ?? 'Unknown Device';
    if (userAgent.includes('Chrome')) { return `${name} (Chrome)`; }
    if (userAgent.includes('Firefox')) { return `${name} (Firefox)`; }
    if (userAgent.includes('Edg')) { return `${name} (Edge)`; }
    if (userAgent.includes('Opera')) { return `${name} (Opera)`; }
    if (userAgent.includes('Safari')) { return `${name} (Safari)`; }
    return name;
  }
  const name = process.platform ?? 'Unknown Platform';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Gets the agent's fingerprint.
 */
export function agentFingerprint() {
  if (typeof navigator !== 'undefined') {
    const { maxTouchPoints, hardwareConcurrency } = navigator;
    // const print = generateCanvasFingerprint(
    const print = `${agentName()}${maxTouchPoints}${hardwareConcurrency}`;
    // );
    return print;
  }

  const { title, platform } = process;
  const str = title + platform;
  const codes = str.split('').map(
    (c) => (
      c.charCodeAt(0) % 89
    ) + 33,
  );
  const print = base64Encode(new Uint8Array(codes));
  return print;
}

/**
 * Create new agent keys.
 */
export const agentCreate = async (): Promise<Agent> => {
  /**
   * Get the agent name.
   */
  const name = agentName();
  /**
   * Create a new keys
   */
  const asymKeys = await cryptoWeb.asymGenerate('signer');
  /**
   * Export the public key
   */
  const publicKey = await cryptoWeb.keyExport(asymKeys.publicKey);
  /**
   * Wrap the private key.
   */
  const privateKey = await cryptoWeb.keyWrap(
    asymKeys.privateKey,
    await cryptoWeb.hashData(agentFingerprint()),
  );
  /**
   * Create credentialId.
   */
  const credentialId = uid('credential');

  /**
   * Create the new agent.
   */
  agent = {
    name,
    publicKey,
    privateKey,
    credentialId,
  };

  /**
   * Encode the agent.
   */
  const encoded = base64JsonEncode(agent);

  localStorage().setItem('agent', encoded);

  return agent;
};

/**
 * Gets the agent singleton.
 */
export const agentGet = async (): Promise<Agent> => {
  if (!agent) {
    const encoded = localStorage().getItem('agent');
    if (encoded) {
      try {
        const decoded = base64JsonDecode<Agent>(encoded);
        agent = decoded;
      } catch (e) {
        agent = await agentCreate();
      }
    }
    if (!agent) {
      agent = await agentCreate();
    }
  }

  return agent;
};

/**
 * Gets the agent's encoded credential.
 */
export const agentCredential = async (): Promise<Credential> => {
  const agentCurrent = await agentGet();
  const credential: Credential = {
    $id: uid('credential'),
    name: agentCurrent.name,
    publicKey: agentCurrent.publicKey,
  };
  credential.$id = agentCurrent.credentialId;

  return credential;
};

/**
 * Signs data with the agent keys.
 */
export const agentSign = async (data: string): Promise<string> => {
  const agentCurrent = await agentGet();
  const privateKey = await cryptoWeb.keyUnwrap(
    agentCurrent.privateKey,
    await cryptoWeb.hashData(agentFingerprint()),
  );

  const signature = await cryptoWeb.asymSign(
    data,
    privateKey,
  );

  const signatureEncoded = base64Encode(new Uint8Array(signature));
  return signatureEncoded;
};

/**
 * Update attributes of the existing agent.
 */
export const agentUpdate = async (agentProps: Partial<Agent>) => {
  const agentCurrent = await agentGet();

  agent = {
    ...agentCurrent,
    ...agentProps,
  };
};
