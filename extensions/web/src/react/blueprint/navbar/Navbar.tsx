import React from 'react';

import type {
  MaybeElement,
} from '@blueprintjs/core';
import {
  Navbar as BpNavbar,
  Alignment,
  Button,
  Divider,
  ButtonGroup,
} from '@blueprintjs/core';

import type {
  UIDTree, DataTree, Data, UID,
} from '@amnis/state';
import { routeSlice } from '@amnis/state';
import { websiteSlice } from '../../../set/entity/index.js';

import { useTranslate, useWebSelector } from '../../hooks/index.js';
import { placehold } from '../../../utility/index.js';
import type { NavbarProps } from '../../../interface/Navbar.types.js';

import { skeleton } from '../blueprint.utility.js';

import { LanguageButton } from '../language-button/index.js';
import { Ider } from '../../Ider.js';

function createDataTree<D extends Data>(uidTree: UIDTree, data: Record<UID, D>): DataTree<D> {
  const map: Record<string, DataTree<D>> = {};

  // Create a placeholder for the children of each node
  uidTree.forEach(([$id]) => {
    map[$id] = [];
  });

  // Fill the placeholders with the actual data and children
  uidTree.forEach(([$id, $parent]) => {
    if (!data[$id] || !map[$id]) {
      return;
    }
    const node: [item: D, children: DataTree<D>] = [data[$id], map[$id]];
    if ($parent === null) {
      map[$id].push(node);
    } else {
      map[$parent].push(node);
    }
  });

  // The root nodes are those that are pushed into themselves
  return Object.values(map).flat().filter((node) => node[1] === map[node[0].$id]);
}

export const Navbar: React.FC<NavbarProps> = ({
  titleHide = false,
  routesHide = false,
}) => {
  const website = useTranslate(useWebSelector(websiteSlice.select.active));
  const routes = useTranslate(useWebSelector(routeSlice.select.entities));

  /**
   * Use prop values if they are provided.
   */
  const title = React.useMemo(() => website?.title, [website]);
  const routeTree = React.useMemo(() => {
    const r = website?.$routes ?? [];
    const tree = createDataTree(r, routes);
    return tree;
  }, [website, routes]);

  return (
    <BpNavbar className="navbar" style={{ padding: '0 5vw 0 5vw' }}>
      <BpNavbar.Group align={Alignment.LEFT}>
        {titleHide
          ? null
          : (
            <Ider entity={website} prop="title">
              <BpNavbar.Heading
                style={{ fontSize: '1.18rem' }}
                className={skeleton(title)}>
                {placehold(title, 12)}
              </BpNavbar.Heading>
            </Ider>
          )
        }
      </BpNavbar.Group>
      <BpNavbar.Group align={Alignment.RIGHT}>
        <ButtonGroup minimal vertical={false}>
          <Ider entity={website} prop="$routes">
            {(!routesHide && routeTree.length) ? routeTree.map(([route]) => (
              <Button
                key={route.$id}
                minimal
                icon={route.icon as MaybeElement}
                text={route.label}
              />
            )) : null}
          </Ider>
          <Divider />
          <LanguageButton hideText />
        </ButtonGroup>
      </BpNavbar.Group>

    </BpNavbar>
  );
};

export default Navbar;
