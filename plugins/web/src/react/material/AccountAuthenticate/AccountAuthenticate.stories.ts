import type { Meta, StoryObj } from '@storybook/react';

import { AccountAuthenticate } from './AccountAuthenticate.js';

const meta: Meta = {
  title: 'Material/Account Authenticate',
  component: AccountAuthenticate,
  parameters: {
    mock: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccountAuthenticate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
