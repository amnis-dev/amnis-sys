import type { MenuItemProps, MenuProps } from '@mui/material';
import React from 'react';

export function useMenu(label: string) {
  const [anchorEl, anchorElSet] = React.useState<HTMLElement | null>(null);
  const open = React.useMemo(() => Boolean(anchorEl), [anchorEl]);

  const buttonId = React.useMemo(() => `menu-button-${label}`, [label]);
  const menuId = React.useMemo(() => `menu-${label}`, [label]);

  const handleOpen = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    anchorElSet(event.currentTarget);
  }, [anchorElSet]);

  const handleClose = React.useCallback(() => {
    anchorElSet(null);
  }, [anchorElSet]);

  const buttonProps = React.useMemo<React.HTMLProps<HTMLButtonElement>>(() => ({
    id: buttonId,
    'aria-controls': open ? menuId : undefined,
    'aria-haspopup': 'true',
    'aria-expanded': open ? 'true' : undefined,
    onClick: handleOpen,
  }), [open, handleOpen, buttonId, menuId]);

  const menuProps = React.useMemo<MenuProps>(() => ({
    id: menuId,
    anchorEl,
    open,
    onClose: handleClose,
    MenuListProps: {
      'aria-labelledby': buttonId,
    },
  }), [anchorEl, open, handleClose, buttonId, menuId]);

  const menuItemProps = React.useMemo<MenuItemProps>(() => ({
    onClick: handleClose,
  }), [handleClose]);

  return {
    open,
    handleOpen,
    handleClose,
    buttonProps,
    menuProps,
    menuItemProps,
  };
}

export default useMenu;
