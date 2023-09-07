import type { MockAgents } from '@amnis/mock';
import { mockService } from '@amnis/mock';
import {
  agentSlice, schemaSlice,
} from '@amnis/state';
import { apiAuth } from '../../auth/index.js';
import { apiSys } from '../index.js';
import { serviceConfig } from './config.js';
import { clientStore } from './store.js';

let agents: MockAgents;

beforeAll(async () => {
  await mockService.setup(await serviceConfig());
  mockService.start();

  agents = mockService.agents();
  clientStore.dispatch(agentSlice.action.insertMany(Object.values(agents)));

  await clientStore.dispatch(
    apiSys.endpoints.system.initiate({
      url: 'http://localhost/api/sys/system',
      set: true,
    }),
  );
});

afterAll(() => {
  mockService.stop();
});

test('should be able to fetch user schema and populate state', async () => {
  /**
   * Ensure the schema slice is empty.
   */
  expect(clientStore.getState().schema.entities).toEqual({});

  /**
   * Set the user account information.
   */
  clientStore.dispatch(agentSlice.action.activeSet(agents.adminMock.$id));

  await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: 'adminMock',
    password: 'password',
  }));

  /**
   * Fetch the user schema.
   */
  await clientStore.dispatch(
    apiSys.endpoints.schema.initiate({
      type: 'state/User',
    }),
  );

  const userSchema = schemaSlice.select.schema(clientStore.getState(), 'user');
  if (!userSchema) {
    expect(userSchema).toBeDefined();
    return;
  }
  expect(userSchema.$id).toBe('state#/definitions/User');
  expect(userSchema.type).toBeDefined('object');
});
