/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'cross-fetch';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import type {
  Api,
  Challenge,
  IoOutput,
  State,
  EntityObjects,
  System,
} from '@amnis/state';
import {
  otpSlice,
  bearerSlice,
  agentSign,
  base64JsonEncode,
} from '@amnis/state';

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
    return;
  }

  /**
   * If the bearer token expired, attempt to fetch it again.
   */
  if (bearer.exp <= Date.now()) {
    const result = await fetch(`${apiAuth.baseUrl}/authenticate`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const json = await result.json() as IoOutput<EntityObjects>['json'];
    const bearersNew = json?.bearers ?? [];
    const bearerNew = bearersNew.find((b) => b.$id === bearerId);

    if (!bearerNew) {
      console.error('API could not renew the bearer token.');
      return;
    }

    store.dispatch({
      type: 'bearer/updateMany',
      payload: bearersNew,
    });

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
  body: Record<string, unknown> | string,
) => {
  const bodyEncoded = typeof body === 'string' ? body : JSON.stringify(body);
  const signature = await agentSign(bodyEncoded);
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
