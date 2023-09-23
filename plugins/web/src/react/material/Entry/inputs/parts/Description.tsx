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
  } = React.useContext(EntryContext);
  return description ? (
    <FormHelperText id={entryDescriptionId} {...props}>{description}</FormHelperText>
  ) : null;
};

export default Description;
