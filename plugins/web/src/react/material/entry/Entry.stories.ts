import type { Meta, StoryObj } from '@storybook/react';

import { Entry } from './Entry.js';

const meta: Meta = {
  title: 'Material/Entry',
  component: Entry,
  tags: ['autodocs'],
} satisfies Meta<typeof Entry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    label: 'My Text Entry',
    required: true,
    schema: {
      type: 'string',
      maxLength: 10,
      minLength: 0,
    },
  },
};

export const Number: Story = {
  args: {
    label: 'My Number Entry',
    required: true,
    schema: {
      type: 'number',
    },
  },
};
