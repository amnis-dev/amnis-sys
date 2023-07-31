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
        none: [],
        ex1: [
          [{
            $id: 'home',
            label: 'Home',
            path: '/',
            icon: 'home',
          }, null],
          [{
            $id: 'about',
            label: 'About',
            path: '/about',
            icon: 'heart',
          }, null],
        ],
        ex2: [
          [{
            $id: 'about',
            label: 'About',
            path: '/about',
            icon: 'heart',
          }, null],
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
