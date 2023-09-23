import type { Meta, StoryObj } from '@storybook/react';

import { Navbar } from './Navbar.js';

const meta: Meta = {
  title: 'Material/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    mock: true,
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
