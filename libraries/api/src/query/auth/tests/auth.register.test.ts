import { mockService } from '@amnis/mock';
import {
  contactSlice,
  credentialSlice,
  profileSlice,
  sessionSlice,
  userSlice,
  bearerSlice,
} from '@amnis/state';
import { apiSys } from '../../sys/index.js';
import { apiAuth } from '../index.js';
import {
  serviceConfig,
} from './config.js';
import { clientStore } from './store.js';

beforeAll(async () => {
  await mockService.setup(await serviceConfig());
  mockService.start();
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

test('should register a new account', async () => {
  const response = await clientStore.dispatch(apiAuth.endpoints.register.initiate({
    handle: 'newbie',
    password: 'newpass123',
    email: 'newbie@newbie.addr',
    nameDisplay: 'Newbie User',
  }));

  if ('error' in response) {
    expect(response.error).toBeUndefined();
    return;
  }

  const { data: { logs, result, bearers } } = response;

  if (!result || !bearers) {
    expect(result).toBeDefined();
    expect(bearers).toBeDefined();
    return;
  }

  expect(logs.length).toBeGreaterThanOrEqual(1);

  const userActive = userSlice.select.active(clientStore.getState());
  const credentialActive = credentialSlice.select.active(clientStore.getState());
  const profileActive = profileSlice.select.active(clientStore.getState());
  const contactActive = contactSlice.select.active(clientStore.getState());
  const sessionActive = sessionSlice.select.active(clientStore.getState());

  const bearerActive = bearerSlice.select.byId(clientStore.getState(), 'core');

  if (
    !userActive
    || !credentialActive
    || !profileActive
    || !contactActive
    || !sessionActive
    || !bearerActive
  ) {
    expect(userActive).toBeDefined();
    expect(credentialActive).toBeDefined();
    expect(profileActive).toBeDefined();
    expect(contactActive).toBeDefined();
    expect(sessionActive).toBeDefined();
    expect(bearerActive).toBeDefined();
    return;
  }

  expect(userActive).toEqual(result[userSlice.key][0]);
  expect(credentialActive).toEqual(result[credentialSlice.key][0]);
  expect(profileActive).toEqual(result[profileSlice.key][0]);
  expect(contactActive).toEqual(result[contactSlice.key][0]);
  expect(sessionActive).toEqual(result[sessionSlice.key][0]);
  expect(bearerActive).toEqual(bearers[0]);
});

test('should logout and login as the newly registered account', async () => {
  /**
   * Logout
   */
  await clientStore.dispatch(apiAuth.endpoints.logout.initiate({}));

  /**
   * Login
   */
  const response = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: 'newbie',
    password: 'newpass123',
  }));

  if ('error' in response) {
    expect(response.error).toBeUndefined();
    return;
  }

  const { data: { result, bearers } } = response;

  expect(result).toBeDefined();
  expect(bearers).toBeDefined();
});
