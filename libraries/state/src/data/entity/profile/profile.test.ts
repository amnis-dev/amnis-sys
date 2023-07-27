import { uid } from '../../../core/index.js';
import { storeSetup } from '../../../store.js';
import { userSlice } from '../index.js';
import {
  profileCreate, profileSlice, profileRoot,
} from './profile.js';

/**
 * ============================================================
 */
test('profile key should be is properly set', () => {
  expect(profileSlice.key).toEqual('profile');
});

/**
 * ============================================================
 */
test('should create a profile', () => {
  const profile = profileCreate({
    nameDisplay: 'Newbie',
    $user: uid(userSlice.key),
  });

  expect(profile).toEqual(
    expect.objectContaining({
      nameDisplay: expect.any(String),
      $user: expect.any(String),
    }),
  );
});

/**
 * ============================================================
 */
test('profile should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[profileSlice.key],
  ).toEqual(profileSlice.initialState);
});

/**
 * ============================================================
 */
test('should handle creating a new profile', () => {
  const store = storeSetup();

  const action = profileSlice.action.create(profileRoot);

  store.dispatch(action);
  const entities = profileSlice.select.all(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    $user: expect.any(String),
    nameDisplay: expect.any(String),
  }));
});

/**
 * ============================================================
 */
test('should handle updating a profile', () => {
  const store = storeSetup();

  const actionCreate = profileSlice.action.create(profileRoot);

  store.dispatch(actionCreate);
  const entities1 = profileSlice.select.all(store.getState());
  const profileId = entities1[0].$id;

  const newName = 'New Profile Name';
  const actionUpdate = profileSlice.action.update({
    $id: profileId,
    nameDisplay: newName,
  });

  store.dispatch(actionUpdate);
  const entities2 = profileSlice.select.all(store.getState());

  expect(entities2[0]).toEqual(expect.objectContaining({
    nameDisplay: newName,
  }));

  expect(entities2[0]?.committed).toBe(false);

  const diff = profileSlice.select.difference(store.getState(), profileId);

  expect(diff.original).toMatchObject(entities1[0]);
  expect(diff.keys).toHaveLength(1);
  expect(diff.keys).toEqual(expect.arrayContaining(['nameDisplay']));

  expect(Object.keys(diff.changes)).toHaveLength(1);
  expect(diff.changes?.nameDisplay).toEqual(newName);

  expect(Object.keys(diff.updater)).toHaveLength(2);
  expect(diff.updater.$id).toEqual(profileId);
  expect(diff.updater?.nameDisplay).toEqual(newName);

  const newName2 = 'Even Newer Profile Name';
  const actionUpdate2 = profileSlice.action.update({
    $id: profileId,
    nameDisplay: newName2,
  });

  store.dispatch(actionUpdate2);
  const entities3 = profileSlice.select.all(store.getState());

  expect(entities3[0]?.committed).toBe(false);

  const diff2 = profileSlice.select.difference(store.getState(), profileId);

  expect(diff2.original).toMatchObject(entities1[0]);
  expect(diff2.keys).toHaveLength(1);
  expect(diff2.keys).toEqual(expect.arrayContaining(['nameDisplay']));
});
