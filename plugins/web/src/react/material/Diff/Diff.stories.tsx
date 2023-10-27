import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import { systemSlice } from '@amnis/state';
import { useWebSelector, useWebDispatch } from '@amnis/web/react/hooks';
import { websiteSlice } from '@amnis/web/set';
import { Diff } from './Diff.js';

const meta: Meta = {
  title: 'Material/Diff',
  component: Diff,
  parameters: {
    mock: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Diff>;

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
    }, [!!system]);

    React.useEffect(() => {
      if (!website) return;

      dispatch(websiteSlice.action.update({
        $id: website?.$id,
        title: 'Updated Website',
        fontBody: 'public-sans',
      }));
    }, [!!website]);

    React.useEffect(() => {
      dispatch(websiteSlice.action.create(websiteSlice.createEntity({
        title: 'New Website',
      })));
    }, []);

    return <Diff $id={website?.$id} />;
  },
};
