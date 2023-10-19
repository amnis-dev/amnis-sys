import { stateSelect } from '@amnis/state';
import React from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useWebSelector } from '@amnis/web/react/hooks';
import { DiffSummary } from '@amnis/web/react/material';

export const PanelSave: React.FC = () => {
  const differenceCount = useWebSelector(stateSelect.entityDifferenceCount);

  const disabled = React.useMemo(() => differenceCount <= 0, [differenceCount]);

  return (
    <Stack direction="column">
      <Stack direction="column">
        {disabled ? (
          <Typography>
            No changes to save.
          </Typography>
        ) : null}
        <DiffSummary />
        <Button disabled={disabled}>
          Commit
        </Button>
      </Stack>
    </Stack>
  );
};

export default PanelSave;
