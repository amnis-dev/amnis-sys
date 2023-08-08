import React from 'react';
import { ButtonLanguageProps } from '../../../interface/ButtonLanguage.types.js';
import { useWebDispatch, useWebSelector } from '../../hooks/index.js';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { localeSlice, systemSlice } from '@amnis/state';

const languageMap: Record<string, string> = {
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'it': 'Italiano',
  'ja': '日本語',
  'ko': '한국어',
  'zh': '中文',
  'pt': 'Português',
  'ru': 'Русский',
};

export const ButtonLanguage: React.FC<ButtonLanguageProps> = ({
  hideText = false,
}) => {
  const dispatch = useWebDispatch();

  const systemLanguages = useWebSelector((state) => systemSlice.select.active(state)?.languages ?? ['en']);
  const language = useWebSelector((state) => localeSlice.select.activeCode(state));

  const handleLanguageChange = React.useCallback((code: string) => {
    dispatch(localeSlice.action.codeSet(code));
  }, [localeSlice]);

  return (
    <Popover
      content={
        <Menu>
          {systemLanguages?.map((code) => (
            <MenuItem
              key={code}
              text={languageMap[code]}
              onClick={() => handleLanguageChange(code)}
            />
          ))}
        </Menu>
      }
      placement={'bottom'}
    >
      <Button icon="globe">{(!hideText && languageMap[language]) ?? null}</Button>
    </Popover>
  );
};

export default ButtonLanguage;
