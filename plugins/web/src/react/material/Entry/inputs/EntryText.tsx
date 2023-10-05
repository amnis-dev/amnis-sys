import React from 'react';
import {
  OutlinedInput,
  FormControl,
  Box,
} from '@mui/material';
import type { EntryContextProps } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import { Description, Label } from './parts/index.js';

export const EntryText: React.FC = () => {
  const {
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
    onChange,
  } = React.useContext(EntryContext) as EntryContextProps<string>;

  return (
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
        <Description sx={{ m: 0 }} />
      </Box>
      <OutlinedInput
        id={entryInputId}
        label={labelInput}
        value={value}
        notched={condensed}
        inputProps={{
          'aria-labelledby': entryLabelId,
          'aria-describedby': description ? entryDescriptionId : undefined,
        }}
        autoFocus={autoFocus}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value, e)}
      />
    </FormControl>
  );
};

export default EntryText;
