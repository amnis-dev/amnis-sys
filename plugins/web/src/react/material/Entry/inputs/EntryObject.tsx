import React from 'react';
import {
  Box,
  Stack,
  Typography,
} from '@mui/material';
import type { CoreSelectors, Data, UID } from '@amnis/state';
import { dataDefault, dataSelectors, noop } from '@amnis/state';
import type { EntryContextChanges, EntryContextProps } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import { useWebSelector, type RootStateWeb } from '@amnis/web';
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
    // errored,
    label,
    description,
    value,
    properties,
    propertiesRequired,
    disabled,
    onChange,
  } = React.useContext(EntryContext) as EntryContextProps<Record<string, any>>;

  const $id = React.useMemo<string | undefined>(() => value?.$id, [value?.$id]);

  const dataSelect = React.useMemo<CoreSelectors<Data>>(() => {
    if (!$id) {
      return {
        active: noop,
        focused: noop,
        selection: noop,
        difference: noop,
      } as any as CoreSelectors<Data>;
    }

    const sliceKey = $id.match(/([A-Za-z0-9]+):/)?.[1] as keyof RootStateWeb | undefined;

    if (!sliceKey) {
      return {
        active: noop,
        focused: noop,
        selection: noop,
        difference: noop,
      } as any as CoreSelectors<Data>;
    }

    return dataSelectors(sliceKey);
  }, [$id]);

  const difference = useWebSelector(
    (state) => ($id ? dataSelect.difference(state, $id as UID) : undefined),
  );

  const changesProps = React.useMemo<Record<string, EntryContextChanges> | undefined>(() => {
    if (!difference) return undefined;
    return difference.keys.reduce((acc, key) => ({
      ...acc,
      [key]: {
        before: difference.original![key] as any,
        after: difference.updater[key] as any,
      },
    }), {});
  }, [difference?.keys]);

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
  }, [value, onChange]);

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
        '&:has(*:focus)': {
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
      <Stack gap={3}>
        {properties.map((property) => (
          <Entry
            key={property.key}
            schema={property}
            changes={changesProps?.[property.key]}
            disabled={disabled}
            required={propertiesRequired.includes(property.key)}
            value={value?.[property.key] ?? dataDefault(property.type)}
            onChange={(value, event) => handleChange(property.key, value, event)}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default EntryObject;
