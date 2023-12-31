import React from 'react';
import { Stack } from '@mui/material';
import { EntityForm } from '@amnis/web';
import { ManagerContext } from '../ManagerContext.js';

export const PanelEdit: React.FC = () => {
  const { location: { hash } } = React.useContext(ManagerContext);

  const entityIds = React.useMemo(() => hash?.split(',') || [], [hash]);

  return (
    <Stack gap={5}>
      {entityIds.map(($id) => (
        <EntityForm key={$id} $id={$id} />
      ))}
    </Stack>
  );
};

export default PanelEdit;
