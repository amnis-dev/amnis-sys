import React from 'react';

import type {
  MaybeElement,
} from '@blueprintjs/core';
import {
  Navbar as BpNavbar,
  Alignment,
  Button,
} from '@blueprintjs/core';

import { websiteSlice } from '../../../set/entity/index.js';

import { useTranslate, useWebSelector } from '../../hooks/index.js';
import { placehold } from '../../../utility/index.js';
import type { NavbarProps } from '../../../interface/Navbar.types.js';

import { skeleton } from '../blueprint.utility.js';

export const Navbar: React.FC<NavbarProps> = ({
  title: propsTitle,
  titleHide = false,
  routes = [],
  routesHide = false,
}) => {
  const website = useTranslate(useWebSelector(websiteSlice.select.active));

  /**
   * Use prop values if they are provided.
   */
  const title = React.useMemo(() => propsTitle || website?.title, [propsTitle, website]);

  return (
    <BpNavbar style={{ padding: '0 5vw 0 5vw' }}>
      <BpNavbar.Group align={Alignment.LEFT}>
        {titleHide
          ? null
          : <BpNavbar.Heading className={skeleton(title)}>{placehold(title, 12)}</BpNavbar.Heading>}
      </BpNavbar.Group>
      <BpNavbar.Group align={Alignment.RIGHT}>
        {(!routesHide && routes.length) ? routes.map(([route]) => (
          <Button key={route.$id} minimal icon={route.icon as MaybeElement} text={route.label} />
        )) : null}
      </BpNavbar.Group>

    </BpNavbar>
  );
};

export default Navbar;
