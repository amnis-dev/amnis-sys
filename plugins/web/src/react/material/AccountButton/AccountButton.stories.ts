import type { Meta, StoryObj } from '@storybook/react';

import { AccountButton } from './AccountButton.js';

const meta: Meta = {
  title: 'Material/Account Button',
  component: AccountButton,
  parameters: {
    mock: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccountButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
