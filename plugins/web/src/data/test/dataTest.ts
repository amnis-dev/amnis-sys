import type { StateDataPromise } from '@amnis/state';
import { data } from '@amnis/web/data';

export const dataTest: StateDataPromise = async (previous) => {
  const production = await data(previous);

  /**
   * Create this initial history.
   */
  return {
    ...previous,
    ...production,
  };
};

export default dataTest;
