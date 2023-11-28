import React from 'react';
import { Box } from '@mui/material';
import type { EntitySearchAccountsProps } from '@amnis/web/react/material';
import { EntitySearchAccounts } from '@amnis/web/react/material';
import { ManagerContext } from '../ManagerContext.js';

export const PanelAccount: React.FC = () => {
  const { locationPush } = React.useContext(ManagerContext);

  const handleSelect = React.useCallback<Required<EntitySearchAccountsProps>['onSelect']>(
    (user, profile) => {
      locationPush(`Edit#${user.$id},${profile.$id}`);
    },
    [],
  );

  return (
    <Box>
      <EntitySearchAccounts onSelect={handleSelect} />
    </Box>
  );
};

export default PanelAccount;
