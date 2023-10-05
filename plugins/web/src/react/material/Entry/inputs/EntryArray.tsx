import React from 'react';
import {
  FormControl,
  Box,
  Stack,
  Chip,
  IconButton,
  FormLabel,
  Typography,
} from '@mui/material';
import { dataDefault, dataName } from '@amnis/state';
import { AddCircle } from '@mui/icons-material';
import type { EntryContextProps } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import { Description } from './parts/index.js';
import type { EntryProps } from '../Entry.js';

export interface EntryArrayProps {
  /**
   * Entry component.
   */
  Entry: React.FC<EntryProps>;
}

export const EntryArray: React.FC<EntryArrayProps> = ({
  Entry,
}) => {
  const {
    items,
    label,
    entryId,
    entryLabelId,
    errored,
    value,
    disabled,
    onChange,
  } = React.useContext(EntryContext) as EntryContextProps<any[]>;

  const [valueInner, valueInnerSet] = React.useState(dataDefault(items.type));

  const handleInsert = React.useCallback((valueInnerNext: any) => {
    if (valueInnerNext === undefined ?? !valueInnerNext?.length) return;

    valueInnerSet(valueInnerNext);
    onChange([...(value ?? []), valueInnerNext]);
  }, [value, onChange, valueInnerSet]);

  return (
    <FormControl
      id={entryId}
      error={errored}
      disabled={disabled}
      aria-labelledby={entryLabelId}
      role="group"
      variant="outlined"
      size="small"
      fullWidth
    >
      <FormLabel>
        <Stack
          direction="row"
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            '&:has(*:focus)': {
              borderColor: 'primary.main',
              [`#${entryLabelId}`]: {
                color: 'primary.main',
              },
            },
          }}
        >
          <Box p={2} width="100%">

            <Box mb={1}>
              <Typography id={entryLabelId} variant="body1">
                {label}
              </Typography>
              <Description sx={{ m: 0 }} />
            </Box>

            <Stack
              direction="row"
              flexWrap="wrap"
              alignItems="center"
              gap={1}
              role="presentation"
            >
              {value?.map((valueItem, index) => {
                const label = dataName(valueItem);
                return (
                  <Chip
                    key={`${label}#${index}`}
                    role="textbox"
                    aria-multiline="false"
                    aria-label={label}
                    aria-readonly="true"
                    label={dataName(label)}
                    onDelete={() => {
                      const valueNext = value.filter((_, i) => i !== index);
                      onChange(valueNext);
                    }}
                  />
                );
              })}
            </Stack>

            <Box mt={2}>
              <Stack direction="row" gap={2}>
                <Entry
                  schema={items}
                  value={valueInner as any}
                  onChange={(valueInnerNext) => valueInnerSet(valueInnerNext)}
                  condensed
                />
                <Box>
                  <IconButton
                    onClick={() => handleInsert(valueInner)}
                  >
                    <AddCircle />
                  </IconButton>
                </Box>
              </Stack>
            </Box>

          </Box>

        </Stack>
      </FormLabel>
    </FormControl>
  );
};

export default EntryArray;
