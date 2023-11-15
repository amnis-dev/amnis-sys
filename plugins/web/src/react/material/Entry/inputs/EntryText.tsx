import React from 'react';
import {
  OutlinedInput,
  FormControl,
  Box,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { ArrowRight, Search } from '@mui/icons-material';
import type { Entity, Locale } from '@amnis/state';
import { Text } from '@amnis/web/react/material';
import type { EntryContextProps } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import { useDebounce, useTranslate } from '@amnis/web/react/hooks';
import { Description, Label } from './parts/index.js';

const EntitySearchLocaleDialog = React.lazy(() => import('../../EntitySearchLocaleDialog/EntitySearchLocaleDialog.js'));

export const EntryText: React.FC = () => {
  const {
    label,
    labelInput,
    entryId,
    entryInputId,
    entryDescriptionId,
    entryLabelId,
    errored,
    description,
    value,
    disabled,
    autoFocus,
    condensed,
    multiline,
    onChange,
    onBlur,
  } = React.useContext(EntryContext) as EntryContextProps<string>;

  /**
   * Debounced value.
   */
  const debouncedValue = useDebounce(value);

  /**
   * State to control the locale search dialog.
   */
  const [localeDialogOpen, localeDialogOpenSet] = React.useState(false);

  /**
   * Whether the value is a locale key.
   */
  const isLocaleKey = React.useMemo(() => debouncedValue?.startsWith('%') ?? false, [debouncedValue]);

  const localeKeyObject = React.useMemo<{ value?: string}>(
    () => (isLocaleKey && debouncedValue ? { value: debouncedValue } : {}),
    [debouncedValue, isLocaleKey],
  );

  const translated = useTranslate(localeKeyObject);
  const translatedValue = React.useMemo(
    () => {
      const rows = multiline ?? 1;
      const returnValue = translated?.value ?? '';
      if (returnValue.length > (10 * rows)) {
        return `${returnValue.slice(0, 10 * rows - 3)}...`;
      }
      return returnValue;
    },
    [translated, multiline],
  );

  const descriptionSx = React.useMemo(() => ({ m: 0 }), []);

  /**
   * Handles the change event of the input element.
   */
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value, e),
    [onChange],
  );

  /**
   * Handles the click event of the locale search.
   */
  const handleLocaleSearchClick = React.useCallback(
    () => localeDialogOpenSet(true),
    [],
  );

  /**
   * Handles the select event of the locale search.
   */
  const handleLocaleSearchSelect = React.useCallback(
    (locale: Entity<Locale>) => {
      onChange(`%${locale.name}`);
      localeDialogOpenSet(false);
    },
    [onChange],
  );

  return (<>
    <FormControl
      id={entryId}
      error={errored}
      disabled={disabled}
      variant="outlined"
      size="small"
      fullWidth
    >
      <Box mb={condensed ? 0 : 0.5}>
        <Label type={condensed ? 'input' : 'form'} shrink={condensed} />
        <Description sx={descriptionSx} />
      </Box>
      <Stack direction="row">
        <Box
          flex={2}
        >
          <OutlinedInput
            id={entryInputId}
            label={condensed ? label : labelInput}
            value={value || ''}
            notched={condensed}
            inputProps={{
              'aria-labelledby': entryLabelId,
              'aria-describedby': description ? entryDescriptionId : undefined,
            }}
            autoFocus={autoFocus}
            onChange={handleChange}
            onBlur={onBlur}
            multiline={!!multiline}
            rows={multiline}
            fullWidth
            endAdornment={isLocaleKey ? (
              <InputAdornment position="end">
                <IconButton onClick={handleLocaleSearchClick}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ) : null}
          />
        </Box>
        {isLocaleKey ? (
          <Box flex={1}>
            <Stack direction="row" sx={{ height: '100%' }}>
              <Box alignSelf="center">
                <ArrowRight />
              </Box>
              <Box
                flex={1}
                sx={{
                  height: '100%',
                  overflow: 'scroll',
                  bgcolor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Box
                  p={1}
                  sx={{
                    height: multiline ? `${23 * multiline}px` : '23px',
                  }}
                >
                  <Text>{translatedValue}</Text>
                </Box>
              </Box>
            </Stack>
          </Box>
        ) : null}
      </Stack>
    </FormControl>
    {isLocaleKey ? (
      <React.Suspense fallback={null}>
        <EntitySearchLocaleDialog
          open={localeDialogOpen}
          onClose={() => localeDialogOpenSet(false)}
          onSelect={handleLocaleSearchSelect}
        />
      </React.Suspense>
    ) : null}
  </>);
};

export default EntryText;
