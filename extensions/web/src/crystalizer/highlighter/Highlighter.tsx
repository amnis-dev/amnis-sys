import React from 'react';
import { createPortal } from 'react-dom';
import { css } from '@emotion/react';

// import {
//   Popover, Stack, Breadcrumbs, Chip,
// } from '@mui/material';

export interface HighlighterProps {
  anchor?: React.RefObject<HTMLElement>;
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

  &:hover {
    opacity: 1;
    box-shadow: 0 0 12px 4px #00000044;
    border-width: 2px;
    border-style: dashed;
    border-color: #888888;
  }

  &:focus {
    opacity: 1;
    box-shadow: 0 0 0 999999px #00000044;
    border-width: 2px;
    border-style: dashed;
    border-color: #888888;
  }
`;

export const Highlighter: React.FC<HighlighterProps> = ({
  anchor,
}) => {
  const element = React.useMemo(() => anchor?.current, [anchor, anchor?.current]);

  return element ? (
    createPortal(<div
      css={cssCard}
      onMouseOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      tabIndex={0}
    >&nbsp;</div>, element)
  ) : null;
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
