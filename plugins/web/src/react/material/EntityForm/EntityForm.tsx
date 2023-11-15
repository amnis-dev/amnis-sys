import React, { useEffect } from 'react';
import {
  dataActions, dateJSON, stateSelect,
} from '@amnis/state';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import {
  useEntitySchema,
  useWebSelector,
} from '@amnis/web/react/hooks';
import { Entry, Skele } from '@amnis/web/react/material';

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
  // if (sliceKey.length === 0) return null;

  const dispatch = useDispatch();

  const entitySelector = React.useMemo(() => stateSelect.dataById(sliceKey, $id ?? ''), [sliceKey, $id]);
  const entity = useWebSelector(entitySelector);

  const [entityData, entityDataSet] = React.useState({ ...entity });
  const entitySelfUpdate = React.useRef(true);
  const updateTimer = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const handleEntityUpdate = React.useCallback((entityNext: any) => {
    entityDataSet(entityNext);
    entitySelfUpdate.current = true;

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

  useEffect(() => {
    if (entitySelfUpdate.current === false) {
      entityDataSet({ ...entity });
    }
    entitySelfUpdate.current = false;
  }, [entity]);

  const schema = useEntitySchema(entity?.$id);

  return (
    <Box width="100%">
      {schema ? (
        <Entry
          schema={schema}
          value={entityData}
          onChange={handleEntityUpdate}
        />
      ) : (
        <Skele variant='form' />
      )}
    </Box>
  );
};

export default EntityForm;
