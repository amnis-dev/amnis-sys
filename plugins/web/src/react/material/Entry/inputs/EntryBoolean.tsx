import React from 'react';
import {
  FormControl,
  Stack,
  Box,
  Checkbox,
  Typography,
  FormLabel,
} from '@mui/material';
import type { EntryContextProps } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import { Description } from './parts/index.js';

export const EntryBoolean: React.FC = () => {
  const {
    entryId,
    entryInputId,
    entryDescriptionId,
    errored,
    entryLabelId,
    label,
    description,
    value,
    disabled,
    onChange,
  } = React.useContext(EntryContext) as EntryContextProps<boolean>;

  const checkboxRef = React.useRef<HTMLInputElement>(null);

  return (
    <FormControl
      id={entryId}
      error={errored}
      disabled={disabled}
      variant="outlined"
      size="small"
      fullWidth
    >
      <FormLabel>
        <Stack
          direction="row"
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            cursor: 'pointer',
            '&:has(input:focus)': {
              borderColor: 'primary.main',
            },
          }}
        >
          <Box>
            <Checkbox
              ref={checkboxRef}
              inputProps={{
                id: entryInputId,
                'aria-labelledby': entryLabelId,
                'aria-describedby': description ? entryDescriptionId : undefined,
              }}
              checked={value}
              onChange={(event, checked) => onChange(checked, event)}
            />
          </Box>
          <Box>
            <Box pt={1.2} pb={0.5}>
              <Typography id={entryLabelId} variant="body1">
                {label}
              </Typography>
            </Box>
            <Description sx={{
              m: 0,
              pb: 1,
            }} />
          </Box>
        </Stack>
      </FormLabel>
    </FormControl>
  );
};

export default EntryBoolean;
