import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Container } from '@mui/material';
import { WebProvider } from '@amnis/web';
import { Localization } from './Localization.js';

const meta: Meta = {
  title: 'Crystalizer/Localization',
  component: Localization,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.FC) => (
      <Container maxWidth="sm">
        <Story />
      </Container>
    ),
  ],
} satisfies Meta<typeof Localization>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
