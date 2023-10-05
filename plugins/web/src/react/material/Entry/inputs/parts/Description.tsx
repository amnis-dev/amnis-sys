import React from 'react';
import type { FormHelperTextProps } from '@mui/material';
import {
  FormHelperText,
} from '@mui/material';
import { EntryContext } from '@amnis/web/react/context';

export const Description: React.FC<FormHelperTextProps> = (
  props,
) => {
  const {
    description,
    entryDescriptionId,
    condensed,
  } = React.useContext(EntryContext);
  return description ? (
    <FormHelperText
      id={entryDescriptionId}
      {...props}
      sx={{ ...props.sx, display: condensed ? 'none' : undefined }}
    >
      {description}
    </FormHelperText>
  ) : null;
};

export default Description;
