import type {
  IoContext,
  Entity,
  User,
  System,
  IoInput,
  Profile,
  Contact,
  Session,
} from '@amnis/state';
import {
  systemSlice,
  userSlice,
  databaseMemoryStorage,
  ioOutput,
  cryptoWeb,
  accountsGet,
  base64Encode,
  agentFingerprint,
  challengeCreate,
  dateNumeric,
  agentSign,
  base64JsonEncode,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import type { ApiAuthAuthenticate, ApiAuthChallenge } from '../../api.auth.types.js';
import { schemaAuth } from '../../schema/index.js';
import { generateSession } from '../../utility/generate.js';
import { processAuthAuthenticate } from './auth.authenticate.js';
import { processAuthChallenge } from './auth.challenge.js';

let context: IoContext;
let system: Entity<System>;
let storageUsers: Entity<User>[];

beforeAll(async () => {
  context = await contextSetup({
    schemas: [schemaAuth],
  });
  system = systemSlice.select.active(context.store.getState()) as Entity<System>;
  const storage = databaseMemoryStorage();
  storageUsers = Object.values(storage[userSlice.key]) as Entity<User>[];
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should create an admin session and authenticate using the admin keys', async () => {
  /**
   * Get the admin account information.
   */
  const { admin } = await accountsGet();
  const adminUser = storageUsers.find((u) => u.handle === admin.handle) as Entity<User>;

  /**
   * Generate the session.
   */
  const session = await generateSession(system, adminUser.$id, admin.credential.$id);
  const sessionEncrypted = await cryptoWeb.sessionEncrypt(session);

  /**
   * Create a challenge.
   */
  const inputChallenge: IoInput<ApiAuthChallenge> = {
    body: {},
    query: {},
  };
  const outputChallenge = await processAuthChallenge(context)(inputChallenge, ioOutput());
  const challenge = outputChallenge.json.result;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }
  const challengeEncoded = base64JsonEncode(challenge);

  /**
   * Sign the encoded challenge.
   */
  const privateKey = await cryptoWeb.keyUnwrap(
    admin.privateKey,
    await cryptoWeb.hashData(agentFingerprint()),
  );
  if (!privateKey) {
    expect(privateKey).toBeDefined();
    return;
  }

  /**
   * Now that everything is prepared, start authenticating.
   */
  const inputAuthenticate: IoInput<ApiAuthAuthenticate> = {
    body: {},
    query: {},
    sessionEncrypted,
    challengeEncoded,
  };

  /**
   * Sign the input body and attach it.
   */
  const signature = await cryptoWeb.asymSign(
    JSON.stringify(inputAuthenticate.body),
    privateKey,
  );
  const signatureEncoded = base64Encode(new Uint8Array(signature));
  inputAuthenticate.signatureEncoded = signatureEncoded;

  const output = await processAuthAuthenticate(context)(inputAuthenticate, ioOutput());

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
  expect(users[0].handle).toBe(admin.handle);
  expect(users[0].$credentials?.[0]).toBe(admin.credential.$id);
  expect(users[0].$owner).toBe(users[0].$id);

  expect(profiles).toHaveLength(1);
  expect(profiles[0].$user).toBe(users[0].$id);
  expect(profiles[0].$owner).toBe(users[0].$id);

  expect(contacts).toHaveLength(1);
  expect(contacts[0].$id).toBe(profiles[0].$contact);
  expect(contacts[0].$owner).toBe(users[0].$id);

  expect(sessions).toHaveLength(1);
  expect(sessions[0].$owner).toBe(users[0].$id);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should create a user session and authenticate using the user keys', async () => {
  /**
   * Get the admin account information.
   */
  const { user } = await accountsGet();
  const userUser = storageUsers.find((u) => u.handle === user.handle) as Entity<User>;

  /**
   * Generate the session.
   */
  const session = await generateSession(system, userUser.$id, user.credential.$id);
  const sessionEncrypted = await cryptoWeb.sessionEncrypt(session);

  /**
   * Create a challenge.
   */
  const inputChallenge: IoInput<ApiAuthChallenge> = {
    body: {},
    query: {},
  };
  const outputChallenge = await processAuthChallenge(context)(inputChallenge, ioOutput());
  const challenge = outputChallenge.json.result;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  const challengeEncoded = base64JsonEncode(challenge);

  /**
   * Now that everything is prepared, start authenticating.
   */
  const inputAuthenticate: IoInput<ApiAuthAuthenticate> = {
    body: {},
    query: {},
    sessionEncrypted,
    challengeEncoded,
  };

  /**
   * Sign the input body and attach it.
   */
  const signatureEncoded = await agentSign(
    JSON.stringify(inputAuthenticate.body),
  );
  inputAuthenticate.signatureEncoded = signatureEncoded;

  const output = await processAuthAuthenticate(context)(inputAuthenticate, ioOutput());

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
  expect(users[0].handle).toBe(user.handle);
  expect(users[0].$credentials?.[0]).toBe(user.credential.$id);
  expect(users[0].$owner).toBe(users[0].$id);

  expect(profiles).toHaveLength(1);
  expect(profiles[0].$user).toBe(users[0].$id);
  expect(profiles[0].$owner).toBe(users[0].$id);

  expect(contacts).toHaveLength(1);
  expect(contacts[0].$id).toBe(profiles[0].$contact);
  expect(contacts[0].$owner).toBe(users[0].$id);

  expect(sessions).toHaveLength(1);
  expect(sessions[0].$owner).toBe(users[0].$id);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should create an admin session and fail authentication with an incorrect challenge', async () => {
  /**
   * Get the admin account information.
   */
  const { admin } = await accountsGet();
  const adminUser = storageUsers.find((u) => u.handle === admin.handle) as Entity<User>;

  /**
   * Generate the session.
   */
  const session = await generateSession(system, adminUser.$id, admin.credential.$id);
  const sessionEncrypted = await cryptoWeb.sessionEncrypt(session);

  /**
   * Create a challenge.
   */
  const challenge = challengeCreate({
    val: await cryptoWeb.randomString(32),
    exp: dateNumeric('30m'),
  });
  const challengeEncoded = base64JsonEncode(challenge);

  /**
   * Sign the encoded challenge.
   */
  const privateKey = await cryptoWeb.keyUnwrap(
    admin.privateKey,
    await cryptoWeb.hashData(agentFingerprint()),
  );
  if (!privateKey) {
    expect(privateKey).toBeDefined();
    return;
  }

  /**
   * Now that everything is prepared, start authenticating.
   */
  const inputAuthenticate: IoInput<ApiAuthAuthenticate> = {
    body: {},
    query: {},
    sessionEncrypted,
    challengeEncoded,
  };

  /**
   * Sign the input body and attach it.
   */
  const signature = await cryptoWeb.asymSign(
    JSON.stringify(inputAuthenticate.body),
    privateKey,
  );
  const signatureEncoded = base64Encode(new Uint8Array(signature));
  inputAuthenticate.signatureEncoded = signatureEncoded;

  const output = await processAuthAuthenticate(context)(inputAuthenticate, ioOutput());

  expect(output.status).toBe(500);
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0]).toMatchObject({
    level: 'error',
    title: 'Invalid Challenge',
  });
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should create an admin session and fail authentication with an incorrect signature', async () => {
  /**
   * Get the admin account information.
   */
  const { admin, exec } = await accountsGet();
  const adminUser = storageUsers.find((u) => u.handle === admin.handle) as Entity<User>;

  /**
   * Generate the session.
   */
  const session = await generateSession(system, adminUser.$id, admin.credential.$id);
  const sessionEncrypted = await cryptoWeb.sessionEncrypt(session);

  /**
   * Create a challenge.
   */
  const inputChallenge: IoInput<ApiAuthChallenge> = {
    body: {},
    query: {},
  };
  const outputChallenge = await processAuthChallenge(context)(inputChallenge, ioOutput());
  const challenge = outputChallenge.json.result;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }
  const challengeEncoded = base64JsonEncode(challenge);

  /**
   * Sign the encoded challenge.
   */
  const privateKey = await cryptoWeb.keyUnwrap(
    exec.privateKey,
    await cryptoWeb.hashData(agentFingerprint()),
  );
  if (!privateKey) {
    expect(privateKey).toBeDefined();
    return;
  }

  /**
   * Now that everything is prepared, start authenticating.
   */
  const inputAuthenticate: IoInput<ApiAuthAuthenticate> = {
    body: {},
    query: {},
    sessionEncrypted,
    challengeEncoded,
  };

  /**
   * Sign the input body and attach it.
   */
  const signature = await cryptoWeb.asymSign(
    JSON.stringify(inputAuthenticate.body),
    privateKey,
  );
  const signatureEncoded = base64Encode(new Uint8Array(signature));
  inputAuthenticate.signatureEncoded = signatureEncoded;

  const output = await processAuthAuthenticate(context)(inputAuthenticate, ioOutput());

  expect(output.status).toBe(401);
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0]).toMatchObject({
    level: 'error',
    title: 'Invalid Signature',
  });
});
