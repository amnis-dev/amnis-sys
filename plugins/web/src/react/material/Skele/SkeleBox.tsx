import React from 'react';
import { Skeleton, Stack } from '@mui/material';

export const SkeleBox: React.FC = () => (
  <Stack width="100%" gap={1}>
    <Skeleton variant="rounded" height={48} width="100%" />
  </Stack>
);

export default SkeleBox;
