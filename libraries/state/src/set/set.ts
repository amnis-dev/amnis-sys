import { reducers } from './reducers.js';
import type { ExtractRootState } from './set.types.js';

export type SetRoot = ExtractRootState<typeof reducers>;

export const set = {
  reducers,
  middleware: [],
  type: {} as SetRoot,
};

export default set;
