import React from 'react';
import { apiCrud } from '@amnis/api/react';
import type { DataQueryProps } from '@amnis/state';
import { useWebSelectorQuery } from './useWebSelectorQuery.js';

export interface UseReadLazyOutput<T = any> {
  result: T[];
  denied: boolean;
  trigger: () => void;
}

/**
 * Read data from the API in a lazy, paginated, manner.
 */
export function useReadLazy<T = any>(
  slice: string,
  query: DataQueryProps | undefined,
): { result: T[], denied: boolean, trigger: () => void } {
  const result = useWebSelectorQuery({
    [slice]: {
      $query: query,
    },
  });

  const [step, stepSet] = React.useState(0);
  const [denied, deniedSet] = React.useState(false);
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
    if (!query) {
      return;
    }
    (async () => {
      processing.current = true;
      const { data } = await readTrigger({
        [slice]: {
          $query: query,
          $range: {
            start: (limit.current * step) + start.current,
            limit: limit.current,
          },
        },
      });

      if (data?.denied?.includes(slice)) {
        deniedSet(true);
      }

      processing.current = false;
    })();
  }, [step, !!query]);

  const trigger = React.useCallback(() => {
    if (processing.current) {
      return;
    }
    stepSet(step + 1);
  }, [step, processing.current]);

  return {
    result: (result[slice as keyof typeof result] ?? []) as T[],
    denied,
    trigger,
  };
}

export default useReadLazy;
