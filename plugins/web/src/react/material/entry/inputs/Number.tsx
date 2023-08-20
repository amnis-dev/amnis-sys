import React from 'react';
import {
  OutlinedInput,
  FormControl,
} from '@mui/material';
import type { EntryContextProps } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import { Description, Label } from './parts/index.js';

export const Number: React.FC = () => {
  const {
    entryId,
    entryInputId,
    entryDescriptionId,
    errored,
    labelInput,
    description,
    value,
    disabled,
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
      <Label />
      <OutlinedInput
        id={entryInputId}
        label={labelInput}
        value={value}
        type="number"
        notched
        aria-describedby={description ? entryDescriptionId : undefined}
      />
      <Description />
    </FormControl>
  );
};

export default Number;
