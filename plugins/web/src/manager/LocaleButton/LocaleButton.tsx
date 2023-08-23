import React from 'react';
import {
  CircularProgress, IconButton, Menu, MenuItem,
} from '@mui/material';
import { Language } from '@mui/icons-material';
import { ManagerContext } from '../ManagerContext.js';

const languageMap: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  pt: 'Português',
  ru: 'Русский',
};

export const LocaleButton = () => {
  const { localeCode, localeCodeSet, localeLoading } = React.useContext(ManagerContext);

  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchor);

  const handleOpen = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget);
  }, []);
  const handleClose = React.useCallback(() => {
    setAnchor(null);
  }, []);

  return (<>
    <IconButton
      id="manager-language"
      variant="contained"
      sx={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        bgcolor: 'background.paper',
        '&:hover, &:active': {
          opacity: 0.8,
          bgcolor: 'background.paper',
        },
      }}
      onClick={handleOpen}
    >
      <CircularProgress sx={{ display: localeLoading ? undefined : 'none' }} size={24} />
      <Language sx={{ display: localeLoading ? 'none' : undefined }} />
    </IconButton>
    <Menu
      id="basic-menu"
      anchorEl={anchor}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'manager-language',
      }}
    >
      <MenuItem
        selected={localeCode === 'en'}
        onClick={() => { localeCodeSet('en'); handleClose(); }}
      >
        {languageMap.en}
      </MenuItem>
      <MenuItem
        selected={localeCode === 'de'}
        onClick={() => { localeCodeSet('de'); handleClose(); }}
      >
        {languageMap.de}
      </MenuItem>
    </Menu>
  </>);
};

export default LocaleButton;
