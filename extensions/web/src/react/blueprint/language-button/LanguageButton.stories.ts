import type { Meta, StoryObj } from '@storybook/react';

import { LanguageButton } from './LanguageButton.js';

const meta: Meta = {
  title: 'Web Blueprint/Language Button',
  component: LanguageButton,
  tags: ['autodocs'],
} satisfies Meta<typeof LanguageButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
