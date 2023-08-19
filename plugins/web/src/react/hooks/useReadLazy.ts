import React from 'react';
import { apiCrud } from '@amnis/api/react';
import { useWebSelector } from './useWebSelector.js';

/**
 * Read data from the API in a lazy, paginated, manner.
 */
export function useReadLazy<T = any>(slice: string) {
  const result = useWebSelector(
    (state) => (state[slice as keyof typeof state] as any)?.entities,
  ) as T[];
  const [step, stepSet] = React.useState(0);
  const processing = React.useRef(false);

  /**
   * A starting point of the data fetch.
   */
  const start = React.useRef(0);

  /**
   * The limited number of items to request per step.
   */
  const limit = React.useRef(64);

  const [readTrigger] = apiCrud.useLazyReadQuery();

  React.useEffect(() => {
    (async () => {
      processing.current = true;
      await readTrigger({
        [slice]: {
          $query: {},
          $range: {
            start: (limit.current * step) + start.current,
            limit: limit.current,
          },
        },
      });
      processing.current = false;
    })();
  }, [step]);

  const trigger = React.useCallback(() => {
    if (processing.current) {
      return;
    }
    stepSet(step + 1);
  }, [step, processing.current]);

  return [result, trigger];
}

export default useReadLazy;
