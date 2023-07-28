import { mockService } from '@amnis/mock';
import type {
  Entity,
  History,
  Profile,
} from '@amnis/state';
import {
  historySlice,
  profileSlice,
  accountsGet,
  agentUpdate,
} from '@amnis/state';
import { apiAuth } from '../../auth/index.js';
import { apiSys } from '../../sys/index.js';
import { apiCrud } from '../index.js';
import { serviceConfig } from './config.js';
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

test('should be able to update user profile', async () => {
  /**
   * Get the user account information.
   */
  const { admin } = await accountsGet();

  await agentUpdate({
    credentialId: admin.credential.$id,
    publicKey: admin.credential.publicKey,
    privateKey: admin.privateKey,
  });

  await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: admin.handle,
    password: admin.password,
  }));

  /**
   * Read profiles to put them in the state.
   */
  await clientStore.dispatch(apiCrud.endpoints.read.initiate({
    [profileSlice.key]: {
      $query: {},
    },
  }));

  const profiles = profileSlice.select.all(clientStore.getState());
  expect(profiles).toHaveLength(3);

  const userProfile = profiles.find((profile) => profile.nameDisplay === 'User');
  if (!userProfile) {
    expect(userProfile).toBeDefined();
    return;
  }
  expect(userProfile.committed).toBe(true);

  /**
   * Update the user profile locally.
   */
  clientStore.dispatch(profileSlice.action.update({ $id: userProfile.$id, nameDisplay: 'UserUp' }));
  const userProfileUp1 = profileSlice.select.byId(clientStore.getState(), userProfile.$id);
  const {
    original: userProfileUp1Original,
    changes: userProfileUp1Changes,
  } = profileSlice.select.difference(clientStore.getState(), userProfile.$id);
  if (!userProfileUp1) {
    expect(userProfileUp1).toBeDefined();
    return;
  }
  expect(userProfileUp1.nameDisplay).toBe('UserUp');
  expect(userProfileUp1.committed).toBe(false);
  expect(userProfileUp1Original).toMatchObject(userProfile);
  expect(userProfileUp1Changes).toMatchObject({ nameDisplay: 'UserUp' });

  /**
   * Update to match the original object.
   */
  clientStore.dispatch(profileSlice.action.update({ $id: userProfile.$id, nameDisplay: 'User' }));
  const userProfileUp2 = profileSlice.select.byId(clientStore.getState(), userProfile.$id);
  const {
    original: userProfileUp2Original,
    changes: userProfileUp2Changes,
  } = profileSlice.select.difference(clientStore.getState(), userProfile.$id);
  if (!userProfileUp2) {
    expect(userProfileUp2).toBeDefined();
    return;
  }
  expect(userProfileUp2.nameDisplay).toBe('User');
  expect(userProfileUp2.committed).toBe(true);
  expect(userProfileUp2Original).toBeUndefined();
  expect(userProfileUp2Changes).toEqual({});

  /**
   * Last local update...
   */
  clientStore.dispatch(profileSlice.action.update({ $id: userProfile.$id, nameDisplay: 'UserUpdated' }));
  const userProfileUp3 = profileSlice.select.byId(clientStore.getState(), userProfile.$id);
  const {
    original: userProfileUp3Original,
    changes: userProfileUp3Changes,
    updater: userProfileUp3Update,
  } = profileSlice.select.difference(clientStore.getState(), userProfile.$id);
  if (!userProfileUp3) {
    expect(userProfileUp3).toBeDefined();
    return;
  }
  expect(userProfileUp3.nameDisplay).toBe('UserUpdated');
  expect(userProfileUp3.committed).toBe(false);
  expect(userProfileUp3Original).toMatchObject(userProfile);
  expect(userProfileUp3Changes).toEqual({ nameDisplay: 'UserUpdated' });

  /**
   * Push update to the mocked server.
   */
  const resultUpdate = await clientStore.dispatch(
    apiCrud.endpoints.update.initiate({
      [profileSlice.key]: [userProfileUp3Update],
    }),
  );
  if ('error' in resultUpdate) {
    expect(resultUpdate.error).toBeUndefined();
    return;
  }

  const { data } = resultUpdate;
  const profileUpdated = data.result?.[profileSlice.key][0] as Entity<Profile>;
  const profileHistory = data.result?.[historySlice.key][0] as Entity<History>;
  if (!profileUpdated || !profileHistory) {
    expect(profileUpdated).toBeDefined();
    expect(profileHistory).toBeDefined();
    return;
  }

  expect(profileUpdated.committed).toBe(true);
  expect(profileHistory.mutation).toMatchObject({
    nameDisplay: 'UserUpdated',
  });

  const profileClient = profileSlice.select.byId(
    clientStore.getState(),
    userProfileUp3Update.$id,
  );
  expect(profileClient).toMatchObject(profileUpdated);

  const historyClient = historySlice.select.byId(
    clientStore.getState(),
    profileHistory.$id,
  );
  expect(historyClient).toMatchObject(profileHistory);
});
