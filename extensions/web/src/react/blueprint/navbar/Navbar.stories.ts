import type { Meta, StoryObj } from '@storybook/react';

import { Navbar } from './Navbar.js';

const meta: Meta = {
  title: 'Web Blueprint/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    routes: {
      control: {
        type: 'select',
        labels: {
          none: 'None',
          ex1: 'Example 1',
          ex2: 'Example 2',
        },
      },
      options: ['none', 'ex1', 'ex2'],
      mapping: {
        none: undefined,
        ex1: [
          ['1', null],
          ['2', null],
        ],
        ex2: [
          ['2', null],
        ],
      },
    },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
