import React from 'react';
import { Card } from '@blueprintjs/core';
import type { Entity } from '@amnis/state';

export interface HighlighterProps<E extends Entity> {
  entity: E;
  prop?: string;
  children: React.ReactNode;
}

export const Highlighter = <E extends Entity>({
  children,
}: HighlighterProps<E>) => {
  const [hovering, hoveringSet] = React.useState(false);

  return (
    <div
      onMouseEnter={() => { hoveringSet(true); }}
      onMouseLeave={() => { hoveringSet(false); }}
      style={{
        position: 'relative',
      }}
    >
      {children}
      <Card
        onMouseOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        interactive
        style={{
          position: 'absolute',
          cursor: 'pointer',
          zIndex: 9999,
          borderWidth: hovering ? 1 : undefined,
          borderStyle: hovering ? 'dashed' : undefined,
          borderColor: hovering ? 'inherit' : undefined,
          boxShadow: hovering ? undefined : 'none',
          border: 'none',
          borderRadius: 4,
          background: 'none',
          padding: 0,
          top: -5,
          left: -5,
          width: 'calc(100% + 10px)',
          height: 'calc(100% + 10px)',
        }}
      />
    </div>);
};

export default Highlighter;
