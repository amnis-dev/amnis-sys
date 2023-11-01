import type { Meta, StoryObj } from '@storybook/react';

import { SearchInput } from './SearchInput.js';

const meta: Meta = {
  title: 'Material/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
