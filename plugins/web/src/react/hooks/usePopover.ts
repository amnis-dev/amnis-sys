import type { PopoverProps } from '@mui/material';
import React from 'react';

export function usePopover(label: string) {
  const [anchorEl, anchorElSet] = React.useState<HTMLElement | null>(null);
  const open = React.useMemo(() => Boolean(anchorEl), [anchorEl]);

  const buttonId = React.useMemo(() => `popover-button-${label}`, [label]);
  const popoverId = React.useMemo(() => `popover-${label}`, [label]);

  const handleOpen = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    anchorElSet(event.currentTarget);
  }, [anchorElSet]);

  const handleClose = React.useCallback(() => {
    anchorEl?.blur();
    anchorElSet(null);
  }, [anchorElSet]);

  const buttonProps = React.useMemo < React.HTMLProps<any>>(() => ({
    id: buttonId,
    'aria-controls': open ? popoverId : undefined,
    'aria-haspopover': 'true',
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
