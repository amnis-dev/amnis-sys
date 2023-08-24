import { noop } from '@amnis/state';
import { Chip, Slide, Stack } from '@mui/material';
import React from 'react';

export interface ModeChipProps {
  label: string;
  show?: boolean;
  onDelete?: () => void;
}

export const ModeChip: React.FC<ModeChipProps> = ({
  label,
  show = false,
  onDelete = noop,
}) => (
  <Slide direction="down" in={show} mountOnEnter unmountOnExit>
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        width: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      <Chip
        label={label}
        onDelete={onDelete}
        color="info"
        size="small"
      />
    </Stack>
  </Slide>
);

export default ModeChip;
