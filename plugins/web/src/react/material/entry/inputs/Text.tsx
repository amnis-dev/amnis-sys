import React from 'react';
import {
  TextField,
} from '@mui/material';
import { EntryContext } from '../EntryContext.js';

export const Text: React.FC = () => {
  const { label } = React.useContext(EntryContext);

  return (
    <TextField label={label} size="small" />
  );
};

export default Text;
