import type { Meta, StoryObj } from '@storybook/react';

import { systemSlice } from '@amnis/state';
import { useWebSelector } from '@amnis/web/react/hooks';
import type { EntityFormProps } from './EntityForm.js';
import { EntityForm } from './EntityForm.js';

const meta: Meta = {
  title: 'Material/EntityForm',
  component: EntityForm,
  parameters: {
    mock: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EntityForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: EntityFormProps) => {
    const system = useWebSelector(systemSlice.select.active);

    return <EntityForm $id={system?.$id} />;
  },
};
