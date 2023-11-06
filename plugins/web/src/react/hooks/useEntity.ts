import React from 'react';
import type { Entity, UID } from '@amnis/state';
import { stateSelect } from '@amnis/state';
import { apiCrud } from '@amnis/api';
import { useWebSelector } from './useWebSelector.js';
import { useWebDispatch } from './useWebDispatch.js';

/**
 * Hook that returns an entity with a given ID.
 *
 * First, the hook checks the redux store for the entity.
 * If it is not found, it will be fetched from the API.
 */
export function useEntity<E extends Entity = Entity>(
  $id: UID<E> | string | undefined,
): E | undefined {
  const dispatch = useWebDispatch();

  const sliceKey = React.useMemo(() => $id?.split(':')[0], [$id]);

  const entity = React.useRef<E | undefined>();

  entity.current = useWebSelector(stateSelect.dataById(sliceKey ?? '', $id ?? ''));

  React.useEffect(() => {
    if (sliceKey && !entity.current) {
      dispatch(apiCrud.endpoints.read.initiate({
        [sliceKey]: {
          $query: {
            $id: {
              $eq: $id,
            },
          },
        },
      }));
    }
  }, [$id, entity.current, sliceKey]);

  return entity.current;
}

export default useEntity;
