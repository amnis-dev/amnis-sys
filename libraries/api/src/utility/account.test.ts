import type {
  Credential,
  Entity,
  IoContext,
  User,
} from '@amnis/state';
import {
  contactSlice,
  credentialSlice,
  profileSlice,
  handleSlice,
  userSlice,
  cryptoWeb,
  databaseMemoryClear,
  ioOutputErrored,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import { accountCreate, accountCredentialAdd } from './account.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup();
});

afterEach(() => {
  databaseMemoryClear();
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should create a new account with minial options', async () => {
  const handleName = 'newbie';
  const password = 'passwd12';
  const email = 'email@amnis.dev';
  const output = await accountCreate(
    context,
    {
      handle: handleName,
      password,
      email,
    },
  );

  expect(output.status).toBe(200);
  expect(output.json.logs).toHaveLength(1);
  expect(ioOutputErrored(output)).toBe(false);

  const { result } = output.json;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  expect(Object.keys(result)).toHaveLength(4);

  const users = result[userSlice.key] as Entity<User>[];
  expect(users).toBeDefined();
  expect(users).toHaveLength(1);
  expect(users[0]).toMatchObject({
    handle: handleName,
    password: expect.any(String),
    email,
    $credentials: [],
    $owner: users[0].$id,
    new: false,
    committed: true,
  });
  const isPasswordSame = await cryptoWeb.passCompare(password, users[0].password ?? '');
  expect(isPasswordSame).toBe(true);

  const handle = result[handleSlice.key];
  expect(handle).toBeDefined();
  expect(handle).toHaveLength(1);
  expect(handle[0]).toMatchObject({
    name: handleName,
    $subject: users[0].$id,
    new: false,
    committed: true,
  });

  const contacts = result[contactSlice.key];
  expect(contacts).toBeDefined();
  expect(contacts).toHaveLength(1);
  expect(contacts[0]).toMatchObject({
    name: handleName,
    $owner: users[0].$id,
    new: false,
    committed: true,
  });

  const profiles = result[profileSlice.key];
  expect(profiles).toBeDefined();
  expect(profiles).toHaveLength(1);
  expect(profiles[0]).toMatchObject({
    nameDisplay: handleName,
    $_user: users[0].$id,
    $_contact: contacts[0].$id,
    $owner: users[0].$id,
    new: false,
    committed: true,
  });

  expect(result[credentialSlice.key]).toBeUndefined();
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should NOT create a new account with the same handles', async () => {
  const handle = 'newbie';
  const password = 'passwd12';
  const outputFirst = await accountCreate(
    context,
    {
      handle,
      password,
    },
  );

  expect(outputFirst.status).toBe(200);
  expect(outputFirst.json.logs).toHaveLength(1);
  expect(ioOutputErrored(outputFirst)).toBe(false);

  const outputSecond = await accountCreate(
    context,
    {
      handle,
      password,
    },
  );

  expect(outputSecond.status).toBe(500);
  expect(outputSecond.json.logs).toHaveLength(1);
  expect(ioOutputErrored(outputSecond)).toBe(true);

  const { result } = outputSecond.json;
  expect(result).toBeUndefined();
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should create a new account with different display name', async () => {
  const handleName = 'newbie';
  const password = 'passwd12';
  const nameDisplay = 'Newbie Newbert';
  const output = await accountCreate(
    context,
    {
      handle: handleName,
      password,
      nameDisplay,
    },
  );

  expect(output.status).toBe(200);
  expect(output.json.logs).toHaveLength(1);
  expect(ioOutputErrored(output)).toBe(false);

  const { result } = output.json;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  expect(Object.keys(result)).toHaveLength(4);

  const users = result[userSlice.key];
  expect(users).toBeDefined();
  expect(users).toHaveLength(1);
  expect(users[0]).toMatchObject({
    handle: handleName,
    password: expect.any(String),
    $credentials: [],
    $owner: users[0].$id,
  });

  const handle = result[handleSlice.key];
  expect(handle).toBeDefined();
  expect(handle).toHaveLength(1);
  expect(handle[0]).toMatchObject({
    name: handleName,
    $subject: users[0].$id,
  });

  const contacts = result[contactSlice.key];
  expect(contacts).toBeDefined();
  expect(contacts).toHaveLength(1);
  expect(contacts[0]).toMatchObject({
    name: handleName,
    $owner: users[0].$id,
  });

  const profiles = result[profileSlice.key];
  expect(profiles).toBeDefined();
  expect(profiles).toHaveLength(1);
  expect(profiles[0]).toMatchObject({
    nameDisplay,
    $_user: users[0].$id,
    $_contact: contacts[0].$id,
    $owner: users[0].$id,
  });

  expect(result[credentialSlice.key]).toBeUndefined();
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should create a new account with a credential', async () => {
  const handleName = 'newbie';
  const password = 'passwd12';
  const credential = credentialSlice.create({
    name: 'Jest Agent',
    publicKey: '1234abcd',
  });
  const output = await accountCreate(
    context,
    {
      handle: handleName,
      password,
      credential,
    },
  );

  expect(output.status).toBe(200);
  expect(output.json.logs).toHaveLength(1);
  expect(ioOutputErrored(output)).toBe(false);

  const { result } = output.json;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  expect(Object.keys(result)).toHaveLength(5);

  const credentials = result[credentialSlice.key];
  expect(credentials).toBeDefined();
  expect(credentials).toHaveLength(1);
  expect(credentials[0]).toMatchObject({
    name: 'Jest Agent',
    publicKey: '1234abcd',
  });

  const users = result[userSlice.key];
  expect(users).toBeDefined();
  expect(users).toHaveLength(1);
  expect(users[0]).toMatchObject({
    handle: handleName,
    password: expect.any(String),
    $credentials: [credentials[0].$id],
    $owner: users[0].$id,
  });

  const handle = result[handleSlice.key];
  expect(handle).toBeDefined();
  expect(handle).toHaveLength(1);
  expect(handle[0]).toMatchObject({
    name: handleName,
    $subject: users[0].$id,
  });

  const contacts = result[contactSlice.key];
  expect(contacts).toBeDefined();
  expect(contacts).toHaveLength(1);
  expect(contacts[0]).toMatchObject({
    name: handleName,
    $owner: users[0].$id,
  });

  const profiles = result[profileSlice.key];
  expect(profiles).toBeDefined();
  expect(profiles).toHaveLength(1);
  expect(profiles[0]).toMatchObject({
    nameDisplay: handleName,
    $_user: users[0].$id,
    $_contact: contacts[0].$id,
    $owner: users[0].$id,
  });
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should add credential to existing user', async () => {
  const handle = 'newbie';
  const password = 'passwd12';
  const outputAccount = await accountCreate(
    context,
    {
      handle,
      password,
    },
  );

  const userAccount = outputAccount.json.result?.[userSlice.key]?.[0] as Entity<User>;

  if (!userAccount) {
    expect(userAccount).toBeDefined();
    return;
  }

  const credentialNew = credentialSlice.create({
    name: 'Jest Agent',
    publicKey: '1234abcd',
  });
  const output = await accountCredentialAdd(
    context,
    userAccount,
    credentialNew,
  );

  expect(output.status).toBe(200);
  expect(output.json.logs).toHaveLength(1);
  expect(ioOutputErrored(output)).toBe(false);

  const { result } = output.json;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  expect(Object.keys(result)).toHaveLength(2);
  expect(result[userSlice.key]).toHaveLength(1);
  expect(result[credentialSlice.key]).toHaveLength(1);

  const credential = result[credentialSlice.key][0] as Entity<Credential>;
  expect(credential).toMatchObject({
    name: 'Jest Agent',
    publicKey: '1234abcd',
  });

  const user = result[userSlice.key][0] as Entity<User>;
  expect(user).toBeDefined();
  expect(user).toMatchObject({
    $id: userAccount.$id,
    $credentials: [credential.$id],
  });
});
