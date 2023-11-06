import type {
  IoContext,
  IoInput,
  Challenge,
  User,
  Entity,
  Profile,
  Contact,
  Session,
  System,
} from '@amnis/state';
import {
  accountsGet,
  cryptoWeb,
  dateNumeric,
  ioOutput,
  base64JsonEncode,
  accountsSign,
  systemSlice,
  ioInput,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import type { ApiAuthLogin } from '../../api.auth.types.js';
import { schemaAuth } from '../../schema/index.js';
import { processAuthChallenge } from './auth.challenge.js';
import { processAuthLogin } from './auth.login.js';

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
test('should start the login ritual by generating a challenge', async () => {
  const input: IoInput = ioInput({
    body: {},
  });

  const output = await processAuthChallenge(context)(input, ioOutput());

  expect(output.status).toBe(200);

  if (!output.json.result) {
    expect(output.json.result).toBeDefined();
    return;
  }

  const challenge = output.json.result as Challenge | undefined;

  expect(challenge).toBeDefined();
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should login as a admin', async () => {
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

  const input: IoInput<ApiAuthLogin> = ioInput({
    body: apiAuthLogin,
    query: {},
    challengeEncoded,
    signatureEncoded,
  });

  const output = await processAuthLogin(context)(input, ioOutput());

  expect(output.status).toBe(200);
  expect(output.cookies[system.sessionKey]).toBeDefined();
  expect(output.json.bearers).toBeDefined();
  expect(output.json.bearers?.[0]).toMatchObject({
    $id: expect.any(String),
    exp: expect.any(Number),
    access: expect.any(String),
  });

  const users = output.json.result?.user as Entity<User>[];
  const profiles = output.json.result?.profile as Entity<Profile>[];
  const contacts = output.json.result?.contact as Entity<Contact>[];
  const sessions = output.json.result?.session as Entity<Session>[];

  expect(users).toHaveLength(1);
  expect(users[0].handle).toBe(adminAccount.handle);
  expect(users[0].$credentials?.[0]).toBe(adminAccount.credential.$id);
  expect(users[0].$owner).toBe(users[0].$id);
  expect(users[0].committed).toBe(true);
  expect(users[0].new).toBe(false);

  expect(profiles).toHaveLength(1);
  expect(profiles[0].$user).toBe(users[0].$id);
  expect(profiles[0].$owner).toBe(users[0].$id);
  expect(profiles[0].committed).toBe(true);
  expect(profiles[0].new).toBe(false);

  expect(contacts).toHaveLength(1);
  expect(contacts[0].$id).toBe(profiles[0].$contact);
  expect(contacts[0].$owner).toBe(users[0].$id);
  expect(contacts[0].committed).toBe(true);
  expect(contacts[0].new).toBe(false);

  expect(sessions).toHaveLength(1);
  expect(sessions[0].$owner).toBe(users[0].$id);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should NOT login as an admin signed with a different private key', async () => {
  const { admin: adminAccount, user: userAccount } = await accountsGet();

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

  const signatureEncoded = await accountsSign(userAccount.privateKey, apiAuthLogin);

  const input: IoInput<ApiAuthLogin> = ioInput({
    body: apiAuthLogin,
    challengeEncoded,
    signatureEncoded,
  });

  const output = await processAuthLogin(context)(input, ioOutput());

  expect(output.status).toBe(401);
  expect(Object.keys(output.cookies)).toHaveLength(0);
  expect(output.json.bearers).toBeUndefined();
  expect(output.json.result).toBeUndefined();

  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0]).toMatchObject({
    level: 'error',
    title: 'Invalid Signature',
  });
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should NOT login as an admin with different challenge', async () => {
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

  const wrongChallenge: Challenge = {
    $id: challenge.$id,
    val: await cryptoWeb.randomString(32),
    exp: dateNumeric('30m'),
  };

  expect(challenge.$id).toEqual(wrongChallenge.$id);
  expect(challenge?.val).not.toEqual(wrongChallenge.val);

  const challengeEncoded = base64JsonEncode(wrongChallenge);

  const apiAuthLogin: ApiAuthLogin = {
    handle: adminAccount.handle,
    credential: adminAccount.credential,
    password: adminAccount.password,
  };

  const signatureEncoded = await accountsSign(adminAccount.privateKey, apiAuthLogin);

  const input: IoInput<ApiAuthLogin> = ioInput({
    body: apiAuthLogin,
    challengeEncoded,
    signatureEncoded,
  });

  const output = await processAuthLogin(context)(input, ioOutput());

  expect(output.status).toBe(500);
  expect(Object.keys(output.cookies)).toHaveLength(0);
  expect(output.json.bearers).toBeUndefined();
  expect(output.json.result).toBeUndefined();

  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0]).toMatchObject({
    level: 'error',
    title: 'Invalid Challenge',
  });
});
