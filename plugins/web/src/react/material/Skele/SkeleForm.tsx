import React from 'react';
import { Skeleton, Stack } from '@mui/material';

export const SkeleForm: React.FC = () => (
  <Stack width="100%" gap={1}>
    <Skeleton variant="rounded" height={42} width="32%" />
    <Skeleton variant="rounded" height={24} width="64%" />
    <br />
    <Skeleton variant="rounded" height={24} width="20%" />
    <Skeleton variant="rounded" height={18} width="80%" />
    <Skeleton variant="rounded" height={40} />
    <br />
    <Skeleton variant="rounded" height={24} width="32%" />
    <Skeleton variant="rounded" height={18} width="60%" />
    <Skeleton variant="rounded" height={40} />
  </Stack>
);

export default SkeleForm;
