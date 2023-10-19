import React from 'react';
import {
  OutlinedInput,
  FormControl,
  Box,
} from '@mui/material';
import type { EntryContextProps } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import { Description, Label } from './parts/index.js';

export const EntryNumber: React.FC = () => {
  const {
    entryId,
    entryInputId,
    entryDescriptionId,
    entryLabelId,
    errored,
    description,
    value,
    disabled,
    onChange,
    onBlur,
  } = React.useContext(EntryContext) as EntryContextProps<number>;

  return (
    <FormControl
      id={entryId}
      error={errored}
      disabled={disabled}
      variant="outlined"
      size="small"
      fullWidth
    >
      <Box mb={0.5}>
        <Label />
        <Description sx={{ m: 0 }} />
      </Box>
      <OutlinedInput
        id={entryInputId}
        value={value}
        type="number"
        inputProps={{
          'aria-labelledby': entryLabelId,
          'aria-describedby': description ? entryDescriptionId : undefined,
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(parseInt(e.target.value, 10), e);
        }}
        onBlur={onBlur}
      />
    </FormControl>
  );
};

export default EntryNumber;
