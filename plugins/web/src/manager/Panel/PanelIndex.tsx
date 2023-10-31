import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { AdminPanelSettings, Language, PeopleAlt } from '@mui/icons-material';
import { stateSelect } from '@amnis/state';
import { useWebSelector } from '@amnis/web/react/hooks';
import { ManagerContext } from '../ManagerContext.js';
import PanelCard from './PanelCard.js';

export const PanelIndex: React.FC = () => {
  const { locationPush } = React.useContext(ManagerContext);
  const differenceCount = useWebSelector(stateSelect.entityDifferenceCount);

  return (
    <Stack gap={2}>
      <Box>
        <Button
          variant="contained"
          fullWidth
          disabled={differenceCount <= 0}
          color="warning"
          onClick={() => locationPush('/Save')}
        >
          {differenceCount <= 0 ? 'No unsaved changes found' : `Save Changes (${differenceCount})`}
        </Button>
      </Box>
      <Stack direction="row" gap={2} flexWrap="wrap" alignItems="stretch">
        <PanelCard
          icon={<AdminPanelSettings fontSize="large" />}
          title="Administration"
          content="Configure import system settings that define the overall behavior of the client application and server processes."
          path="/Administration"
        />
        <PanelCard
          icon={<PeopleAlt fontSize="large" />}
          title="Accounts"
          content="Manage the user accounts that can access the application."
          path="/Accounts"
        />
        <PanelCard
          icon={<Language fontSize="large" />}
          title="Localization"
          content="Manage language translations for the application."
          path="/Localization"
        />
      </Stack>
    </Stack>
  );
};

export default PanelIndex;
