import type { EnhancedStore } from '@reduxjs/toolkit';
import { combineSlices, configureStore } from '@reduxjs/toolkit';

export interface Application<T extends EnhancedStore> {
  store: T;
}
// Updated
export function createApplication() {
  const store = configureStore({
    reducer: combineSlices({}),
  });

  return { store } as Application<typeof store>;
}
