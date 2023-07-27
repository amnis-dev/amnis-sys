import { uid } from '../../../index.js';
import { storeSetup } from '../../../store.js';
import {
  handleCreate, handleSlice, handleRoot,
} from './handle.js';

/**
 * ============================================================
 */
test('should properly set a key', () => {
  expect(handleSlice.key).toEqual('handle');
});

/**
 * ============================================================
 */
test('should create a data object', () => {
  const $subject = uid('entity');
  const handle = handleCreate({
    $subject,
    name: '',
  });

  expect(handle).toEqual(
    expect.objectContaining({
      $id: expect.any(String),
      $subject,
      name: '',
    }),
  );
});

/**
 * ============================================================
 */
test('should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[handleSlice.key],
  ).toEqual(handleSlice.initialState);
});

/**
 * ============================================================
 */
test('should handle creating a new entity', () => {
  const store = storeSetup();

  const base = handleRoot();
  const action = handleSlice.action.create(base);

  store.dispatch(action);
  const entities = handleSlice.select.all(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(base));
});
