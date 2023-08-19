import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Box, Container, Paper } from '@mui/material';
import { Localization } from './Localization.js';
import { CrystalizerProvider } from '../CrystalizerProvider.js';

const meta: Meta = {
  title: 'Crystalizer/Localization',
  component: Localization,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.FC) => (
      <CrystalizerProvider>
        <Box p={4}>
          <Container maxWidth="lg">
            <Paper>
              <Story />
            </Paper>
          </Container>
        </Box>
      </CrystalizerProvider>
    ),
  ],
} satisfies Meta<typeof Localization>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
