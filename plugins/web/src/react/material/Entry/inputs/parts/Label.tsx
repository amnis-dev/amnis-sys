import React from 'react';
import {
  FormLabel,
  InputLabel,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Error } from '@mui/icons-material';
import { EntryContext } from '@amnis/web/react/context';

export interface LabelProps {
  /**
   * Type of label.
   */
  type?: 'form' | 'input';

  /**
   * Shows the label in strunken state.
   */
  shrink?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  type = 'form',
  shrink = false,
}) => {
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
    <Tooltip title={errored ? (<>
      {errors.map((error) => (
        <div key={error}>{errorText[error]}</div>
      ))}
    </>) : false} placement="right">
      <LabelComponent
        id={entryLabelId}
        htmlFor={entryInputId}
        shrink={shrink}
      >
        <Stack direction="row" alignItems="center">
          <Typography component="span" variant="inherit">
            {label}
          </Typography>
          {!required ? (
            <Typography component="span" variant="body2">
              <i>&nbsp;{optionalText}</i>
            </Typography>
          ) : null}
          {errored ? (
            <>&nbsp;<Error /></>
          ) : null}
        </Stack>
      </LabelComponent>
    </Tooltip>
  );
};

export default Label;
