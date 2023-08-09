import React from 'react';
import type { Entity } from '@amnis/state';
import { WebContext } from './WebContext.js';

const Highlighter = React.lazy(
  () => import('@amnis/web/crystalizer').then((module) => ({ default: module.Highlighter })),
);

export interface IderProps<E extends Entity> {
  entity?: E;
  prop?: keyof E;
  children: React.ReactNode;
}

export const Ider = <E extends Entity>({
  entity,
  prop,
  children,
}: IderProps<E>) => {
  const { crystalizer } = React.useContext(WebContext);

  // const ref = React.useRef<HTMLDivElement>(null);

  return (crystalizer && entity) ? (
    <React.Suspense fallback={<>{children}</>}>
      <Highlighter entity={entity} prop={prop as string} >
        {children}
      </Highlighter>
    </React.Suspense>
  ) : children;
};
