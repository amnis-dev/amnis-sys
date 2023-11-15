import React from 'react';

import { localeSlice, systemSlice } from '@amnis/state';
import {
  Box, IconButton, Menu, MenuItem, Stack,
} from '@mui/material';
import { Language as LanguageIcon, Check as CheckIcon } from '@mui/icons-material';
import { useMenu, useWebDispatch, useWebSelector } from '@amnis/web/react/hooks';
import type { LanguageButtonProps } from '@amnis/web/ui';

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
    if (language === code) { return; }
    dispatch(localeSlice.action.codeSet(code));
  }, [language, localeSlice]);

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
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Box width="1.8rem">
              {language === code ? <CheckIcon sx={{ mr: 1 }} /> : null}
            </Box>
            <Box flex={1}>
              {languageMap[code]}
            </Box>
          </Stack>
        </MenuItem>
      ))}
    </Menu>
  </>);
};

export default LanguageButton;
