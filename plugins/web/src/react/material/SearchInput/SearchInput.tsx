import { noop } from '@amnis/state';
import { Search } from '@mui/icons-material';
import {
  Box,
  IconButton, InputBase, Paper,
} from '@mui/material';
import React from 'react';

interface Props {
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onChangeDebouncedTimeout?: number;
  onChange?: (value: string) => void;
  onChangeDebounced?: (value: string) => void;
  onSearch?: (value: string) => void;
}

export const SearchInput: React.FC<Props> = ({
  leftComponent,
  rightComponent,
  onChangeDebouncedTimeout = 500,
  onChange = noop,
  onChangeDebounced = noop,
  onSearch = noop,
}) => {
  const debounceTimeout = React.useRef<NodeJS.Timeout>();

  const handleChangeDebounced = React.useCallback((value: string) => {
    onChangeDebounced(value);
  }, [onChangeDebounced]);

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onChange(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      handleChangeDebounced(value);
    }, onChangeDebouncedTimeout);
  }, [onChange]);

  const handleSearch = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  }, [onChange]);

  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {leftComponent ? (<Box>
        {leftComponent}
      </Box>) : null}
      <Box flex={1} pl={1} pr={1}>
        <InputBase
          placeholder="Search"
          onChange={handleChange}
          fullWidth
        />
      </Box>
      <Box>
        <IconButton
          onClick={handleSearch}
        >
          <Search />
        </IconButton>
      </Box>
      {rightComponent ? (<Box>
        {rightComponent}
      </Box>) : null}
    </Paper>
  );
};

export default SearchInput;
