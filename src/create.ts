import type { EnhancedStore } from '@reduxjs/toolkit';
import { combineSlices, configureStore } from '@reduxjs/toolkit';

export interface Sys<T extends EnhancedStore> {
  store: T;
}
/**
 * Creates a new application.
 */
export function createSystem() {
  const store = configureStore({
    reducer: combineSlices({}),
  });

  return { store } as Sys<typeof store>;
}
