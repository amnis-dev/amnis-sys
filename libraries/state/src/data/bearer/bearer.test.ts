import {
  bearerSlice,
} from './bearer.js';

import { storeSetup } from '../../store.js';

/**
 * ============================================================
 */
test('bearer should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[bearerSlice.key],
  ).toEqual(bearerSlice.initialState);
});
