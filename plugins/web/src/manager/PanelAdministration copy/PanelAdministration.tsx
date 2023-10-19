import { systemSlice } from '@amnis/state';
import React from 'react';
import { Stack } from '@mui/material';
import { useWebSelector } from '@amnis/web/react/hooks';
import { EntityForm } from '@amnis/web/react/material';

export const PanelAdministration: React.FC = () => {
  const system = useWebSelector(systemSlice.select.active);

  return (
    <Stack direction="column">
      <Stack direction="row" alignItems="center">
        <EntityForm $id={system?.$id} />
      </Stack>
    </Stack>
  );
};

export default PanelAdministration;
