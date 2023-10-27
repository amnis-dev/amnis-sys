import React from 'react';
import type { Entity } from '@amnis/state';
import {
  dataActions, dateJSON,
} from '@amnis/state';
import type { EntityState } from '@amnis/state/rtk';
import { useDispatch } from 'react-redux';
import {
  useEntitySchema,
  useWebSelector,
} from '@amnis/web/react/hooks';
import { Entry } from '@amnis/web/react/material';

export interface EntityFormProps {
  /**
   * Entity ID
   */
  $id?: string;
}

export const EntityForm: React.FC<EntityFormProps> = ({
  $id,
}) => {
  const sliceKey = React.useMemo(() => $id?.split(':')[0] ?? '', [$id]);
  if (sliceKey.length === 0) return null;

  const dispatch = useDispatch();

  const entity = useWebSelector((state) => {
    const entities = (
      state[sliceKey as keyof typeof state] as EntityState<Entity, string>
    )?.entities;

    if (!entities) return undefined;
    return entities[$id as string];
  });

  const [entityData, entityDataSet] = React.useState({ ...entity });
  const updateTimer = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const handleEntityUpdate = React.useCallback((entityNext: any) => {
    entityDataSet(entityNext);

    /**
     * Trigger a timer to update the entity data.
     */
    if (updateTimer.current) clearTimeout(updateTimer.current);
    updateTimer.current = setTimeout(() => {
      dispatch(dataActions.update({
        [sliceKey]: [{
          ...entityNext,
          updated: dateJSON(),
        }],
      }));
    }, 160);
  }, [entityDataSet]);

  const schema = useEntitySchema(entity?.$id);

  return (
    <div>
      <Entry
        schema={schema}
        value={entityData}
        onChange={handleEntityUpdate}
      />
    </div>
  );
};

export default EntityForm;
