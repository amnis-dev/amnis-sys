import type { PopoverProps } from '@mui/material';
import React from 'react';

export interface UsePopoverOptions {
  closeStopPropagation?: boolean;
  closePreventDefault?: boolean;
}

export function usePopover(
  label: string,
  options: UsePopoverOptions = {
    closeStopPropagation: false,
    closePreventDefault: false,
  },
) {
  const [anchorEl, anchorElSet] = React.useState<HTMLElement | null>(null);
  const open = React.useMemo(() => Boolean(anchorEl), [anchorEl]);

  const buttonId = React.useMemo(() => `popover-button-${label}`, [label]);
  const popoverId = React.useMemo(() => `popover-${label}`, [label]);

  const handleOpen = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    anchorElSet(event.currentTarget);
  }, [anchorElSet]);

  const handleClose = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    anchorEl?.blur();
    anchorElSet(null);
    if (options.closeStopPropagation) { event.stopPropagation(); }
    if (options.closePreventDefault) { event.preventDefault(); }
  }, [anchorElSet]);

  const buttonProps = React.useMemo < React.ButtonHTMLAttributes<HTMLButtonElement>>(() => ({
    id: buttonId,
    'aria-controls': open ? popoverId : undefined,
    'aria-expanded': open ? 'true' : undefined,
    onClick: handleOpen,
  }), [open, handleOpen, buttonId, popoverId]);

  const popoverProps = React.useMemo<PopoverProps>(() => ({
    id: popoverId,
    anchorEl,
    open,
    onClose: handleClose,
  }), [anchorEl, open, handleClose, buttonId, popoverId]);

  return {
    popoverOpen: open,
    handleOpen,
    handleClose,
    buttonProps,
    popoverProps,
  };
}

export default usePopover;
