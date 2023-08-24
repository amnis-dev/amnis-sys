import { noop } from '@amnis/state';
import {
  DataObject,
  Widgets,
} from '@mui/icons-material';
import {
  Box,
  Grow,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import React from 'react';
import type { WebContext } from '@amnis/web/react/context';
import { ManagerContext } from '../ManagerContext.js';

export interface TogglesProps {
  webSelect?: WebContext['webSelect'];
  onWebSelect?: WebContext['webSelectSet'];
}

export const Toggles: React.FC<TogglesProps> = ({
  webSelect,
  onWebSelect = noop,
}) => {
  const { locale } = React.useContext(ManagerContext);

  const handleWebSelect = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, value: string) => {
      const valueNext = value;
      const result = (!webSelect && valueNext === webSelect) ? undefined : valueNext;
      onWebSelect(result as WebContext['webSelect']);
    },
    [onWebSelect],
  );

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{
        position: 'absolute',
        width: '100%',
        left: 0,
        bottom: 16,
        zIndex: 100,
      }}
    >
      <Box>
        <Grow in={true}>
          <ToggleButtonGroup
            size="small"
            value={webSelect}
            exclusive
            aria-label="website selection mode"
            onChange={handleWebSelect}
            sx={{ bgcolor: 'background.paper' }}
          >

            <ToggleButton value="data" color={webSelect === 'data' ? 'info' : undefined}>
              <Tooltip title={locale?.['web:manager:state_data_select_button'] ?? '...'} placement='top'>
                <DataObject />
              </Tooltip>
            </ToggleButton>

            <ToggleButton value="component" color={webSelect === 'component' ? 'info' : undefined}>
              <Tooltip title={locale?.['web:manager:state_component_select_button'] ?? '...'} placement='top'>
                <Widgets />
              </Tooltip>
            </ToggleButton>

          </ToggleButtonGroup>
        </Grow>
      </Box>
    </Stack>
  );
};
