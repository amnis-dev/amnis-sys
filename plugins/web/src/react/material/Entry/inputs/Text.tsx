import React from 'react';
import {
  OutlinedInput,
  FormControl,
} from '@mui/material';
import type { EntryContextProps } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import { Description, Label } from './parts/index.js';

export const Text: React.FC = () => {
  const {
    entryId,
    entryInputId,
    entryDescriptionId,
    errored,
    labelInput,
    description,
    value,
    disabled,
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
      <Label />
      <OutlinedInput
        id={entryInputId}
        label={labelInput}
        value={value}
        notched
        aria-describedby={description ? entryDescriptionId : undefined}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value, e)}
      />
      <Description />
    </FormControl>
  );
};

export default Text;
