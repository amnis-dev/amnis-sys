import { noop } from '@amnis/state';
import {
  DataObject,
  Widgets,
} from '@mui/icons-material';
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import React from 'react';
import type { WebContext } from '@amnis/web/react/context';

export interface TogglesProps {
  webSelect?: WebContext['webSelect'];
  onWebSelect?: WebContext['webSelectSet'];
}

export const Toggles: React.FC<TogglesProps> = ({
  webSelect,
  onWebSelect = noop,
}) => {
  const handleWebSelect = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, value: string) => {
      const valueNext = value;
      const result = (!webSelect && valueNext === webSelect) ? undefined : valueNext;
      onWebSelect(result as WebContext['webSelect']);
    },
    [onWebSelect],
  );

  console.log({ webSelect });

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{
        width: '100%',
        position: 'absolute',
        left: 0,
        bottom: 16,
      }}
    >
      <Box>
        <ToggleButtonGroup
          size="small"
          value={webSelect}
          exclusive
          aria-label="website selection mode"
          onChange={handleWebSelect}
          sx={{ bgcolor: 'background.paper' }}
        >

          <ToggleButton value="data" color={webSelect === 'data' ? 'info' : undefined}>
            <Tooltip title="Data Select" placement='top'>
              <DataObject />
            </Tooltip>
          </ToggleButton>

          <ToggleButton value="component" color={webSelect === 'component' ? 'info' : undefined}>
            <Tooltip title="Component Select" placement='top'>
              <Widgets />
            </Tooltip>
          </ToggleButton>

        </ToggleButtonGroup>
      </Box>
    </Stack>
  );
};
