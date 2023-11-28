import type {
  IoInput,
  Bearer,
  DataUpdater,
  Profile,
  IoContext,
  IoMap,
  Entity,
  User,
  DataQuery,
  History,
} from '@amnis/state';
import {
  historySlice,
  userSlice,
  profileSlice,
  ioProcess,
  ioOutputErrored,
  databaseMemoryStorage,
  ioOutput,
  ioInput,
} from '@amnis/state';
import {
  schemaState,
} from '@amnis/state/schema';
import {
  contextSetup,
} from '@amnis/state/context';
import { schemaAuth } from '../../schema/index.js';
import { authenticateFinalize } from '../../utility/authenticate.js';
import { processCrudUpdate } from './crud.update.js';
import { processCrudRead } from './crud.read.js';

let context: IoContext;
let dataUsers: Entity<User>[];
let dataProfiles: Entity<Profile>[];
let io: IoMap<'update' | 'read'>;

beforeAll(async () => {
  context = await contextSetup({
    schemas: [schemaAuth, schemaState],
  });
  const storage = databaseMemoryStorage();
  dataUsers = Object.values(storage[userSlice.key]) as Entity<User>[];
  dataProfiles = Object.values(storage[profileSlice.key]) as Entity<Profile>[];

  io = ioProcess(
    context,
    {
      update: processCrudUpdate,
      read: processCrudRead,
    },
  );
});

test('should not update without bearer', async () => {
  const inputUpdate: IoInput<DataUpdater> = ioInput({
    body: {
      [userSlice.key]: [
        {
          // Admin user ID
          $id: dataUsers[0].$id,
        },
      ],
    },
  });

  const outputUpdate = await io.update(inputUpdate, ioOutput());

  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(true);
  expect(outputUpdate.json.logs).toHaveLength(1);
  expect(outputUpdate.json.logs[0].level).toBe('error');
  expect(outputUpdate.json.result).toEqual({});
  expect(Object.keys(outputUpdate.json.result)).toHaveLength(0);
});

test('should login as administrator and update user email', async () => {
  const admin = dataUsers.find((e) => e.handle === 'admin') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    admin.$id,
    admin.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const inputUpdate: IoInput<DataUpdater> = ioInput({
    accessEncoded: bearerAccess.access,
    body: {
      [userSlice.key]: [
        {
          // User ID
          $id: dataUsers[2].$id,
          email: 'new@amnis.dev',
        },
      ],
    },
    query: {},
  });

  const outputUpdate = await io.update(inputUpdate, ioOutput());

  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(false);

  expect(outputUpdate.json.result?.[userSlice.key]).toHaveLength(1);
  expect(outputUpdate.json.result?.[userSlice.key][0]).toMatchObject({
    $id: dataUsers[2].$id,
    handle: 'user',
  });
  expect(outputUpdate.json.result?.[historySlice.key]).toHaveLength(1);
  expect(outputUpdate.json.result?.[historySlice.key][0]).toMatchObject({
    mutation: {
      $id: dataUsers[2].$id,
      email: expect.any(String),
    },
  });

  expect(outputUpdate.json.logs).toHaveLength(1);
  expect(ioOutputErrored(outputUpdate)).toBe(false);
});

test('should login as administrator and update profile display name', async () => {
  const admin = dataUsers.find((e) => e.handle === 'admin') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    admin.$id,
    admin.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const nameNew = 'The New Administrator';
  const inputUpdate: IoInput<DataUpdater> = ioInput({
    accessEncoded: bearerAccess.access,
    body: {
      [profileSlice.key]: [
        {
          // User ID
          $id: dataProfiles[0].$id,
          nameDisplay: nameNew,
        },
      ],
    },
    query: {},
  });

  const outputUpdate = await io.update(inputUpdate, ioOutput());

  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(false);

  expect(outputUpdate.json.result?.[profileSlice.key]).toHaveLength(1);
  expect(outputUpdate.json.result?.[profileSlice.key][0]).toMatchObject({
    $id: dataProfiles[0].$id,
    nameDisplay: nameNew,
  });

  expect(outputUpdate.json.result?.[historySlice.key]).toHaveLength(1);
  expect(outputUpdate.json.result?.[historySlice.key][0]).toMatchObject({
    mutation: {
      $id: dataProfiles[0].$id,
      nameDisplay: nameNew,
    },
  });
});

