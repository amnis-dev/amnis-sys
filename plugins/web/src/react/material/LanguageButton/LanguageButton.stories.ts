import type { Meta, StoryObj } from '@storybook/react';

import { LanguageButton } from './LanguageButton.js';

const meta: Meta = {
  title: 'Material/Language Button',
  component: LanguageButton,
  parameters: {
    mock: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LanguageButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
