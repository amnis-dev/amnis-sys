import React from 'react';
import {
  Box,
  Stack,
  Typography,
} from '@mui/material';
import type { EntryContextProps } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import type { EntryProps } from '../Entry.js';

export interface EntryObjectProps {
  /**
   * Entry component.
   */
  Entry: React.FC<EntryProps>;
}

export const EntryObject: React.FC<EntryObjectProps> = ({
  Entry,
}) => {
  const {
    entryId,
    entryDescriptionId,
    entryLabelId,
    errored,
    label,
    description,
    value,
    properties,
    disabled,
    onChange,
  } = React.useContext(EntryContext) as EntryContextProps<Record<string, any>>;

  const handleChange = React.useCallback((
    propertyKey: string,
    valueInput: any,
    event: React.ChangeEvent<HTMLElement>,
  ) => {
    const valueNext = {
      ...value,
      [propertyKey]: valueInput,
    };

    onChange(valueNext, event);
  }, [value]);

  return (
    <Stack
      id={entryId}
      component="fieldset"
      aria-labelledby={entryLabelId}
      aria-describedby={description ? entryDescriptionId : undefined}
      sx={{
        borderRight: 0,
        borderLeft: 2,
        borderTop: 0,
        borderBottom: 0,
        paddingLeft: '12px',
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        borderColor: 'divider',
        margin: 0,
        '&:has(input:focus)': {
          borderLeft: 3,
          paddingLeft: '11px',
          borderColor: 'primary.main',
        },
      }}
    >
      <Box mb={2}>
        <Typography
          id={entryLabelId}
          component="legend"
          variant="h4"
          sx={{ padding: 0, margin: 0 }}
        >
          {label}
        </Typography>
        {description ? (
          <Typography
            id={entryDescriptionId}
            component="p"
          >
            {description}
          </Typography>
        ) : null}
      </Box>
      <Stack gap={2}>
        {properties.map((property) => (
          <Entry
            key={property.key}
            schema={property}
            disabled={disabled}
            value={value?.[property.key] ?? null}
            onChange={(value, event) => handleChange(property.key, value, event)}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default EntryObject;
