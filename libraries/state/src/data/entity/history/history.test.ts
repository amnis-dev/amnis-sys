import { GrantTask } from '../../grant/index.js';
import { uid } from '../../../core/index.js';
import {
  historyCreate, historyRoot, historyMake, historySlice,
} from './history.js';
import { storeSetup } from '../../../store.js';
import type { DataDeleter, DataUpdater } from '../../data.types.js';

/**
 * ============================================================
 */
test('history key should be is properly set', () => {
  expect(historySlice.key).toEqual('history');
});

/**
 * ============================================================
 */
test('should create a history', () => {
  const historyBaseObject = historyRoot();
  const history = historyCreate(historyBaseObject);

  expect(history).toMatchObject(historyBaseObject);
});

/**
 * ============================================================
 */
test('should make history from state updater', () => {
  const profileId1 = uid('profile');
  const profileId2 = uid('profile');
  const stateUpdate: DataUpdater = {
    profile: [{
      $id: profileId1,
      nameDisplay: 'Profile 1',
    },
    {
      $id: profileId2,
      nameDisplay: 'Profile 2',
    },
    ],
  };

  const histories = historyMake(stateUpdate, GrantTask.Update);

  expect(histories).toHaveLength(2);
  expect(histories[0]).toEqual({
    $id: expect.any(String),
    $subject: profileId1,
    task: GrantTask.Update,
    mutation: {
      $id: profileId1,
      nameDisplay: stateUpdate.profile[0].nameDisplay,
    },
  });
  expect(histories[1]).toEqual({
    $id: expect.any(String),
    $subject: profileId2,
    task: GrantTask.Update,
    mutation: {
      $id: profileId2,
      nameDisplay: stateUpdate.profile[1].nameDisplay,
    },
  });
});

/**
 * ============================================================
 */
test('should make history from state deleter', () => {
  const profileId1 = uid('profile');
  const profileId2 = uid('profile');
  const stateDeleter: DataDeleter = {
    profile: [profileId1, profileId2],
  };

  const histories = historyMake(stateDeleter, GrantTask.Delete);

  expect(histories).toHaveLength(2);
  expect(histories[0]).toEqual({
    $id: expect.any(String),
    $subject: profileId1,
    task: GrantTask.Delete,
    mutation: profileId1,
  });
  expect(histories[1]).toEqual({
    $id: expect.any(String),
    $subject: profileId2,
    task: GrantTask.Delete,
    mutation: profileId2,
  });
});

/**
 * ============================================================
 */
test('should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[historySlice.key],
  ).toEqual(historySlice.initialState);
});

/**
 * ============================================================
 */
test('should history creating a new entity', () => {
  const store = storeSetup();

  const base = historyRoot();
  const action = historySlice.action.create(base);

  store.dispatch(action);
  const entities = historySlice.select.all(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(base));
});
