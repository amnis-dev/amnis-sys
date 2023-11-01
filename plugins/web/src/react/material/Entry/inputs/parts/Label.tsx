import React from 'react';
import {
  FormLabel,
  IconButton,
  InputLabel,
  Stack,
  Tooltip,
} from '@mui/material';
import { Error, FlagCircle } from '@mui/icons-material';
import { EntryContext } from '@amnis/web/react/context';
import { Text } from '@amnis/web/react/material';

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
    tipText,
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
        <Text component="span" noSkeleton={shrink} inherit>
          {label}
        </Text>
        {(!required && !condensed && !hideOptionalText) ? (
          <Text component="span" variant="body2" sx={{
            '&:before': {
              content: '" "',
              whiteSpace: 'pre',
            },
          }}>
            {optionalText}
          </Text>
        ) : null}
        <Tooltip
          title={changes ? tipText.changes : undefined}
          placement='top'
        >
          <IconButton
            size="small"
            sx={{
              display: changes ? 'flex' : 'none',
              visibility: changes ? 'visible' : 'hidden',
              margin: '-5px',
            }}
            aria-hidden={changes ? 'false' : 'true'}
          >
            <FlagCircle color="warning" fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={errored ? tipText.errors : undefined}
          placement='top'
        >
          <IconButton
            size="small"
            sx={{
              display: errored ? 'flex' : 'none',
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
