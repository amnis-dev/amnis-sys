import type { EnhancedStore } from '@amnis/state/rtk';
import { combineSlices, configureStore } from '@amnis/state/rtk';

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
