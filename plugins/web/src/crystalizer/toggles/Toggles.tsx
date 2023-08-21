import { noop } from '@amnis/state';
import {
  DataObject,
  Laptop,
  PhoneAndroid,
  Tablet,
  Widgets,
} from '@mui/icons-material';
import type {
  Theme,
} from '@mui/material';
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import React from 'react';

export type TogglesWebSelect = 'data' | 'component';

export type TogglesScreenSelect = 'mobile' | 'tablet' | 'desktop';

export interface TogglesProps {
  webSelect?: TogglesWebSelect;
  screenSelect?: TogglesScreenSelect;
  onWebSelect?: (value: TogglesWebSelect) => void;
  onScreenSelect?: (value: TogglesScreenSelect) => void;
}

export const Toggles: React.FC<TogglesProps> = ({
  webSelect,
  screenSelect,
  onWebSelect = noop,
  onScreenSelect = noop,
}) => {
  const handleWebSelect = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, value: string) => {
      const valueNext = value;
      const result = valueNext === webSelect ? undefined : valueNext;
      onWebSelect(result as TogglesWebSelect);
    },
    [onWebSelect],
  );

  const handleScreenSelect = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, value: string) => {
      const valueNext = value;
      const result = valueNext === screenSelect ? undefined : valueNext;
      onScreenSelect(result as TogglesScreenSelect);
    },
    [onScreenSelect],
  );

  return (
    <Stack
      direction="row"
      color="white"
      alignItems="center"
      justifyContent="center"
      gap={2}
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
          <ToggleButton value="data">
            <DataObject />
          </ToggleButton>
          <ToggleButton value="component">
            <Widgets />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box>
        <ToggleButtonGroup
          size="small"
          value={screenSelect}
          exclusive
          aria-label="screen size mode"
          onChange={handleScreenSelect}
          sx={{ bgcolor: 'background.paper' }}
        >
          <ToggleButton value="desktop">
            <Laptop />
          </ToggleButton>
          <ToggleButton value="tablet">
            <Tablet />
          </ToggleButton>
          <ToggleButton value="phone">
            <PhoneAndroid />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Stack>
  );
};
