/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'cross-fetch';
import type { BaseQueryApi } from '@amnis/state/rtk/query';
import type {
  Api,
  Challenge,
  IoOutput,
  State,
  EntityObjects,
  System,
  Agent,
  Bearer,
} from '@amnis/state';
import {
  otpSlice,
  bearerSlice,
  base64JsonEncode,
  localeSlice,
  systemSlice,
  agentLocalSign,
} from '@amnis/state';

let fetchingBearer = false;

/**
 * Gets a new bearer token.
 */
async function renewBearerToken(
  bearerId: string,
  state: State,
  store: BaseQueryApi,
  apiAuth: Api,
): Promise<Bearer | undefined> {
  /**
   * Prevent multiple requests for a bearer token.
   */
  if (fetchingBearer) {
    console.log('Waiting for bearer token to be fetched.');
    // Use an interval to wait for fetchingBearer to be false again.
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!fetchingBearer) {
          clearInterval(interval);
          resolve(undefined);
        }
      }, 500);
    });
    const bearerNew = bearerSlice.select.byId(state as any, bearerId);
    console.log('Done waiting. Bearer token has been fetched.', bearerNew);

    return bearerNew;
  }

  console.log('Fetching new bearer token.');

  fetchingBearer = true;

  const resultChallenge = await fetch(`${apiAuth.baseUrl}/challenge`, {
    method: 'POST',
    body: JSON.stringify({}),
  });

  if (resultChallenge?.status !== 200) {
    console.error('Failed to generate a challenge object for bearer renewal.');
    fetchingBearer = false;
    return undefined;
  }

  const jsonChallenge = await resultChallenge.json() as IoOutput<Challenge>['json'];
  const challenge = jsonChallenge.result;

  if (!challenge) {
    console.error('Failed to receive challenge object for bearer renewal.');
    fetchingBearer = false;
    return undefined;
  }

  const result = await fetch(`${apiAuth.baseUrl}/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Challenge: base64JsonEncode(challenge),
    },
    body: JSON.stringify({}),
  });
  const json = await result.json() as IoOutput<EntityObjects>['json'];
  const bearersNew = json?.bearers ?? [];
  const bearerNew = bearersNew.find((b) => b.$id === bearerId);

  if (!bearerNew) {
    console.error('API could not renew the bearer token.');
    fetchingBearer = false;
    return undefined;
  }

  store.dispatch(bearerSlice.action.insertMany(bearersNew));

  console.log('Bearer token has been fetched.');

  fetchingBearer = false;

  return bearerNew;
}

/**
 * Adds an authroization token to the header.
 */
export const headersAuthorizationToken = async (
  headers: Headers,
  store: BaseQueryApi,
  state: State,
  bearerId: string,
  system: System,
  apiAuth: Api,
): Promise<void> => {
  const bearer = bearerSlice.select.byId(state as any, bearerId);

  if (!bearer) {
    console.error('Bearer token not found.');
    return;
  }

  /**
   * If the bearer token expired, attempt to fetch it again.
   */
  if (bearer.exp <= Date.now()) {
    const bearerNew = await renewBearerToken(bearerId, state, store, apiAuth);
    if (!bearerNew) {
      console.error('Bearer token could not be renewed.');
      return;
    }

    headers.set('Authorization', `Bearer ${bearerNew.access}`);
    return;
  }

  headers.set('Authorization', `Bearer ${bearer.access}`);
};

/**
 * Signs the payload of the request and adds the encoded signature value to the header.
 */
export const headersSignature = async (
  headers: Headers,
  agent: Agent,
  body: Record<string, unknown> | string,
) => {
  const bodyEncoded = typeof body === 'string' ? body : JSON.stringify(body);
  const signature = await agentLocalSign(agent, bodyEncoded);
  headers.set('Signature', signature);
};

/**
 * Adds a challenge header if the challenge reference matches the reference.
 */
export const headersChallenge = async (
  headers: Headers,
  system: System,
  apiAuth: Api,
) => {
  const result = await fetch(`${apiAuth.baseUrl}/challenge`, {
    method: 'POST',
    body: JSON.stringify({}),
  });

  if (result?.status !== 200) {
    console.error('Failed to generate a challenge object.');
    return;
  }

  const json = await result.json() as IoOutput<Challenge>['json'];
  const challenge = json.result;

  if (!challenge) {
    console.error('Failed to receive challenge object.');
    return;
  }

  const challengeEncoded = base64JsonEncode(challenge);
  headers.set('Challenge', challengeEncoded);
};

/**
 * Adds the latest otp as a header if one exists.
 */
export const headersOtp = (
  headers: Headers,
  state: State,
) => {
  const otp = otpSlice.select.latest(state as any);

  if (!otp) {
    return;
  }

  const otpEncoded = base64JsonEncode(otp);
  headers.set('Otp', otpEncoded);
};

/**
 * Adds the language header.
 */
export const headersLanguage = (
  headers: Headers,
  state: State,
) => {
  const system = systemSlice.select.active(state as any);
  let localeLanguage = localeSlice.select.activeCode(state as any);

  if (system !== undefined && !system.languages.includes(localeLanguage)) {
    localeLanguage = system.languages?.[0] ?? 'en';
  }

  headers.set('Language', localeLanguage);
};
