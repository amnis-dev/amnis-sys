import type { Meta, StoryObj } from '@storybook/react';

import { ButtonLanguage } from './ButtonLanguage.js';

const meta: Meta = {
  title: 'Web Blueprint/Buttons/Language',
  component: ButtonLanguage,
  tags: ['autodocs'],
} satisfies Meta<typeof ButtonLanguage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
