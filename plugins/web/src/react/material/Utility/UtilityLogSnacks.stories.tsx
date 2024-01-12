import type { Meta, StoryObj } from '@storybook/react';

import { UtilityLogSnacks } from './UtilityLogSnacks.js';

const meta: Meta = {
  title: 'Material/UtilityLogSnacks',
  component: UtilityLogSnacks,
  parameters: {
    mock: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UtilityLogSnacks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
