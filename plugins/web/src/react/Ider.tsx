import React from 'react';
import { type Entity } from '@amnis/state';
import { Popper, css, Popover } from '@mui/material';
import { CrystalizerProvider } from '../crystalizer/CrystalizerProvider.js';
import { WebContext, type WebContextIderEntities } from './WebContext.js';
import { useIder, usePopover } from './hooks/index.js';

export function iderEn<E extends Entity>(
  entity?: E,
  prop?: keyof E,
): [entity: Entity, prop: keyof Entity] {
  return [entity as Entity, prop as keyof Entity];
}

const cssHighlighter = css`
  position: absolute;
  top: -4px;
  left: -4px;
  padding: 2px;
  cursor: pointer;
  z-index: 2000;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out, border-width 0.2s ease-in-out;
  background: none;
  border-width: 0;

  &:hover, &:focus {
    opacity: 1;
    box-shadow: 0 0 12px 4px #00000044;
    border-width: 2px;
    border-style: dashed;
    border-color: #888888;
  }
`;

export interface IderProps {
  entities?: WebContextIderEntities;
  children: React.ReactElement;
}

const basePosition = {
  top: 0, left: 0, width: 0, height: 0,
};

export const Ider = ({
  entities,
  children,
}: IderProps) => {
  React.Children.only(children);

  const { crystalizer } = React.useContext(WebContext);

  const ref = useIder<HTMLElement>(entities as WebContextIderEntities);
  const timerRef1 = React.useRef<NodeJS.Timeout | null>(null);
  const timerRef2 = React.useRef<NodeJS.Timeout | null>(null);

  const [trigger, triggerSet] = React.useState(false);

  const { buttonProps, popoverProps } = crystalizer ? usePopover('entity-data') : {} as ReturnType<typeof usePopover>;

  /**
   * Efficiently get the computed display of the child element.
   */
  const refDisplayed = React.useMemo(
    () => (ref.current ? window.getComputedStyle(ref.current).display !== 'none' : false),
    [ref.current],
  );

  /**
   * Gets the child element's position.
   */
  const refPosition = React.useMemo(() => {
    if (!crystalizer) {
      return basePosition;
    }
    const element = ref.current;
    if (!element || !refDisplayed) {
      return basePosition;
    }
    const {
      top, left, width, height,
    } = element.getBoundingClientRect();
    return {
      top, left, width, height,
    };
  }, [ref, ref.current, trigger, crystalizer, refDisplayed]);

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
    if (crystalizer) {
      window.addEventListener('resize', handleTrigger);

      if (!timerRef1.current) {
        timerRef1.current = setTimeout(handleTrigger, 150);
      }
      if (!timerRef2.current) {
        timerRef2.current = setTimeout(handleTrigger, 500);
      }
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
  }, [crystalizer]);

  return React.cloneElement(children, {
    ref,
    style: {
      ...children.props.style,
      position: 'relative',
    },
    children: (crystalizer === true) ? (<>
      {children.props.children}
      <Popper
        open={true}
        anchorEl={ref.current}
        placement="left-start"
        sx={{ zIndex: 4000 }}
      >
        <button
          css={cssHighlighter}
          style={{
            height: refPosition.height,
            width: refPosition.width,
          }}
          {...buttonProps}
          type="button"
        />
      </Popper>
      <CrystalizerProvider>
        <Popover {...popoverProps}>

        </Popover>
      </CrystalizerProvider>
    </>
    ) : children.props.children,
  });
};