test('should login as executive and update user email', async () => {
  const exec = dataUsers.find((e) => e.handle === 'exec') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    exec.$id,
    exec.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const emailNew = 'new@email.com';
  const inputUpdate: IoInput<DataUpdater> = ioInput({
    accessEncoded: bearerAccess.access,
    body: {
      [userSlice.key]: [
        {
          // User ID
          $id: dataUsers[2].$id,
          email: emailNew,
        },
      ],
    },
    query: {},
  });

  const outputUpdate = await io.update(inputUpdate, ioOutput());

  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(false);

  expect(outputUpdate.json.result?.[userSlice.key]).toHaveLength(1);
  expect(outputUpdate.json.result?.[userSlice.key][0]).toMatchObject({
    $id: dataUsers[2].$id,
    email: emailNew,
  });
  expect(outputUpdate.json.result?.[historySlice.key]).toHaveLength(1);
  expect(outputUpdate.json.result?.[historySlice.key][0]).toMatchObject({
    mutation: {
      $id: dataUsers[2].$id,
      email: emailNew,
    },
  });
});

test('should login as executive and NOT update user handle', async () => {
  const user = dataUsers.find((e) => e.handle === 'user') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    user.$id,
    user.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const handleNew = 'new_username';
  const inputUpdate: IoInput<DataUpdater> = ioInput({
    accessEncoded: bearerAccess.access,
    body: {
      [userSlice.key]: [
        {
          // User ID
          $id: dataUsers[2].$id,
          handle: handleNew,
        },
      ],
    },
    query: {},
  });

  const outputUpdate = await io.update(inputUpdate, ioOutput());

  expect(outputUpdate.status).toBe(401);
  expect(ioOutputErrored(outputUpdate)).toBe(true);

  expect(outputUpdate.json.result).toBeUndefined();
});

test(
  'should login as user with updated credentials and update own profile display name',
  async () => {
    const user = dataUsers.find((e) => e.handle === 'user') as Entity<User>;
    const outputLogin = await authenticateFinalize(
      context,
      user.$id,
      user.$credentials[0],
    );

    const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;
    const profile = outputLogin.json.result?.[profileSlice.key][0] as Entity<Profile>;

    const nameNew = 'The New User Me';
    const inputUpdate: IoInput<DataUpdater> = ioInput({
      accessEncoded: bearerAccess.access,
      body: {
        [profileSlice.key]: [
          {
            // User Profile
            $id: profile.$id,
            nameDisplay: nameNew,
          },
        ],
      },
      query: {},
    });

    const outputUpdate = await io.update(inputUpdate, ioOutput());

    expect(outputUpdate.status).toBe(200);
    expect(ioOutputErrored(outputUpdate)).toBe(false);

    expect(outputUpdate.json.result?.[profileSlice.key]).toHaveLength(1);
    expect(outputUpdate.json.result?.[profileSlice.key][0]).toMatchObject({
      $id: dataProfiles[2].$id,
      nameDisplay: nameNew,
    });

    expect(outputUpdate.json.result?.[historySlice.key]).toHaveLength(1);
    expect(outputUpdate.json.result?.[historySlice.key][0]).toMatchObject({
      mutation: {
        $id: profile.$id,
        nameDisplay: nameNew,
      },
    });
  },
);

test('should login as user and be denied updating another profile', async () => {
  const user = dataUsers.find((e) => e.handle === 'user') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    user.$id,
    user.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const nameNew = 'New Profile Name';
  const inputUpdate: IoInput<DataUpdater> = ioInput({
    accessEncoded: bearerAccess.access,
    body: {
      [profileSlice.key]: [
        {
          // Admin Profile ID
          $id: dataProfiles[0].$id,
          nameDisplay: nameNew,
        },
      ],
    },
  });

  const outputUpdate = await io.update(inputUpdate, ioOutput());

  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(true);

  expect(outputUpdate.json.logs).toHaveLength(1);
  expect(outputUpdate.json.logs[0].title).toBe('Update Disallowed');
});

test('should login as user and view history of own profile', async () => {
  const user = dataUsers.find((e) => e.handle === 'user') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    user.$id,
    user.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const readQuery: IoInput<DataQuery> = ioInput({
    accessEncoded: bearerAccess.access,
    body: {
      [profileSlice.key]: {
        $query: {
          $_user: {
            $eq: user.$id,
          },
        },
        $history: true,
      },
    },
    query: {},
  });

  const outputRead = await io.read(readQuery, ioOutput());

  const profiles = outputRead.json.result?.[profileSlice.key] as Entity<Profile>[];
  const histories = outputRead.json.result?.[historySlice.key] as Entity<History>[];

  expect(outputRead.status).toBe(200);
  expect(ioOutputErrored(outputRead)).toBe(false);

  expect(profiles).toHaveLength(1);
  expect(histories).toHaveLength(2);
});
