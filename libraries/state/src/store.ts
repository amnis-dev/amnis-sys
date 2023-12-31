import { combineReducers, configureStore } from '@amnis/state/rtk';
import { set as stateSet } from './set/set.js';

/**
 * Configures a default store.
 */
export function storeSetup() {
  const rootReducer = combineReducers({ ...stateSet.reducers });

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat([...stateSet.middleware])
    ),
  });

  return store;
}

export const store = storeSetup();

export type RootState = ReturnType<typeof store.getState>;

export type RootStateSelectors = Record<string, (state: RootState, ...args: unknown[]) => unknown>;
