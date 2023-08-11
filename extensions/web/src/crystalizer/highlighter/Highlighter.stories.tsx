import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import { Highlighter } from './Highlighter.js';
import { websiteSlice } from '../../set/entity/index.js';

const meta: Meta = {
  title: 'Crystalizer/Highlighter',
  component: Highlighter,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Highlighter>;

export default meta;
type Story = StoryObj<typeof meta>;

const websiteEntity = websiteSlice.createEntity({
  title: 'My Website',
});

export const Default: Story = {
  render: () => {
    const anchor = React.useRef<HTMLDivElement>(null);

    console.log({ anchor });

    return (<div>
      <div ref={anchor}>
        <button>{websiteEntity.title}</button>
      </div>
      <Highlighter anchor={anchor} />

    </div>
    );
  },
};
