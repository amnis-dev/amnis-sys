import {
  Backdrop, Box, CircularProgress, Stack, Typography,
} from '@mui/material';
import React from 'react';

export interface BackdropProgressProps {
  /**
   * Title of the progress.
   */
  title?: string;

  /**
   * Subtitle of the progress.
   */
  subtitle?: string;

  /**
   * Whether the backdrop is open.
   *
   * @default true
   */
  open?: boolean;
}

/**
 * A backdrop with a circluar progress in the background.
 */
export const BackdropProgress: React.FC<BackdropProgressProps> = ({
  title = 'Loading',
  subtitle = 'Please wait while we load some content',
  open = true,
}) => (
  <Backdrop
    sx={{ color: '#fff', backgroundColor: '#888888' }}
    open={open}
  >
    <Stack alignItems="center" sx={{ position: 'relative' }}>
      <Box sx={{
        position: 'absolute', opacity: 0.5, top: -75, zIndex: -1,
      }}>
        <CircularProgress size={256} thickness={4} />
      </Box>
      <Stack alignItems="center" gap={2}>
        <Typography variant="h2" sx={{ margin: 0, padding: 0 }}>{title}</Typography>
        <Typography variant="subtitle1">{subtitle}</Typography>
      </Stack>
    </Stack>
  </Backdrop>
);

export default BackdropProgress;
