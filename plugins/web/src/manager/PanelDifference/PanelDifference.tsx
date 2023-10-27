import React from 'react';
import { Box } from '@mui/material';
import { Diff } from '@amnis/web/react/material';
import { ManagerContext } from '../ManagerContext.js';

export const PanelDifference: React.FC = () => {
  const { location } = React.useContext(ManagerContext);

  const entityId = React.useMemo(() => location.hash || undefined, [location.hash]);

  return (
    <Box>
      <Diff $id={entityId} />
    </Box>
  );
};

export default PanelDifference;
