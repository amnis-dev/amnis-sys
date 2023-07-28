import {
  accountsGet,
  dataActions,
  userSlice,
} from '@amnis/state';
import { mockService } from '@amnis/mock';
import { apiAuth } from '../index.js';
import { clientStore } from './store.js';
import {
  serviceConfig,
} from './config.js';
import { apiSys } from '../../sys/index.js';
import type { ApiError } from '../../query.types.js';

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

test('should not be able to authenticate without existing session', async () => {
  const response = await clientStore.dispatch(apiAuth.endpoints.authenticate.initiate({}));

  if ('data' in response) {
    expect(response.data).toBeUndefined();
    return;
  }

  const { error: { data } } = response as { error: ApiError };
  expect(data.result).toBeUndefined();
  expect(data.bearers).toBeUndefined();
  expect(data.logs.length).toBe(1);
  expect(data.logs[0].level).toBe('error');
  expect(data.logs[0].title).toBe('Unauthorized');
});

test('should be able to login as user', async () => {
  /**
   * Get the user account information.
   */
  const { user } = await accountsGet();

  await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: user.handle,
    password: user.password,
  }));

  const userActive = userSlice.select.active(clientStore.getState());

  expect(userActive?.$id).toBeDefined();
});

test('should be able to authenticate with existing session', async () => {
  clientStore.dispatch(dataActions.wipe());
  await clientStore.dispatch(
    apiSys.endpoints.system.initiate({
      url: 'http://localhost/api/sys/system',
      set: true,
    }, { forceRefetch: true }),
  );

  const userActivePre = userSlice.select.active(clientStore.getState());
  expect(userActivePre?.$id).toBeUndefined();

  const response = await clientStore.dispatch(apiAuth.endpoints.authenticate.initiate({}));

  if ('error' in response) {
    expect(response.error).toBeUndefined();
    return;
  }

  const { data } = response;
  expect(data.result).toBeDefined();
  expect(data.bearers).toBeDefined();
  expect(data.logs.length).toBe(1);
  expect(data.logs[0].level).toBe('success');
  expect(data.logs[0].title).toBe('Authentication Successful');

  const userActivePost = userSlice.select.active(clientStore.getState());
  expect(userActivePost?.$id).toBeDefined();
});
