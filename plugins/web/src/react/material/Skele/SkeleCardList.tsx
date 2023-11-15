import React from 'react';
import { Skeleton, Stack } from '@mui/material';

export const SkeleCardList: React.FC = () => (
  <Stack width="100%" gap={1}>
    <Skeleton variant="rounded" height={80} width="100%" />
    <Skeleton variant="rounded" height={80} width="100%" />
    <Skeleton variant="rounded" height={80} width="100%" />
    <Skeleton variant="rounded" height={80} width="100%" />
  </Stack>
);

export default SkeleCardList;
