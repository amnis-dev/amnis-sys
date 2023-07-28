/* eslint-disable no-bitwise */
import type {
  Entity,
  Grant,
  IoContext,
  IoInput,
  IoProcess,
  JWTAccess,
  DataCreator,
  DataDeleter,
  DataQuery,
  DataUpdater,
  System,
  UID,
  User,
} from '@amnis/state';
import {
  roleSlice,
  userSlice,
  databaseMemoryStorage,
  dateNumeric,
  GrantScope,
  grantTask,
  GrantTask,
  ioOutput,
  ioOutputErrored,
  roleComboCreate,
  uid,
  systemSlice,
} from '@amnis/state';
import { schemaState } from '@amnis/state/schema';
import { contextSetup } from '@amnis/state/context';
import { schemaAuth } from '../schema/index.js';
import { mwState } from './mw.state.js';

let context: IoContext;

let userExisting: Entity<User>;

let accessAnon: JWTAccess;
let accessFull: JWTAccess;
let accessFullAdmin: JWTAccess;

type TestInputs = [
  IoInput<DataCreator>,
  IoInput<DataQuery>,
  IoInput<DataUpdater>,
  IoInput<DataDeleter>,
]

const testIteration = [
  GrantTask.Create,
  GrantTask.Read,
  GrantTask.Update,
  GrantTask.Delete,
];

const testInputs: TestInputs = [
  {
    body: {
      sliceA: [{ $id: uid('sliceA') }],
      sliceB: [{ $id: uid('sliceB') }],
      sliceC: [{ $id: uid('sliceC') }],
    },
    query: {},
  },
  {
    body: {
      sliceA: {},
      sliceB: {},
      sliceC: {},
    },
    query: {},
  },
  {
    body: {
      sliceA: [{ $id: uid('sliceA') }],
      sliceB: [{ $id: uid('sliceB') }],
      sliceC: [{ $id: uid('sliceC') }],
    },
    query: {},
  },
  {
    body: {
      sliceA: [],
      sliceB: [],
      sliceC: [],
    },
    query: {},
  },
];

let testUserInputs: TestInputs;

/**
 * Create an empty process for the middleware.
 */
const noprocess: IoProcess = () => async (i, o) => o;

/**
 * Setup the test environment...
 */
