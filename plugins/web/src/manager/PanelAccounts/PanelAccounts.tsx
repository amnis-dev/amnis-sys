import React from 'react';
import { Box } from '@mui/material';
import { EntitySearchAccounts } from '@amnis/web';
import { ManagerContext } from '../ManagerContext.js';

export const PanelAccount: React.FC = () => {
  const { location } = React.useContext(ManagerContext);

  return (
    <Box>
      <EntitySearchAccounts />
    </Box>
  );
};

export default PanelAccount;
