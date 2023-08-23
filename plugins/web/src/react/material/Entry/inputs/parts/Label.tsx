import React from 'react';
import {
  InputLabel, Stack, Tooltip, Typography,
} from '@mui/material';
import { Error } from '@mui/icons-material';
import { EntryContext } from '@amnis/web/react/context';

export const Label: React.FC = () => {
  const {
    label,
    required,
    optionalText,
    entryLabelId,
    entryInputId,
    errored,
    errors,
    errorText,
  } = React.useContext(EntryContext);
  return (
    <Tooltip title={errored ? (<>
      {errors.map((error) => (
        <div key={error}>{errorText[error]}</div>
      ))}
    </>) : false} placement="right">
      <InputLabel
        id={entryLabelId}
        htmlFor={entryInputId}
        shrink
      >
        <Stack direction="row" alignItems="center">
          <Typography component="span" variant="inherit">
            {label}
          </Typography>
          {!required ? (
            <Typography component="span" variant="inherit">
              <i>&nbsp;{optionalText}</i>
            </Typography>
          ) : null}
          {errored ? (
            <>&nbsp;<Error /></>
          ) : null}
        </Stack>
      </InputLabel>
    </Tooltip>
  );
};

export default Label;
