import { otpBase, otpSlice } from './otp.js';

import { storeSetup } from '../../store.js';

/**
 * ============================================================
 */
test('otps should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[otpSlice.key],
  ).toEqual(otpSlice.initialState);
});

/**
 * ============================================================
 */
test('should handle creating a new otps', () => {
  const store = storeSetup();

  const base = otpBase();
  const action = otpSlice.action.create(base);

  store.dispatch(action);
  const entities = otpSlice.select.all(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(base));
});
