import type {
  Bearer,
  User,
  Entity,
  IoContext,
  IoMap,
} from '@amnis/state';
import {
  userSlice,
  ioProcess,
  databaseMemoryStorage,
  ioOutput,
  ioInput,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import { schemaState } from '@amnis/state/schema';
import { processSysSchema } from './sys.schema.js';
import { schemaSys } from '../../schema/index.js';
import type { ApiSysSchema } from '../../../types/index.js';
import { authenticateFinalize } from '../../utility/index.js';

let context: IoContext;
let dataUsers: Entity<User>[];
let io: IoMap<'schema'>;

beforeAll(async () => {
  context = await contextSetup({
    schemas: [schemaSys, schemaState],
  });
  const storage = databaseMemoryStorage();
  dataUsers = Object.values(storage[userSlice.key]) as Entity<User>[];

  io = ioProcess(
    context,
    {
      schema: processSysSchema,
    },
  );
});

test('should fetch profile schema as anonymous requestor', async () => {
  const inputCreator = ioInput<ApiSysSchema>({
    query: {
      type: 'state/Profile',
    },
  });

  const outputCreator = await io.schema(inputCreator, ioOutput());

  expect(outputCreator.status).toBe(200);
});

test('should NOT fetch user schema as anonymous requestor', async () => {
  const inputCreator = ioInput<ApiSysSchema>({
    query: {
      type: 'state/User',
    },
  });

  const outputCreator = await io.schema(inputCreator, ioOutput());

  expect(outputCreator.status).toBe(401);
});

test('should fetch user schema as admin user', async () => {
  const admin = dataUsers.find((e) => e.handle === 'admin') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    admin.$id,
    admin.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const inputSchema = ioInput({
    accessEncoded: bearerAccess.access,
    query: {
      type: 'state/User',
    },
  });

  const outputSchema = await io.schema(inputSchema, ioOutput());

  expect(outputSchema.status).toBe(200);
  expect(outputSchema.json.result).toBeDefined();
  expect(outputSchema.json.result).toEqual(expect.any(Array));
  expect(outputSchema.json.result.length).toBeGreaterThan(1);

  expect(outputSchema.json.locale).toBeDefined();
  expect(outputSchema.json.locale?.length).toBeGreaterThan(0);
});
