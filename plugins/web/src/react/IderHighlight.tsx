import React from 'react';
import {
  Box, Popover, Popper, css,
} from '@mui/material';
import { CrystalizerProvider } from '@amnis/web/crystalizer';
import { type WebContextIderEntities } from './WebContext.js';
import { useId, usePopover } from './hooks/index.js';
import { IderEntityChips } from './IderEntityChips.js';

export interface IderHighlightProps {
  /**
   * Reference to the anchor component.
   */
  refAnchor: React.RefObject<HTMLElement>;

  /**
   * Entities array.
   */
  entities: WebContextIderEntities;
}

const cssHighlighter = css`
  position: absolute;
  display: block;
  top: -4px;
  left: -4px;
  padding: 2px;
  cursor: pointer;
  z-index: 2000;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  background: none;
  box-shadow: 0 0 0 0 #00000044;
  border-width: 2px;
  border-style: dashed;
  border-color: #888888;

  &:hover {
    opacity: 1;
    box-shadow: 0 0 12px 4px #00000044;
  }
`;

const basePosition = {
  top: 0, left: 0, width: 0, height: 0,
};

export const IderHighlight: React.FC<IderHighlightProps> = ({
  refAnchor,
  entities,
}) => {
  const id = useId();

  const element = React.useMemo(() => refAnchor.current, [refAnchor.current]);

  const timerRef1 = React.useRef<NodeJS.Timeout | null>(null);
  const timerRef2 = React.useRef<NodeJS.Timeout | null>(null);

  const [trigger, triggerSet] = React.useState(false);

  const {
    popoverOpen,
    buttonProps,
    popoverProps,
    handleOpen: handlePopoverOpen,
  } = usePopover(`ider-${id}`);

  /**
   * Efficiently get the computed display of the child element.
   */
  const refDisplayed = React.useMemo(
    () => (element ? window.getComputedStyle(element).display !== 'none' : false),
    [element],
  );

  /**
   * Gets the child element's position.
   */
  const refPosition = React.useMemo(() => {
    if (!element || !refDisplayed) {
      return basePosition;
    }
    const {
      top, left, width, height,
    } = element.getBoundingClientRect();
    return {
      top, left, width, height,
    };
  }, [element, trigger, refDisplayed]);

  /**
   * Handles the trigger toggle.
   */
  const handleTrigger = React.useCallback(() => {
    triggerSet(!trigger);
    timerRef1.current = null;
    timerRef2.current = null;
  }, [trigger]);

  /**
   * Listens for window resize events and triggers a two-stage re-render timer.
   */
  React.useEffect(() => {
    window.addEventListener('resize', handleTrigger);

    if (!timerRef1.current) {
      timerRef1.current = setTimeout(handleTrigger, 150);
    }
    if (!timerRef2.current) {
      timerRef2.current = setTimeout(handleTrigger, 500);
    }

    return () => {
      window.removeEventListener('resize', handleTrigger);
      if (timerRef1.current) {
        clearTimeout(timerRef1.current);
      }
      if (timerRef2.current) {
        clearTimeout(timerRef2.current);
      }
    };
  }, []);

  return (
    <>
      <Popper
        open={true}
        anchorEl={element}
        placement="left-start"
        sx={{ zIndex: 4000 }}
        role="generic"
      >
        <div
          css={cssHighlighter}
          style={{
            opacity: popoverOpen ? 1 : undefined,
            boxShadow: popoverOpen ? '0 0 12px 999999px #00000044' : undefined,
            height: refPosition.height ?? 0,
            width: refPosition.width ?? 0,
          }}
          tabIndex={0}
          role="button"
          {...buttonProps}
          onClick={(e) => {
            e.stopPropagation();
            handlePopoverOpen(e);
          }}
        />
      </Popper>
      <CrystalizerProvider>
        <Popover
          style={{ zIndex: 4001 }}
          {...popoverProps}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box p={1}>
            <IderEntityChips entities={entities} />
          </Box>
        </Popover>
      </CrystalizerProvider>
    </>
  );
};
