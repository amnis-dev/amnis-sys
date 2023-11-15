import React from 'react';
import {
  Box, Popover, Popper, Stack, css,
} from '@mui/material';
import { ManagerProvider } from '@amnis/web/manager';
import { WebContext, type WebContextIderEntities } from '@amnis/web/react/context';
import {
  useId, usePopover,
} from '@amnis/web/react/hooks';
import { IderEntityChips } from './IderEntityChips.js';
import { IderInput } from './IderInput.js';
import { Text } from '../Text/index.js';

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
  box-sizing: content-box;
  top: -4px;
  left: -4px;
  padding: 2px;
  cursor: pointer;
  z-index: 900;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  background: none;
  box-shadow: 0 0 0 0 #00000044;
  border-width: 2px;
  border-style: dashed;
  border-color: #888888;
  line-height: inherit;
  margin: 0;

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

  const { manager } = React.useContext(WebContext);

  const element = React.useMemo(() => refAnchor.current, [refAnchor.current]);
  const entity = React.useMemo(() => entities[entities.length - 1][0], [entities]);
  const prop = React.useMemo(() => entities[entities.length - 1][1], [entities]);

  const timerRef1 = React.useRef<NodeJS.Timeout | null>(null);
  const timerRef2 = React.useRef<NodeJS.Timeout | null>(null);

  const [trigger, triggerSet] = React.useState(0);

  const {
    popoverOpen,
    buttonProps,
    popoverProps,
    handleOpen: handlePopoverOpen,
    handleClose: handlePopoverClose,

  } = usePopover(`ider-${id}`, {
    closePreventDefault: true,
    closeStopPropagation: true,
  });

  /**
   * Efficiently get the computed display of the child element.
   */
  const refDisplayed = React.useMemo(
    () => (element ? window.getComputedStyle(element).display !== 'none' : false),
    [element, trigger],
  );

  const [refPosition, setRefPosition] = React.useState(basePosition);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!element || !refDisplayed) {
        setRefPosition(basePosition);
      } else {
        const {
          top, left, width, height,
        } = element.getBoundingClientRect();
        setRefPosition({
          top, left, width, height,
        });
      }
    }, 100);

    // Clear the timeout if the component is unmounted or if any dependencies change
    return () => clearTimeout(timeoutId);
  }, [element, trigger, refDisplayed, entities, manager]);

  /**
   * Listens for window resize events and triggers a two-stage re-render timer.
   */
  React.useEffect(() => {
    function incrementTrigger() {
      triggerSet(trigger + 1);
    }

    window.addEventListener('resize', incrementTrigger);

    if (!timerRef1.current) {
      timerRef1.current = setTimeout(incrementTrigger, 250);
    }
    if (!timerRef2.current) {
      timerRef2.current = setTimeout(incrementTrigger, 500);
    }

    return () => {
      window.removeEventListener('resize', incrementTrigger);
      if (timerRef1.current) {
        clearTimeout(timerRef1.current);
      }
      if (timerRef2.current) {
        clearTimeout(timerRef2.current);
      }
    };
  }, [trigger]);

  return (
    <>
      <Popper
        key={trigger}
        open={true}
        anchorEl={element}
        placement="left-start"
        sx={{ zIndex: 1200 }}
        role="generic"
      >
        <button
          css={cssHighlighter}
          style={{
            opacity: popoverOpen ? 1 : undefined,
            boxShadow: popoverOpen ? '0 0 12px 999999px #00000044' : undefined,
            height: refPosition.height ?? 0,
            width: refPosition.width ?? 0,
          }}
          {...buttonProps}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handlePopoverOpen(e);
          }}
        />
      </Popper>
      <ManagerProvider>
        <Popover
          style={{ zIndex: 1200 }}
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
          <Box p={2}>
            <Box pl={1} pr={1} mb={1}>
              <Text variant="caption" sx={{ opacity: 0.5 }}>
                {entity?.$id}
              </Text>
            </Box>
            <Stack direction="column" gap={2}>
              <IderEntityChips
                entities={entities}
                onClick={() => handlePopoverClose({} as any)}
              />
              <IderInput
                entity={entity}
                prop={prop}
              />
            </Stack>
          </Box>
        </Popover>
      </ManagerProvider>
    </>
  );
};
