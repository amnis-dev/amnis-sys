import React from 'react';
import { Box } from '@mui/material';
import { ManagerContext } from '../ManagerContext.js';

export const PanelAccount: React.FC = () => {
  const { location } = React.useContext(ManagerContext);

  return (
    <Box>
      ACCOUNTS
    </Box>
  );
};

export default PanelAccount;
