import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Crystalizer } from './Crystalizer.js';
import { Navbar, WebProvider } from '../react/index.js';

const meta: Meta = {
  title: 'Crystalizer/Crystalizer',
  component: Crystalizer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Crystalizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WebProvider
      crystalizer={true}
      CrystalizerDynamic={React.lazy(async () => ({ default: Crystalizer }))}
    >
      <Navbar />
    </WebProvider>
  ),
};
