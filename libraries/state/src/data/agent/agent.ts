import { base64Encode } from '../../core/index.js';
import { cryptoWeb } from '../../io/crypto/index.js';
import type { Agent, AgentCreator } from './agent.types.js';

/**
 * Generates a name for a local browser agent.
 */
export function agentLocalDeviceName() {
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
  const name = process.platform ?? 'Unknown Device';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Generates a fingerprint to wrap the agent private key.
 * Currently, this fingerprinting is very simple.
 */
export function agentLocalFingerprint() {
  if (typeof navigator !== 'undefined') {
    const { maxTouchPoints, hardwareConcurrency } = navigator;
    const print = `${agentLocalDeviceName()}${maxTouchPoints}${hardwareConcurrency}`;
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
 * Generate a new agent to be added.
 */
export const agentLocalGenerate = async (name: string): Promise<AgentCreator> => {
  /**
   * Get the agent name.
   */
  const device = agentLocalDeviceName();
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
    await cryptoWeb.hashData(agentLocalFingerprint()),
  );

  /**
   * Create the new agent.
   */
  return {
    name,
    device,
    type: 'local',
    publicKey,
    privateKey,
  };
};

/**
 * Signs data with a local agent.
 */
export const agentLocalSign = async (agent: Agent, data: string): Promise<string> => {
  const { privateKey } = agent;
  if (!privateKey) {
    return '';
  }

  const privateKeyUnwrapped = await cryptoWeb.keyUnwrap(
    privateKey,
    await cryptoWeb.hashData(agentLocalFingerprint()),
  );

  const signature = await cryptoWeb.asymSign(
    data,
    privateKeyUnwrapped,
  );

  const signatureEncoded = base64Encode(new Uint8Array(signature));
  return signatureEncoded;
};
