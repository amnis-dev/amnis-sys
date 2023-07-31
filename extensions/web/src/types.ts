import type { ExtractRootState } from '@amnis/state';
import type { reducers } from './set/reducers.js';

export type RootStateWeb = ExtractRootState<typeof reducers>;
