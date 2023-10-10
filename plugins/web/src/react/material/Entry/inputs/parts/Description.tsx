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

  /**
   * FormHelperTest sx prop memoized.
   */
  const sx = React.useMemo(() => ({
    ...props.sx,
    display: condensed ? 'none' : undefined,
  }), [props.sx, condensed]);

  /**
   * FormHelperTextTest props memoized.
   */
  const propsMemoized = React.useMemo(() => ({
    ...props,
    id: entryDescriptionId,
    sx: { ...props.sx, ...sx },
  }), [props, entryDescriptionId, sx]);

  return description ? (
    <FormHelperText
      {...propsMemoized}
    >
      {description}
    </FormHelperText>
  ) : null;
};

export default Description;
