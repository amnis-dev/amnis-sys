import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import { systemSlice } from '@amnis/state';
import { useWebSelector, useWebDispatch } from '@amnis/web/react/hooks';
import { websiteSlice } from '@amnis/web/set';
import { DiffSummary } from './DiffSummary.js';

const meta: Meta = {
  title: 'Material/DiffSummary',
  component: DiffSummary,
  parameters: {
    mock: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DiffSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const dispatch = useWebDispatch();
    const system = useWebSelector(systemSlice.select.active);
    const website = useWebSelector(websiteSlice.select.active);

    React.useEffect(() => {
      if (!system) return;

      dispatch(systemSlice.action.update({
        $id: system?.$id,
        name: 'Updated System',
      }));
    }, [system]);

    React.useEffect(() => {
      if (!website) return;

      dispatch(websiteSlice.action.update({
        $id: website?.$id,
        title: 'Updated Website',
      }));
    }, [website]);

    React.useEffect(() => {
      dispatch(websiteSlice.action.create(websiteSlice.createEntity({
        title: 'New Website',
      })));
    }, []);

    return <DiffSummary />;
  },
};
