import {
  accountsGet,
  agentUpdate,
  contactSlice,
  profileSlice,
  sessionSlice,
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

test('should be able to login as user', async () => {
  /**
   * Get the user account information.
   */
  const { user } = await accountsGet();

  const result = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: user.handle,
    password: user.password,
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
  const { user } = await accountsGet();

  const result = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: user.handle,
    password: user.password.slice(1),
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
  const { admin } = await accountsGet();

  await agentUpdate({
    credentialId: admin.credential.$id,
    publicKey: admin.credential.publicKey,
  });

  const result = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: admin.handle,
    password: admin.password,
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

/**
 * TODO: This test will fail because audits are not being saved to the database yet.
 */
// test('should see audits of login requests as admin', async () => {
//   /**
//    * Get the user account information.
//    */
//   const { admin } = await accountsGet();

//   await agentUpdate({
//     credentialId: admin.credential.$id,
//     privateKey: admin.privateKey,
//   });

//   const resultLogin = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
//     handle: admin.handle,
//     password: admin.password,
//   }));

//   if ('error' in resultLogin) {
//     expect(resultLogin.error).toBeUndefined();
//   }

//   const audits = databaseMemoryStorage()[auditKey];

//   expect(Object.keys(audits)).toHaveLength(1);
//   expect(Object.keys(audits).length).toBeGreaterThan(1);
// });
