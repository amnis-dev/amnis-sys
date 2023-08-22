import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Navbar, WebProvider } from '@amnis/web/react';
import { Crystalizer } from './Crystalizer.js';

const meta: Meta = {
  title: 'Crystalizer/Crystalizer',
  component: Crystalizer,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Crystalizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WebProvider
      manager={true}
      ManagerDynamic={React.lazy(async () => ({ default: Crystalizer }))}
    >
      <Navbar />
    </WebProvider>
  ),
};
