import { storeSetup } from '../../../store.js';
import {
  bulletinCreate, bulletinSlice, bulletinRoot,
} from './bulletin.js';

/**
 * ============================================================
 */
test('should properly set a key', () => {
  expect(bulletinSlice.key).toEqual('bulletin');
});

/**
 * ============================================================
 */
test('should create a data object', () => {
  const bulletin = bulletinCreate({
    title: 'My Title',
    markdown: 'My Markdown',
  });

  expect(bulletin).toEqual(
    expect.objectContaining({
      $id: expect.any(String),
      title: 'My Title',
      markdown: 'My Markdown',
    }),
  );
});

/**
 * ============================================================
 */
test('should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[bulletinSlice.key],
  ).toEqual(bulletinSlice.initialState);
});

/**
 * ============================================================
 */
test('should bulletin creating a new entity', () => {
  const store = storeSetup();

  const base = bulletinRoot();
  const action = bulletinSlice.action.create(base);

  store.dispatch(action);
  const entities = bulletinSlice.select.all(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(base));
});
