import React from 'react';
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import type { CoreSelectors, Data, UID } from '@amnis/state';
import { dataDefault, dataSelectors, noop } from '@amnis/state';
import { FlagCircle, Error } from '@mui/icons-material';
import type { EntryContextChanges, EntryContextProps, EntryContextSchemaErrors } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import { useWebSelector, type RootStateWeb } from '@amnis/web';
import { Text } from '../../Text/index.js';
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
    tipText,
    label,
    description,
    value,
    properties,
    propertiesRequired,
    disabled,
    onChange,
    onBlur,
  } = React.useContext(EntryContext) as EntryContextProps<Record<string, any>>;

  const $id = React.useMemo<string | undefined>(() => value?.$id, [value?.$id]);

  const [
    propertiesErrors,
    propertiesErrorsSet,
  ] = React.useState<Record<string, EntryContextSchemaErrors[]>>({});

  const propertiesErrored = React.useMemo<boolean>(
    () => Object.keys(propertiesErrors).length > 0,
    [propertiesErrors],
  );

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

  const changed = React.useMemo<boolean>(
    () => (difference?.keys.length ?? 0) > 0,
    [difference?.keys],
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

  const handlePropertiesError = React.useCallback((
    propertyKey: string,
    errors: EntryContextSchemaErrors[],
  ) => {
    if (errors.length === 0 && propertiesErrors[propertyKey] !== undefined) {
      const propertiesErrorsNext = { ...propertiesErrors };
      delete propertiesErrorsNext[propertyKey];
      propertiesErrorsSet(propertiesErrorsNext);
      return;
    }
    if (errors.length === 0) {
      return;
    }
    propertiesErrorsSet({
      ...propertiesErrors,
      [propertyKey]: errors,
    });
  }, [propertiesErrors, propertiesErrorsSet]);

  const borderColor = React.useMemo(() => {
    if (propertiesErrored) return 'error.main';
    if (difference?.keys.length) return 'warning.main';
    return 'divider';
  }, [propertiesErrored, difference?.keys]);

  const borderColorFocused = React.useMemo(() => {
    if (propertiesErrored) return 'error.main';
    if (difference?.keys.length) return 'warning.main';
    return 'primary.main';
  }, [propertiesErrored, difference?.keys]);

  const sxStack = React.useMemo(() => ({
    borderRight: 0,
    borderLeft: 2,
    borderTop: 0,
    borderBottom: 0,
    paddingLeft: '12px',
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    borderColor,
    margin: 0,
    '&:has(*:focus)': {
      borderLeft: 3,
      paddingLeft: '11px',
      borderColor: borderColorFocused,
    },
  }), [borderColor, borderColorFocused]);

  const Entries = React.useMemo(() => properties.map((property) => (
    <Entry
      key={property.key}
      schema={property}
      changes={changesProps?.[property.key]}
      disabled={disabled}
      required={propertiesRequired.includes(property.key)}
      value={value?.[property.key] ?? dataDefault(property.type)}
      onChange={(value, event) => handleChange(property.key, value, event)}
      onError={(errors) => handlePropertiesError(property.key, errors)}
    />
  )), [properties, value, changesProps]);

  return (
    <Stack
      id={entryId}
      component="fieldset"
      aria-labelledby={entryLabelId}
      aria-describedby={description ? entryDescriptionId : undefined}
      sx={sxStack}
      onBlur={onBlur}
    >
      <Box mb={2}>
        <Stack direction="row" gap={1}>
          <Text
            id={entryLabelId}
            component="legend"
            variant="h4"
            sx={{ padding: 0, margin: 0 }}
          >
            {label}
          </Text>
          <Box>
            <Tooltip
              title={changed ? tipText.changes : undefined}
              placement='top'
            >
              <IconButton
                sx={{
                  display: changed ? 'flex' : 'none',
                  visibility: changed ? 'visible' : 'hidden',
                  margin: '-5px',
                }}
                aria-hidden={changed ? 'false' : 'true'}
              >
                <FlagCircle color="warning" fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip
              title={changed ? tipText.errors : undefined}
              placement='top'
            >
              <IconButton
                sx={{
                  display: propertiesErrored ? 'flex' : 'none',
                  visibility: propertiesErrored ? 'visible' : 'hidden',
                  margin: '-5px',
                }}
                aria-hidden={propertiesErrored ? 'false' : 'true'}
              >
                <Error color="error" fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
        {description ? (
          <Text
            id={entryDescriptionId}
            component="p"
          >
            {description}
          </Text>
        ) : null}
      </Box>
      <Stack gap={3}>
        {Entries}
      </Stack>
    </Stack>
  );
};

export default EntryObject;
