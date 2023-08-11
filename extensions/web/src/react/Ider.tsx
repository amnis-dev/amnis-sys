import React from 'react';
import { type Entity } from '@amnis/state';
import type { WebContextIderEntities } from './WebContext.js';
import { useIder } from './hooks/index.js';

export function iderEn<E extends Entity>(
  entity?: E,
  prop?: keyof E,
): [entity: Entity, prop: keyof Entity] {
  return [entity as Entity, prop as keyof Entity];
}

export interface IderProps {
  entities?: WebContextIderEntities;
  children: React.ReactElement;
}

export const Ider = ({
  entities,
  children,
}: IderProps) => {
  const ref = useIder<HTMLElement>(entities as WebContextIderEntities);
  React.Children.only(children);

  // const { crystalizer } = React.useContext(WebContext);

  return React.cloneElement(children, {
    ref,
    style: {
      ...children.props.style,
      position: 'relative',
    },
  });
};
