import {
  appSlice,
} from './app.slice.js';

import { storeSetup } from '../../store.js';

/**
 * ============================================================
 */
test('app should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[appSlice.key],
  ).toEqual(appSlice.initialState);
});
