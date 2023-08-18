import {
  agentSlice,
  contactSlice,
  profileSlice,
  sessionSlice,
  userSlice,
} from '@amnis/state';
import type { MockAgents } from '@amnis/mock';
import { mockService } from '@amnis/mock';
import { apiAuth } from '../index.js';
import { clientStore } from './store.js';
import {
  serviceConfig,
} from './config.js';
import { apiSys } from '../../sys/index.js';
import type { ApiError } from '../../query.types.js';

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

test('should be able to login as user', async () => {
  /**
   * Get the user account information.
   */
  clientStore.dispatch(agentSlice.action.activeSet(agents.userMock.$id));

  const result = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: 'userMock',
    password: 'password',
  }));

  if ('error' in result) {
    expect(result.error).toBeUndefined();
    return;
  }

  const { data } = result;

  expect(Object.keys(data.result || {})).toHaveLength(4);
  expect(data.bearers?.length).toBe(1);

  const state = clientStore.getState();
  const userActive = userSlice.select.active(state);
  const profileActive = profileSlice.select.active(state);
  const sessionActive = sessionSlice.select.active(state);
  const contactActive = contactSlice.select.active(state);

  expect(userActive?.$id).toBe(data.result?.[userSlice.key][0].$id);
  expect(profileActive?.$id).toBe(data.result?.[profileSlice.key][0].$id);
  expect(profileActive?.$user).toBe(userActive?.$id);
  expect(sessionActive?.$id).toBe(data.result?.[sessionSlice.key][0].$id);
  expect(contactActive?.$id).toBe(data.result?.[contactSlice.key][0].$id);
  expect(contactActive?.$id).toBe(profileActive?.$contact);
});

test('should NOT be able to login with a bad password', async () => {
  /**
   * Get the user account information.
   */
  clientStore.dispatch(agentSlice.action.activeSet(agents.userMock.$id));

  const result = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: 'userMock',
    password: 'password'.slice(1),
  }));

  if ('data' in result) {
    expect(result.data).toBeUndefined();
    return;
  }

  const { error } = result;
  const { data: { logs } } = error as ApiError;

  expect(logs).toHaveLength(1);
  expect(logs?.[0]?.title).toBe('Authentication Failed: Wrong Password');
});

test('should not login as admin with improper agent private key', async () => {
  /**
   * Get the user account information.
   */
  clientStore.dispatch(agentSlice.action.activeSet(agents.adminMock.$id));

  clientStore.dispatch(agentSlice.action.updateActive({
    privateKey: agents.userMock.privateKey,
  }));

  const result = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: 'adminMock',
    password: 'password',
  }));

  if ('data' in result) {
    expect(result.data).toBeUndefined();
    return;
  }

  const { error } = result;
  const { data: { logs } } = error as ApiError;

  expect(logs).toHaveLength(1);
  expect(logs?.[0]?.title).toBe('Invalid Signature');
});
