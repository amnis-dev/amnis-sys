import React from 'react';

import { localeSlice, systemSlice } from '@amnis/state';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useMenu, useWebDispatch, useWebSelector } from '../../hooks/index.js';
import type { LanguageButtonProps } from '../../../interface/index.js';

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

export const LanguageButton: React.FC<LanguageButtonProps> = ({
  hideText,
}) => {
  const dispatch = useWebDispatch();

  const systemLanguages = useWebSelector((state) => systemSlice.select.active(state)?.languages ?? ['en']);
  const language = useWebSelector((state) => localeSlice.select.activeCode(state));

  const { buttonProps, menuProps, handleClose } = useMenu('select-language');

  const handleLanguageChange = React.useCallback((code: string) => {
    dispatch(localeSlice.action.codeSet(code));
  }, [localeSlice]);

  return (<>
    <IconButton {...buttonProps}>
      <LanguageIcon />
    </IconButton>
    <Menu {...menuProps}>
      {systemLanguages?.map((code) => (
        <MenuItem
          key={code}
          onClick={() => {
            handleLanguageChange(code);
            handleClose();
          }}
        >
          {languageMap[code]}
        </MenuItem>
      ))}
    </Menu>
  </>);
};

export default LanguageButton;
