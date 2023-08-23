import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Box, Container, Paper } from '@mui/material';
import { ManagerProvider } from '@amnis/web/manager';
import { Localization } from './Localization.js';

const meta: Meta = {
  title: 'Manager/Localization',
  component: Localization,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.FC) => (
      <ManagerProvider>
        <Box p={4}>
          <Container maxWidth="lg">
            <Paper>
              <Story />
            </Paper>
          </Container>
        </Box>
      </ManagerProvider>
    ),
  ],
} satisfies Meta<typeof Localization>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
