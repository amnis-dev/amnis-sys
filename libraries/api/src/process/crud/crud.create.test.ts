import type {
  IoInput,
  DataCreator,
  Bearer,
  User,
  Entity,
  IoContext,
  IoMap,
} from '@amnis/state';
import {
  userSlice,

  ioProcess,
  ioOutputErrored,
  databaseMemoryStorage,
  ioOutput,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import { schemaState } from '@amnis/state/schema';
import { authenticateFinalize } from '../../utility/authenticate.js';
import { processCrudCreate } from './crud.create.js';
import { schemaAuth } from '../../schema/index.js';

let context: IoContext;
let dataUsers: Entity<User>[];
let io: IoMap<'create'>;

beforeAll(async () => {
  context = await contextSetup({
    schemas: [schemaAuth, schemaState],
  });
  const storage = databaseMemoryStorage();
  dataUsers = Object.values(storage[userSlice.key]) as Entity<User>[];

  io = ioProcess(
    context,
    {
      create: processCrudCreate,
    },
  );
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should not create without bearer', async () => {
  const inputCreator: IoInput<DataCreator> = {
    body: {
      [userSlice.key]: [
        userSlice.create({
          handle: 'NewUser',
        }),
      ],
    },
    query: {},
  };

  const outputCreator = await io.create(inputCreator, ioOutput());

  expect(outputCreator.status).toBe(200);
  expect(ioOutputErrored(outputCreator)).toBe(true);
  expect(outputCreator.json.logs).toHaveLength(1);
  expect(outputCreator.json.logs[0].level).toBe('error');
  expect(outputCreator.json.result).toEqual({});
  expect(Object.keys(outputCreator.json.result)).toHaveLength(0);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should login as administrator and create user', async () => {
  const admin = dataUsers.find((e) => e.handle === 'admin') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    admin.$id,
    admin.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const userNew = userSlice.create({
    handle: 'NewUserByAdmin',
  });

  const inputCreator: IoInput<DataCreator> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userSlice.key]: [
        userNew,
      ],
    },
    query: {},
  };

  const outputCreator = await io.create(inputCreator, ioOutput());

  expect(outputCreator.status).toBe(200);
  expect(outputCreator.json.result?.user[0]?.committed).toBe(true);
  expect(ioOutputErrored(outputCreator)).toBe(false);

  const storage = databaseMemoryStorage();

  expect(Object.values(storage.user)).toHaveLength(4);
  expect((Object.values(storage.user)[3] as Entity<User>)?.handle).toBe('NewUserByAdmin');
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should login as executive and create user', async () => {
  const exec = dataUsers.find((e) => e.handle === 'exec') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    exec.$id,
    exec.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const userNew = userSlice.create({
    handle: 'NewUserByExec',
  });

  const inputCreator: IoInput<DataCreator> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userSlice.key]: [userNew],
    },
    query: {},
  };

  const outputCreator = await io.create(inputCreator, ioOutput());

  expect(outputCreator.status).toBe(200);
  expect(outputCreator.json.logs.length).toBeGreaterThan(0);
  expect(ioOutputErrored(outputCreator)).toBe(false);

  const storage = databaseMemoryStorage();

  expect(Object.values(storage.user)).toHaveLength(5);
  expect((Object.values(storage.user)[4] as Entity<User>)?.handle).toBe('NewUserByExec');
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should login as user and cannot create user', async () => {
  const user = dataUsers.find((e) => e.handle === 'user') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    user.$id,
    user.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const userNew = userSlice.create({
    handle: 'NewUserByUser',
  });

  const inputCreator: IoInput<DataCreator> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userSlice.key]: [userNew],
    },
    query: {},
  };

  const outputCreator = await io.create(inputCreator, ioOutput());

  expect(outputCreator.status).toBe(200);
  expect(outputCreator.json.logs.length).toBeGreaterThan(0);
  expect(ioOutputErrored(outputCreator)).toBe(true);

  const storage = databaseMemoryStorage();

  expect(Object.values(storage.user)).toHaveLength(5);
});
