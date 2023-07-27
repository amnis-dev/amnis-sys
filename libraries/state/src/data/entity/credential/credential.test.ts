import { storeSetup } from '../../../store.js';
import {
  credentialCreate, credentialSlice, credentialRoot,
} from './credential.js';

/**
 * ============================================================
 */
test('should properly set a key', () => {
  expect(credentialSlice.key).toEqual('credential');
});

/**
 * ============================================================
 */
test('should create a data object', () => {
  const credential = credentialCreate({
    name: '',
    publicKey: '',
  });

  expect(credential).toEqual(
    expect.objectContaining({
      name: '',
      publicKey: '',
    }),
  );
});

/**
 * ============================================================
 */
test('should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[credentialSlice.key],
  ).toEqual(credentialSlice.initialState);
});

/**
 * ============================================================
 */
test('should handle creating a new entity', () => {
  const store = storeSetup();

  const base = credentialRoot();
  const action = credentialSlice.action.create(base);

  store.dispatch(action);
  const entities = credentialSlice.select.all(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(base));
});
