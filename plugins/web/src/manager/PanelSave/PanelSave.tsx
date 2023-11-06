import React from 'react';
import type { DataUpdater, UID, DataCreator } from '@amnis/state';
import { entityStrip, stateSelect } from '@amnis/state';
import {
  Button, CircularProgress, Stack,
} from '@mui/material';
import { apiCrud } from '@amnis/api';
import { useWebDispatch, useWebSelector } from '@amnis/web/react/hooks';
import { DiffSummary, Text } from '@amnis/web/react/material';
import { ManagerContext } from '../ManagerContext.js';

export const PanelSave: React.FC = () => {
  const { locationPush } = React.useContext(ManagerContext);

  const dispatch = useWebDispatch();

  const stagedCount = useWebSelector(stateSelect.stagedCount);
  const stagedCreate = useWebSelector(stateSelect.stagedCreate);
  const stagedUpdate = useWebSelector(stateSelect.stagedUpdate);
  const differences = useWebSelector(stateSelect.entityDifferences);

  const disabled = React.useMemo(() => stagedCount <= 0, [stagedCount]);

  const [isUpdateLoading, isUpdateLoadingSet] = React.useState(false);

  const isLoading = React.useMemo(() => isUpdateLoading, [isUpdateLoading]);

  const handleDiffClick = React.useCallback(($id: UID) => {
    locationPush(`Difference#${$id}`);
  }, []);

  const handleUpdate = React.useCallback(() => {
    isUpdateLoadingSet(true);

    const creates = stagedCreate
      .reduce<DataCreator>((acc, entity) => {
      const creator = entityStrip(entity);
      const sliceKey = creator.$id.split(':')[0];
      if (sliceKey && !acc[sliceKey]) {
        acc[sliceKey] = [creator];
        return acc;
      }
      acc[sliceKey].push(creator);
      return acc;
    }, {});

    const updates = stagedUpdate
      .reduce<DataUpdater>((acc, { $id }) => {
      const diff = differences.find((diff) => diff.current!.$id === $id);
      if (!diff) return acc;
      const { sliceKey, updater } = diff;
      if (!acc[sliceKey]) {
        acc[sliceKey] = [updater];
        return acc;
      }
      acc[sliceKey].push(updater);
      return acc;
    }, {});

    (async () => {
      const promises: Promise<any>[] = [
        dispatch(apiCrud.endpoints.create.initiate(creates)),
        dispatch(apiCrud.endpoints.update.initiate(updates)),
      ];
      await Promise.all(promises);
      isUpdateLoadingSet(false);
    })();
  }, [differences, stagedUpdate]);

  return (
    <Stack direction="column">
      <Stack direction="column">
        {disabled ? (
          <Text>
            No changes to save.
          </Text>
        ) : null}
        <DiffSummary onClick={handleDiffClick} />
        <Button
          disabled={disabled || isLoading}
          onClick={handleUpdate}
          startIcon={isLoading ? <CircularProgress size="1rem" /> : null}
        >
          {isLoading ? 'Saving...' : 'Save All'}
        </Button>
      </Stack>
    </Stack>
  );
};

export default PanelSave;
