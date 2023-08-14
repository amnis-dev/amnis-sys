import type { Meta, StoryObj } from '@storybook/react';

import type { SchemaObject } from '@amnis/state';
import { Form } from './Form.js';

const meta: Meta = {
  title: 'Material/Form',
  component: Form,
  tags: ['autodocs'],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

const schema: SchemaObject = {
  title: 'Test form',
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    age: {
      type: 'number',
    },
  },
};

export const Default: Story = {
  args: {
    schema,
  },
};
