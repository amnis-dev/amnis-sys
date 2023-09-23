import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Navbar, WebContext } from '@amnis/web/react';

import { Manager } from './Manager.js';

const meta: Meta = {
  title: 'Manager/Manager',
  component: Manager,
  parameters: {
    layout: 'fullscreen',
    mock: true,
  },
} satisfies Meta<typeof Manager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: any) => {
    const { managerSet } = React.useContext(WebContext);

    React.useEffect(() => {
      managerSet(args.manager);
    }, [managerSet, args.manager]);

    return (
      <Navbar />
    );
  },
  args: {
    manager: true,
  },
};
