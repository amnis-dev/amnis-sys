import type { Meta, StoryObj } from '@storybook/react';

import { Entry } from './Entry.js';

const meta: Meta = {
  title: 'Material/Entry',
  component: Entry,
  tags: ['autodocs'],
} satisfies Meta<typeof Entry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'text',
    label: 'My Entry',
  },
};
