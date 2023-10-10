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
import { dataName, stateSelect } from '@amnis/state';
import { AddCircle } from '@mui/icons-material';
import { apiCrud } from '@amnis/api';
import type { EntryContextProps } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import {
  useTranslate, useWebDispatch, useWebSelector,
} from '@amnis/web/react/hooks';
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
    uniqueItems,
    label,
    entryId,
    entryLabelId,
    errored,
    value,
    disabled,
    onChange,
  } = React.useContext(EntryContext) as EntryContextProps<any[]>;

  const dispatch = useWebDispatch();

  const [valueInner, valueInnerSet] = React.useState(null);

  const handleInsert = React.useCallback((valueInnerNext: any) => {
    if (valueInnerNext === undefined ?? !valueInnerNext?.length) return;

    valueInnerSet(null);
    // Ensure unique items.
    if (uniqueItems && value?.includes(valueInnerNext)) return;
    onChange([...(value ?? []), valueInnerNext]);
  }, [value, onChange, valueInnerSet]);

  const isReferences = React.useMemo(() => items.format === 'reference', [items.format]);
  const sliceKey = React.useMemo(
    () => {
      if (!isReferences || items.type !== 'string') return undefined;
      return items?.pattern?.match(/([A-Za-z0-9]+):/)?.[1] as string | undefined;
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-ignore */
    [isReferences, items?.pattern],
  );

  const entites = useTranslate(
    useWebSelector((state) => stateSelect.sliceEntities(state, sliceKey ?? '')),
  )!;
  const entityLabels = React.useMemo(() => Object.values(entites).reduce<Record<string, string>>(
    (acc, cur) => {
      acc[cur.$id] = dataName(cur);
      return acc;
    },
    {},
  ), [entites]);

  React.useEffect(() => {
    console.log({ isReferences, sliceKey });
    if (!isReferences || !sliceKey) return;
    dispatch(apiCrud.endpoints.read.initiate({
      [sliceKey]: {
        $query: {
          $id: {
            $in: value,
          },
        },
      },
    }));
  }, []);

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
                const label = isReferences ? entityLabels?.[valueItem] : dataName(valueItem);
                return (
                  <Chip
                    key={`${label}#${index}`}
                    role="textbox"
                    aria-multiline="false"
                    aria-label={label}
                    aria-readonly="true"
                    label={label}
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
                  onSelect={handleInsert}
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
