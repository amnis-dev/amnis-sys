import type { ExtractRootState, RootState } from '@amnis/state';
import type { reducers } from './set/reducers.js';

export type RootStateWeb = ExtractRootState<typeof reducers> & RootState;
