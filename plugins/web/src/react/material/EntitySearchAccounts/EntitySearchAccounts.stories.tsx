import type { Meta, StoryObj } from '@storybook/react';

import { EntitySearchAccounts } from './EntitySearchAccounts.js';

const meta: Meta = {
  title: 'Material/EntitySearchAccounts',
  component: EntitySearchAccounts,
  parameters: {
    mock: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EntitySearchAccounts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <EntitySearchAccounts />,
};
