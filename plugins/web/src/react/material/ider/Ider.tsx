import React from 'react';
import { type Entity } from '@amnis/state';
import { WebContext, type WebContextIderEntities } from '@amnis/web/react/context';
import { IderHighlight } from './IderHighlight.js';

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
  React.Children.only(children);

  const { crystalizer } = React.useContext(WebContext);

  const ref = React.useRef<HTMLElement>(null);

  return React.cloneElement(children, {
    ref,
    style: {
      ...children.props.style,
      position: 'relative',
    },
    children: (crystalizer === true) ? (<>
      {children.props.children}
      <IderHighlight refAnchor={ref} entities={entities ?? []} />
    </>
    ) : children.props.children,
  });
};
