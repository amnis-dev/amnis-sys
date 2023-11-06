import type { Meta, StoryObj } from '@storybook/react';

import { Entry } from './Entry.js';

const meta: Meta = {
  title: 'Material/Entry',
  component: Entry,
  parameters: {
    mock: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Entry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    label: 'My Text Entry',
    required: true,
    schema: {
      type: 'string',
      maxLength: 10,
      minLength: 0,
    },
  },
};

export const Number: Story = {
  args: {
    label: 'My Number Entry',
    required: true,
    schema: {
      type: 'number',
    },
  },
};

export const Boolean: Story = {
  args: {
    label: 'My Boolean Entry',
    required: true,
    schema: {
      type: 'boolean',
      description: 'This is a boolean entry.',
    },
  },
};

export const Object: Story = {
  args: {
    label: 'My Object Entry',
    required: true,
    schema: {
      type: 'object',
      description: 'This is an object entry containing several properties.',
      properties: {
        text: {
          title: 'My Text Entry',
          type: 'string',
          description: 'This is a text entry.',
          maxLength: 10,
          minLength: 0,
        },
        number: {
          title: 'My Number Entry',
          type: 'number',
          description: 'This is a number entry.',
        },
        boolean: {
          title: 'My Boolean Entry',
          type: 'boolean',
          description: 'This is a boolean entry.',
        },
        object: {
          title: 'Nested Object',
          type: 'object',
          description: 'This is a nested object.',
          properties: {
            text: {
              title: 'My Nested Text Entry',
              type: 'string',
              description: 'This is a text entry within the nested object.',
              maxLength: 10,
              minLength: 0,
            },
          },
        },
      },
    },
  },
};

export const Array: Story = {
  args: {
    label: 'My Array Entry',
    description: 'This is an array entry.',
    required: true,
    value: ['one', 'two', 'three'],
    schema: {
      type: 'array',
      description: 'This is an array entry.',
      items: {
        type: 'string',
        title: 'My Text Entry',
        description: 'This is a text entry.',
      },
    },
  },
};
