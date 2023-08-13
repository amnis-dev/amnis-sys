import React from 'react';
import { createPortal } from 'react-dom';
import { css } from '@emotion/react';
import { noop } from '@amnis/state';
import { Popover, Stack } from '@mui/material';

// import {
//   Popover, Stack, Breadcrumbs, Chip,
// } from '@mui/material';

export interface HighlighterProps {
  anchor?: React.RefObject<HTMLElement>;
  selected?: boolean;
  onClick?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

const cssCard = css`
  position: absolute;
  cursor: pointer;
  z-index: 1000;
  border-radius: 4px;
  padding: 0;
  opacity: 0;
  top: -5px;
  left: -5px;
  width: calc(100% + 10px);
  height: calc(100% + 10px);
  transition: opacity 0.2s ease-in-out, border-radius 0.2s ease-in-out;

  &:hover, &:focus {
    opacity: 1;
    box-shadow: 0 0 12px 4px #00000044;
    border-width: 2px;
    border-style: dashed;
    border-color: #888888;
  }
`;

const selectedStyle = {
  opacity: 1,
  boxShadow: '0 0 0 999999px #00000044',
  borderWidth: '2px',
  borderStyle: 'dashed',
  borderColor: '#888888',
};

export const Highlighter: React.FC<HighlighterProps> = ({
  anchor,
  selected = false,
  onClick = noop,
  onClose = noop,
  children,
}) => {
  const anchorPopover = React.useRef<HTMLDivElement>(null);
  const element = React.useMemo(() => anchor?.current, [anchor, anchor?.current]);

  return element ? (<>
    {createPortal(<div
      ref={anchorPopover}
      css={cssCard}
      style={selected ? selectedStyle : undefined}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      tabIndex={0}
    >&nbsp;</div>, element)}
    <Popover
      open={selected}
      anchorEl={anchorPopover.current}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Stack p={1}>
        {children}
      </Stack>
    </Popover>
  </>) : null;
};

/* <Popover
    open={focused}
    anchorEl={elAnchor.current}
    onClose={() => { focusedSet(false); }}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
  >
    <Stack p={1}>
      <Breadcrumbs>
        <Chip label={entityName} />
      </Breadcrumbs>
    </Stack>
  </Popover> */

export default Highlighter;
