import { mockService } from '@amnis/mock';
import {
  accountsGet,
  bearerSlice,
  contactSlice,
  profileSlice,
  sessionSlice,
  userSlice,
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

test('should be able to login and logout', async () => {
  /**
   * Get the user account information.
   */
  const { user } = await accountsGet();

  await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: user.handle,
    password: user.password,
  }));

  const sessionLoginActive = sessionSlice.select.active(clientStore.getState());

  const result = await clientStore.dispatch(apiAuth.endpoints.logout.initiate({}));

  if ('error' in result) {
    expect(result.error).toBeUndefined();
    return;
  }

  const { data } = result;
  expect(data.result?.session?.[0]).toEqual(sessionLoginActive?.$id);

  const state = clientStore.getState();
  const sessionActive = sessionSlice.select.active(state);
  const userActive = userSlice.select.active(state);
  const profileActive = profileSlice.select.active(state);
  const contactActive = contactSlice.select.active(state);

  const bearerToken = bearerSlice.select.byId(state, 'core');

  expect(sessionActive).toBeUndefined();
  expect(userActive).toBeUndefined();
  expect(profileActive).toBeUndefined();
  expect(contactActive).toBeUndefined();
  expect(bearerToken).toBeUndefined();
});
