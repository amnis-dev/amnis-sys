import type {
  IoInput,
  Bearer,
  User,
  Entity,
  IoContext,
  IoMap,
  DataQuery,
  Credential,
  Role,
} from '@amnis/state';
import {
  roleSlice,
  credentialSlice,

  profileSlice,

  userSlice,

  ioProcess,
  ioOutputErrored,
  databaseMemoryStorage,
  ioOutput,
  ioInput,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import { schemaState } from '@amnis/state/schema';
import { authenticateFinalize } from '../../utility/authenticate.js';
import { processCrudRead } from './crud.read.js';
import { schemaAuth } from '../../schema/index.js';

let context: IoContext;
let userAdmin: Entity<User>;
let io: IoMap<'read'>;

beforeAll(async () => {
  context = await contextSetup({
    schemas: [schemaAuth, schemaState],
  });
  const storage = databaseMemoryStorage();
  const dataUsers = Object.values(storage[userSlice.key]) as Entity<User>[];
  userAdmin = dataUsers.find((e) => e.handle === 'admin') as Entity<User>;

  io = ioProcess(
    context,
    {
      read: processCrudRead,
    },
  );
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should not read user without access', async () => {
  const input: IoInput<DataQuery> = ioInput({
    body: {
      [userSlice.key]: {
        $query: {},
      },
    },
  });

  const output = await io.read(input, ioOutput());

  expect(output.status).toBe(200);
  expect(ioOutputErrored(output)).toBe(true);
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('error');
  expect(output.json.result).toEqual({});
  expect(Object.keys(output.json.result)).toHaveLength(0);
});

test('should read profile without access', async () => {
  const input: IoInput<DataQuery> = ioInput({
    body: {
      [profileSlice.key]: {
        $query: {},
      },
    },
  });

  const output = await io.read(input, ioOutput());

  expect(output.status).toBe(200);
  expect(ioOutputErrored(output)).toBe(false);
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('success');
  expect(output.json.result).toMatchObject({
    [profileSlice.key]: expect.any(Array),
  });
  expect(Object.keys(output.json.result).length).toBe(1);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should login as administrator read users and roles', async () => {
  const outputLogin = await authenticateFinalize(
    context,
    userAdmin.$id,
    userAdmin.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;
  const input: IoInput<DataQuery> = ioInput({
    accessEncoded: bearerAccess.access,
    body: {
      [userSlice.key]: {
        $query: {},
      },
      [roleSlice.key]: {
        $query: {},
      },
    },
  });

  const output = await io.read(input, ioOutput());

  expect(output.status).toBe(200);
  expect(ioOutputErrored(output)).toBe(false);
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('success');

  const { result, locale } = output.json;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  expect(Object.keys(result).length).toBe(2);
  expect(locale).toBeDefined();
  expect(locale).toHaveLength(6);

  const users = result[userSlice.key] as Entity<User>[];

  expect(users).toBeDefined();
  /**
   * Initial data has only 3 users.
   * If that changes, change this expectation.
   */
  expect(users.length).toBe(3);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should login as administrator read user with a depth of 1', async () => {
  const outputLogin = await authenticateFinalize(
    context,
    userAdmin.$id,
    userAdmin.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;
  const input: IoInput<DataQuery> = ioInput({
    accessEncoded: bearerAccess.access,
    body: {
      [userSlice.key]: {
        $query: {},
        $depth: 1,
      },
    },
  });

  const output = await io.read(input, ioOutput());

  expect(output.status).toBe(200);
  expect(ioOutputErrored(output)).toBe(false);

  /**
   * We should receive two success logs from the depth search.
   */
  expect(output.json.logs).toHaveLength(2);
  expect(output.json.logs[0].level).toBe('success');
  expect(output.json.logs[1].level).toBe('success');

  const { result } = output.json;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  expect(Object.keys(result).length).toBe(3);

  const users = result[userSlice.key] as Entity<User>[];
  const roles = result[roleSlice.key] as Entity<Role>[];
  const credentials = result[credentialSlice.key] as Entity<Credential>[];

  expect(users).toBeDefined();
  expect(roles).toBeDefined();
  expect(credentials).toBeDefined();
});
