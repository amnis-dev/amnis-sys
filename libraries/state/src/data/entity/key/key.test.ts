import {
  keyCreate, keyRoot, keySlice,
} from './key.js';
import { storeSetup } from '../../../store.js';

/**
 * ============================================================
 */
test('key key should be is properly set', () => {
  expect(keySlice.key).toEqual('key');
});

/**
 * ============================================================
 */
test('should create a key', () => {
  const base = keyRoot();
  const key = keyCreate(base);

  expect(key).toMatchObject(base);
});

/**
 * ============================================================
 */
test('should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[keySlice.key],
  ).toEqual(keySlice.initialState);
});

/**
 * ============================================================
 */
test('should key creating a new entity', () => {
  const store = storeSetup();

  const base = keyRoot();
  const action = keySlice.action.create(base);

  store.dispatch(action);
  const entities = keySlice.select.all(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(base));
});
