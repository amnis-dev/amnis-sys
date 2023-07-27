import { challengeBase, challengeCreate, challengeSlice } from './challenge.js';

import { storeSetup } from '../../store.js';

/**
 * ============================================================
 */
test('challenges should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[challengeSlice.key],
  ).toEqual(challengeSlice.initialState);
});

/**
 * ============================================================
 */
test('should handle creating a new challenges', () => {
  const store = storeSetup();

  const action = challengeSlice.action.create(challengeCreate(challengeBase()));

  store.dispatch(action);
  const entities = challengeSlice.select.all(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    exp: expect.any(Number),
  }));
});
