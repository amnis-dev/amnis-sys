import React from 'react';
import {
  FormHelperText,
} from '@mui/material';
import { EntryContext } from '@amnis/web/react/context';

export const Description: React.FC = () => {
  const {
    description,
    entryDescriptionId,
  } = React.useContext(EntryContext);
  return description ? (
    <FormHelperText id={entryDescriptionId}>{description}</FormHelperText>
  ) : null;
};

export default Description;
