import type {
  Challenge,
  IoContext,
  IoInput,
  System,
} from '@amnis/state';
import {
  sessionSlice,
  accountsGet,
  accountsSign,
  base64JsonEncode,
  ioOutput,
  systemSlice,
  ioInput,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import type { ApiAuthLogin, ApiAuthLogout } from '../../api.auth.types.js';
import { schemaAuth } from '../../schema/index.js';
import { processAuthChallenge } from './auth.challenge.js';
import { processAuthLogin } from './auth.login.js';
import { processAuthLogout } from './auth.logout.js';

let context: IoContext;
let system: System;

beforeAll(async () => {
  context = await contextSetup({
    schemas: [schemaAuth],
  });

  system = systemSlice.select.active(context.store.getState()) as System;
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should login and then logout as administrator', async () => {
  const { admin: adminAccount } = await accountsGet();

  const inputStart: IoInput = ioInput({
    body: {},
  });
  const outputStart = await processAuthChallenge(context)(inputStart, ioOutput());
  const challenge = outputStart.json.result as Challenge | undefined;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  const challengeEncoded = base64JsonEncode(challenge);

  const apiAuthLogin: ApiAuthLogin = {
    handle: adminAccount.handle,
    credential: adminAccount.credential,
    password: adminAccount.password,
  };

  const signatureEncoded = await accountsSign(adminAccount.privateKey, apiAuthLogin);

  const inputLogin: IoInput<ApiAuthLogin> = ioInput({
    body: apiAuthLogin,
    query: {},
    challengeEncoded,
    signatureEncoded,
  });

  const outputLogin = await processAuthLogin(context)(inputLogin, ioOutput());

  expect(outputLogin.status).toBe(200);
  expect(outputLogin.cookies[system.sessionKey]).toBeDefined();

  const inputLogout: IoInput<ApiAuthLogout> = ioInput({
    body: {},
    query: {},
    sessionEncrypted: outputLogin.cookies[system.sessionKey],
  });

  const outputLogout = await processAuthLogout(context)(inputLogout, ioOutput());

  expect(outputLogout.status).toBe(200);
  expect(Object.keys(outputLogout.json.result || {})).toHaveLength(1);
  expect(outputLogout.json.result?.[sessionSlice.key]).toBeDefined();
  expect(outputLogout.json.result?.[sessionSlice.key]).toHaveLength(1);
  expect(outputLogout.json.result?.[sessionSlice.key][0]).toEqual(expect.any(String));
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should not logout without an existing session', async () => {
  const inputLogout: IoInput<ApiAuthLogout> = ioInput({
    body: {},
    query: {},
  });

  const outputLogout = await processAuthLogout(context)(inputLogout, ioOutput());

  expect(outputLogout.status).toBe(401);
});
