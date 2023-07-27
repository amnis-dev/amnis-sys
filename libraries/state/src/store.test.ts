import { storeSetup } from './store.js';
import { stateSlices } from './slices.js';

test('should setup store with all reducers and state', () => {
  const store = storeSetup();
  const state = store.getState();

  /**
   * All state keys should exist.
   */
  expect(Object.keys(state)).toEqual([
    ...Object.keys(stateSlices),
  ]);

  /**
   * Inital state should match initial states.
   */
  Object.keys(stateSlices).forEach((key) => {
    const sliceKey = key as keyof typeof stateSlices;
    expect(state[sliceKey]).toMatchObject(stateSlices[sliceKey].getInitialState());
  });
});