beforeAll(async () => {
  context = await contextSetup({
    schemas: [schemaAuth, schemaState],
  });

  const system = systemSlice.select.active(context.store.getState()) as Entity<System>;

  const storage = databaseMemoryStorage();
  const usersStored = Object.values(storage[userSlice.key]) as Entity<User>[];
  userExisting = usersStored.find((u) => u.handle === 'user') as Entity<User>;
  const adminUser = usersStored.find((u) => u.handle === 'admin') as Entity<User>;

  /**
   * Anonymous role is set to only allow READS and UPDATES on "sliceC".
   */
  const grantsAnon: Grant[] = [
    ['sliceC', GrantScope.Global, grantTask(0, 1, 1, 0)],
  ];
  const roleAnon = roleSlice.createEntity({
    name: 'Anon Access Role',
    grants: grantsAnon,
  });
  context.store.dispatch(roleSlice.action.insert(roleAnon));
  context.store.dispatch(systemSlice.action.update({
    $id: system.$id,
    $anonymousRole: roleAnon.$id,
  }));

  /**
   * Setup grants that provide full access.
   */
  const grantsFull: Grant[] = [
    ['user', GrantScope.Global, grantTask(1, 1, 1, 1)],
    ['sliceA', GrantScope.Global, grantTask(1, 1, 1, 1)],
    ['sliceB', GrantScope.Global, grantTask(1, 1, 1, 1)],
    ['sliceC', GrantScope.Global, grantTask(1, 1, 1, 1)],
  ];
  const roleFull = roleSlice.create({
    name: 'Full Access Role',
    grants: grantsFull,
  });
  const comboFull = roleComboCreate([roleFull]);

  context.store.dispatch(roleSlice.action.insertCombo(comboFull));

  /**
   * Define the access varieties to test with.
   * Only the "sub" and "pem" values matter.
   */
  accessAnon = {
    iss: '',
    sub: 'user:anonymous' as UID,
    exp: dateNumeric('30m'),
    typ: 'access',
    /**
     * No pem value here. The middleware will set the Anonymous role grants.
     */
  };
  accessFull = {
    iss: '',
    sub: 'user:full' as UID,
    exp: dateNumeric('30m'),
    typ: 'access',
    pem: comboFull[0],
  };
  accessFullAdmin = {
    iss: '',
    sub: adminUser.$id,
    exp: dateNumeric('30m'),
    typ: 'access',
    pem: comboFull[0],
  };

  testUserInputs = [
    {
      body: {
        ...testInputs[0].body,
        user: [{ $id: userExisting.$id }],
      },
      query: {},
    },
    {
      body: {
        ...testInputs[1].body,
        user: {},
      },
      query: {},
    },
    {
      body: {
        ...testInputs[2].body,
        user: [{ $id: userExisting.$id }],
      },
      query: {},
    },
    {
      body: {
        ...testInputs[3].body,
        user: [userExisting.$id],
      },
      query: {},
    },
  ];
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * STATE TESTS
 * ************************************************************************************************
 * ================================================================================================
 */
test('should pass through the state middleware successfully', async () => {
  await Promise.all(testIteration.map(async (task, index) => {
    const process = mwState(task)(() => async (input, output) => {
      /**
       * Ensure nothing was filtered on the input body.
       */
      expect(Object.keys(input.body)).toEqual(Object.keys(testInputs[index].body));

      /**
       * Set the output result so the middleware can add successful logs.
       */
      output.json.result = input.body;

      return output;
    });

    const output = await process(context)(
      {
        ...testInputs[index],
        access: accessFull,
      },
      ioOutput(),
    );

    expect(output.status).toBe(200);
    expect(ioOutputErrored(output)).toBe(false);
    expect(output.json.logs).toHaveLength(1);
    expect(output.json.logs[0].level).toBe('success');
  }));
});

/**
 * ================================================================================================
 */
test('should pass through the state middleware successfully with creating a user as admin', async () => {
  await Promise.all(testIteration.map(async (task, index) => {
    const process = mwState(task)(() => async (input, output) => {
      /**
       * Ensure nothing was filtered on the input body.
       */
      expect(Object.keys(input.body).sort()).toEqual(
        Object.keys(testUserInputs[index].body).sort(),
      );

      /**
       * Set the output result so the middleware can add successful logs.
       */
      output.json.result = input.body;

      return output;
    });

    const output = await process(context)(
      {
        ...testUserInputs[index],
        access: accessFullAdmin,
      },
      ioOutput(),
    );

    expect(output.status).toBe(200);
    expect(ioOutputErrored(output)).toBe(false);
    expect(output.json.logs).toHaveLength(1);
    expect(output.json.logs[0].level).toBe('success');
  }));
});

/**
 * ================================================================================================
 */
test('should fail through the state create middleware with creating a user', async () => {
  await Promise.all(testIteration.map(async (task, index) => {
    const process = mwState(task)(() => async (input, output) => {
      expect(Object.keys(input.body).sort()).toEqual(
        Object.keys(testUserInputs[index].body).sort(),
      );
      output.json.result = input.body;

      return output;
    });

    const output = await process(context)(
      {
        ...testUserInputs[index],
        access: accessFull,
      },
      ioOutput(),
    );

    if (task & (GrantTask.Create | GrantTask.Update | GrantTask.Delete)) {
      expect(output.status).toBe(401);
      expect(ioOutputErrored(output)).toBe(true);
      expect(output.json.logs).toHaveLength(1);
      expect(output.json.logs[0].level).toBe('error');
    }
    /**
     * Admin role is not needed for reading user data.
     */
    if (task & (GrantTask.Read)) {
      expect(output.status).toBe(200);
      expect(ioOutputErrored(output)).toBe(false);
      expect(output.json.logs).toHaveLength(1);
      expect(output.json.logs[0].level).toBe('success');
    }
  }));
});

/**
 * ================================================================================================
 */
test('should fail through the state create middleware as anonymous', async () => {
  await Promise.all(testIteration.map(async (task, index) => {
    const process = mwState(task)(() => async (input, output) => {
      /**
       * All slices should have been filtered on CREATE and DELETE.
       */
      if (task & (GrantTask.Create | GrantTask.Delete)) {
        expect(Object.keys(input.body)).toEqual([]);
      }
      /**
       * Remember, we allowed anonymous to READ and UPDATE "sliceC"
       */
      if (task & (GrantTask.Read | GrantTask.Update)) {
        expect(Object.keys(input.body)).toEqual(['sliceC']);
      }
      output.json.result = input.body;

      return output;
    });

    const output = await process(context)(
      {
        ...testInputs[index],
        access: accessAnon,
      },
      ioOutput(),
    );

    expect(output.status).toBe(200);
    expect(ioOutputErrored(output)).toBe(true);

    if (task & (GrantTask.Create | GrantTask.Delete)) {
      expect(output.json.logs).toHaveLength(1);
      expect(output.json.logs[0].level).toBe('error');
    }
    if (task & (GrantTask.Read | GrantTask.Update)) {
      expect(output.json.logs).toHaveLength(2);
      const logLevels = output.json.logs.map((l) => l.level);
      expect(logLevels.includes('error')).toBe(true);
      expect(logLevels.includes('success')).toBe(true);
    }
  }));
});

/**
 * ================================================================================================
 */
test('should fail through the state create middleware with no access', async () => {
  await Promise.all(testIteration.map(async (task, index) => {
    const process = mwState(task)(noprocess);

    const output = await process(context)(
      {
        ...testInputs[index],
      },
      ioOutput(),
    );

    /**
     * Unauthorized status since no access object was set.
     */
    expect(output.status).toBe(401);
    expect(ioOutputErrored(output)).toBe(true);
    expect(output.json.logs).toHaveLength(1);
    expect(output.json.logs[0].level).toBe('error');
  }));
});
