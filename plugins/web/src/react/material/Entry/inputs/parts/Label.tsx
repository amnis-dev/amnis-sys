import React from 'react';
import {
  Box,
  FormLabel,
  IconButton,
  InputLabel,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Error, FlagCircle } from '@mui/icons-material';
import { EntryContext } from '@amnis/web/react/context';

export interface LabelProps {
  /**
   * Type of label.
   */
  type?: 'form' | 'input';

  /**
   * Hide the optional text.
   */
  hideOptionalText?: boolean;

  /**
   * Shows the label in strunken state.
   */
  shrink?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  type = 'form',
  shrink = false,
  hideOptionalText = false,
}) => {
  const {
    label,
    changes,
    condensed,
    required,
    optionalText,
    entryLabelId,
    entryInputId,
    errored,
    errors,
    errorText,
  } = React.useContext(EntryContext);

  const LabelComponent = React.useMemo(() => {
    switch (type) {
      case 'form':
        return FormLabel;
      case 'input':
        return InputLabel;
      default:
        return FormLabel;
    }
  }, [type]);

  return (
    <LabelComponent
      id={entryLabelId}
      htmlFor={entryInputId}
      shrink={type === 'input' ? shrink : undefined}
      sx={{ display: 'inline-flex' }}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography component="span" variant="inherit">
          {label}
        </Typography>
        {(!required && !condensed && !hideOptionalText) ? (
          <Typography component="span" variant="body2">
            <i>&nbsp;{optionalText}</i>
          </Typography>
        ) : null}
        <Tooltip
          title={changes ? 'This input has unsaved changes' : undefined}
          placement='top'
        >
          <IconButton
            size="small"
            sx={{
              visibility: changes ? 'visible' : 'hidden',
              margin: '-5px',
            }}
            aria-hidden={changes ? 'false' : 'true'}
          >
            <FlagCircle color="warning" fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={errored ? 'The input is not valid' : undefined}
          placement='top'
        >
          <IconButton
            size="small"
            sx={{
              visibility: errored ? 'visible' : 'hidden',
              margin: '-5px',
            }}
            aria-hidden={errored ? 'false' : 'true'}
          >
            <Error color="error" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </LabelComponent>
  );
};

export default Label;
