import React from 'react';
import { Typography } from '@mui/material';
import { ManagerContext } from '../ManagerContext.js';

export const PanelDifference: React.FC = () => {
  const { location } = React.useContext(ManagerContext);

  return (
    <Typography>
      Difference for Entity {location.hash}
    </Typography>
  );
};

export default PanelDifference;
