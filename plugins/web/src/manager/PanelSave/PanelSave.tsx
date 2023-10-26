import React from 'react';
import type { DataUpdater, UID } from '@amnis/state';
import { stateSelect } from '@amnis/state';
import {
  Button, CircularProgress, Stack, Typography,
} from '@mui/material';
import { apiCrud } from '@amnis/api';
import { useWebDispatch, useWebSelector } from '@amnis/web/react/hooks';
import { DiffSummary } from '@amnis/web/react/material';
import { ManagerContext } from '../ManagerContext.js';

export const PanelSave: React.FC = () => {
  const { locationPush } = React.useContext(ManagerContext);

  const dispatch = useWebDispatch();

  const differenceCount = useWebSelector(stateSelect.entityDifferenceCount);
  const differences = useWebSelector(stateSelect.entityDifferences);

  const disabled = React.useMemo(() => differenceCount <= 0, [differenceCount]);

  const [isUpdateLoading, isUpdateLoadingSet] = React.useState(false);

  const isLoading = React.useMemo(() => isUpdateLoading, [isUpdateLoading]);

  const handleDiffClick = React.useCallback(($id: UID) => {
    locationPush(`Difference#${$id}`);
  }, []);

  const handleUpdate = React.useCallback(() => {
    isUpdateLoadingSet(true);

    const updates = differences
      .reduce<DataUpdater>((acc, { sliceKey, updater }) => {
      if (!acc[sliceKey]) {
        acc[sliceKey] = [updater];
        return acc;
      }
      acc[sliceKey].push(updater);
      return acc;
    }, {});

    (async () => {
      await dispatch(apiCrud.endpoints.update.initiate(updates));
      isUpdateLoadingSet(false);
    })();
  }, [differences]);

  return (
    <Stack direction="column">
      <Stack direction="column">
        {disabled ? (
          <Typography>
            No changes to save.
          </Typography>
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
