import { systemSlice } from '@amnis/state';
import React from 'react';
import { Box, Stack } from '@mui/material';
import { useWebSelector } from '@amnis/web/react/hooks';
import { Text } from '@amnis/web/react/material';

export const PanelAdministration: React.FC = () => {
  const system = useWebSelector(systemSlice.select.active);

  return (
    <Stack direction="column">
      <Stack direction="row" alignItems="center">
        <Box m={1} sx={{ textAlign: 'right' }}>
          <Text variant="body1">
            System Name:
          </Text>
        </Box>
        <Box flex={1} m={1} sx={{ textAlign: 'left' }}>
          <Text variant="body1">
            {system?.name}
          </Text>
        </Box>
      </Stack>
    </Stack>
  );
};

export default PanelAdministration;
